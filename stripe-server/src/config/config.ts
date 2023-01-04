import dotenv from 'dotenv';

dotenv.config();

const SERVER_PORT: number = Number(process.env.SERVER_PORT) || 5000;
const STRIPE_KEY: any = process.env.STRIPE_KEY;

export const config = {
  server: {
    port: SERVER_PORT,
  },
  stripe: {
    stripe_key: STRIPE_KEY,
  },
};
