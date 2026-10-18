import 'dotenv/config';
import mongoose from 'mongoose';
import { createApp } from './app.js';
async function start() {
  const app = createApp();
  if (!process.env.MONGO_URI) throw new Error('Missing MONGO_URI');
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
  const port = process.env.PORT || 5000;
  const server = app.listen(port, () => console.log(`Server listening on port ${port}`));
  for (const signal of ['SIGINT','SIGTERM']) process.once(signal, () => {
    server.close(async () => { await mongoose.disconnect(); process.exit(0); });
    setTimeout(() => process.exit(1), 10000).unref();
  });
}
start().catch(error => {
  console.error(error.name === 'Error' && !process.env.MONGO_URI ? 'Configure server environment; see README.md' : 'Startup failed. Check server configuration and database connectivity.');
  process.exit(1);
});
