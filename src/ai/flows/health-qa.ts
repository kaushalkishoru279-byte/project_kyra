'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const HealthQAInput = z.object({
  question: z.string().min(3).describe('User health-related question'),
  context: z
    .object({
      age: z.number().optional(),
      sex: z.string().optional(),
      knownConditions: z.array(z.string()).optional(),
      medications: z.array(z.string()).optional(),
    })
    .optional(),
});
export type HealthQAInputType = z.infer<typeof HealthQAInput>;

const HealthQAOutput = z.object({
  answer: z.string(),
  disclaimers: z.string(),
});
export type HealthQAOutputType = z.infer<typeof HealthQAOutput>;

const qaPrompt = ai.definePrompt({
  name: 'healthQAPrompt',
  input: { schema: HealthQAInput },
  output: { schema: HealthQAOutput },
  prompt: `You are a careful health assistant. Answer the user's question clearly and concisely.

Rules:
- You are not a substitute for professional medical advice; include a short disclaimer.
- Avoid diagnosing or prescribing. Offer general guidance and when to seek care.
- If risky symptoms are mentioned (chest pain, stroke signs, severe shortness of breath), advise seeking urgent care.
- Use plain language, bullet points when helpful, and keep to 5-8 sentences max.

User question: {{{question}}}
User context (optional): {{{context}}}

Return JSON with fields {"answer": string, "disclaimers": string}.`,
});

export const healthQAFlow = ai.defineFlow(
  {
    name: 'healthQAFlow',
    inputSchema: HealthQAInput,
    outputSchema: HealthQAOutput,
  },
  async (input) => {
    const { output } = await qaPrompt(input);
    return output!;
  }
);



