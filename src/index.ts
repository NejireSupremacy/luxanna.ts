import { config } from 'dotenv';
import { LuxClient } from './classes/Client';
config({
  debug: true
});

const client = new LuxClient();

client.start();
