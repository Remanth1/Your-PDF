import Queue from 'bullmq';
import IORedis from 'ioredis';

// Minimal worker skeleton using BullMQ
const connection = new IORedis(process.env.REDIS_URL ?? 'redis://localhost:6379');
const queueName = process.env.QUEUE_NAME ?? 'conversions';

const worker = new Queue.Worker(queueName, async (job) => {
  console.log('Processing job', job.id, job.name, job.data);
  // job.data should include: input (s3/key), output format, options, user info
  // TODO: pull file, run converter, upload result, update DB
}, { connection });

worker.on('failed', (job, err) => {
  console.error('Job failed', job?.id, err);
});

worker.on('completed', (job) => {
  console.log('Job completed', job.id);
});

console.log('Worker started, listening on queue:', queueName);
