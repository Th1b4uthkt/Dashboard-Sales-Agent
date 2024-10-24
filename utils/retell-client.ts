import Retell from 'retell-sdk';

if (!process.env.RETELL_API_KEY) {
  throw new Error('RETELL_API_KEY is not defined in the environment variables');
}

export const retellClient = new Retell({
  apiKey: process.env.RETELL_API_KEY as string,
});
