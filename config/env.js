import { config } from 'dotenv';

config({path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const {
   PORT,
   NODE_ENV,
   MONGODB_URI, 
   JWT_EXPIRES, 
   JWT_SECRET ,
   CLOUD_NAME ,
   CLOUD_API_KEY ,
   CLOUD_API_SECRET ,
   CLOUD_API_ENV_VARIABLE
  } = process.env;