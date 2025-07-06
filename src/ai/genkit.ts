import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

if (!process.env.GOOGLE_API_KEY) {
  const message =
    'GOOGLE_API_KEY environment variable is not set. AI features will not work. In production, you must set this as a secret in your App Hosting backend settings.';
  if (process.env.NODE_ENV === 'production') {
    console.error(message);
  } else {
    console.warn(message);
  }
}

export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.GOOGLE_API_KEY})],
  model: 'googleai/gemini-2.0-flash',
});
