import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('Missing GOOGLE_API_KEY or GEMINI_API_KEY in environment');
}

export const ai = genkit({
  plugins: [googleAI({ apiKey })],
  model: 'googleai/gemini-2.0-flash',
});
