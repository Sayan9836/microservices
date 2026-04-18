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
      console.log('Successfully connected to RabbitMQ after retries');

      // Consumer for TODO_CREATED
      channel.consume('TODO_CREATED', async (msg) => {
        if (msg !== null) {
          const { userId } = JSON.parse(msg.content.toString());
          console.log(`Received todo creation event for user: ${userId}`);

          try {
            await prisma.user.update({
              where: { id: userId },
              data: { taskCount: { increment: 1 } }
            });
            console.log(`Successfully incremented taskCount for user ${userId}`);
            channel.ack(msg);
          } catch (error) {
            console.error('Error updating taskCount:', error);
          }
        }
      });

      return; // Success!
    } catch (error) {
      retryCount++;
      console.error(`RabbitMQ connection attempt ${retryCount} failed. Retrying in 5s...`);
      await new Promise(res => setTimeout(res, 5000));
    }
  }
  console.error('Could not connect to RabbitMQ after maximum retries');
};


export const publishUserDeleted = (userId: string) => {
  if (!channel) {
    console.error('RabbitMQ channel not initialized');
    return;
  }
  const message = JSON.stringify({ userId });
  channel.sendToQueue('USER_DELETED', Buffer.from(message));
  console.log(`Sent message to USER_DELETED queue: ${message}`);
};
