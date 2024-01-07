/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
// import { config } from 'dotenv';

// config();

// const env = (key: any, defaultValue = null) => {
//   return process.env[key] || defaultValue;
// };

export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
});
