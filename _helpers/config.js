import dotenv from 'dotenv';

dotenv.config({
  path: './.env.' + process.env.NODE_ENV
});

export default {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  ATLAS_URI: process.env.ATLAS_URI,
  EX_SESSION_SCR: process.env.EX_SESSION_SCR,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  FRONT_APP_URL: process.env.FRONT_APP_URL || '127.0.0.1:3000',
  BACK_APP_URL: process.env.BACK_APP_URL || '127.0.0.1:5000'
};