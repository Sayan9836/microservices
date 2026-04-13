import amqp from 'amqplib';
import { prisma } from './db';

export const startRabbitMQConsumer = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue('USER_DELETED');

    console.log('Task Service waiting for messages in USER_DELETED queue...');

    channel.consume('USER_DELETED', async (msg) => {
      if (msg !== null) {
        const { userId } = JSON.parse(msg.content.toString());
        console.log(`Received user deletion event: ${userId}`);

        try {
          // The magic happens here: Cleaning up the todos for the deleted user
          const deletedCount = await prisma.todo.deleteMany({
            where: { userId }
          });
          console.log(`Cleaned up ${deletedCount.count} todos for user ${userId}`);
          
          channel.ack(msg);
        } catch (error) {
          console.error('Error cleaning up todos:', error);
          // Don't ack if there was an error so we can retry
        }
      }
    });
  } catch (error) {
    console.error('Failed to connect to RabbitMQ in Task Service:', error);
  }
};
