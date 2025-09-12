'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CareChatInput = z.object({
  message: z.string().min(1),
  history: z
    .array(
      z.object({ role: z.enum(['user', 'assistant', 'system']), content: z.string() })
    )
    .optional(),
});
export type CareChatInputType = z.infer<typeof CareChatInput>;

const CareChatOutput = z.object({ reply: z.string() });
export type CareChatOutputType = z.infer<typeof CareChatOutput>;

const careChatPrompt = ai.definePrompt({
  name: 'careChatPrompt',
  input: { schema: CareChatInput },
  output: { schema: CareChatOutput },
  prompt: `You are CareChat, a helpful, friendly assistant integrated into a health & family care app.

Guidelines:
- Be concise and clear. Use bullet points when helpful.
- If asked for medical advice, provide general guidance and suggest seeing a professional.
- If a question is app-specific (features, data), explain how to use the app.

{{#if history}}
Conversation history:
{{#each history}}
{{this.role}}: {{this.content}}
{{/each}}

{{/if}}
User: {{{message}}}

Respond STRICTLY as JSON with this shape and nothing else on any line:
{"reply": "<your helpful answer>"}`,
});

export const careChatFlow = ai.defineFlow(
  {
    name: 'careChatFlow',
    inputSchema: CareChatInput,
    outputSchema: CareChatOutput,
  },
  async (input) => {
    const { output } = await careChatPrompt(input);
    return output!;
  }
);


