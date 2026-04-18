import amqp from 'amqplib';
import { prisma } from './db';

let channel: amqp.Channel;

export const initRabbitMQ = async () => {
  const MAX_RETRIES = 5;
  let retryCount = 0;

  while (retryCount < MAX_RETRIES) {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
      channel = await connection.createChannel();
      await channel.assertQueue('USER_DELETED');
      await channel.assertQueue('TODO_CREATED');

      console.log('Task Service waiting for messages in USER_DELETED queue...');

      channel.consume('USER_DELETED', async (msg) => {
        if (msg !== null) {
          const { userId } = JSON.parse(msg.content.toString());
          console.log(`Received user deletion event: ${userId}`);

          try {
            const deletedCount = await prisma.todo.deleteMany({
              where: { userId }
            });
            console.log(`Cleaned up ${deletedCount.count} todos for user ${userId}`);
            
            channel.ack(msg);
          } catch (error) {
            console.error('Error cleaning up todos:', error);
          }
        }
      });
      return; // Success!
    } catch (error) {
      retryCount++;
      console.error(`RabbitMQ connection attempt ${retryCount} failed in Task Service. Retrying in 5s...`);
      await new Promise(res => setTimeout(res, 5000));
    }
  }
  console.error('Task Service could not connect to RabbitMQ after maximum retries');
};


export const publishTodoCreated = (userId: string) => {
  if (!channel) {
    console.error('RabbitMQ channel not initialized in Task Service');
    return;
  }
  const message = JSON.stringify({ userId });
  channel.sendToQueue('TODO_CREATED', Buffer.from(message));
  console.log(`Sent message to TODO_CREATED queue: ${message}`);
};
