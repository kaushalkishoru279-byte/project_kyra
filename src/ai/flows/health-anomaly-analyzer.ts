'use server';

/**
 * @fileOverview An AI agent for analyzing health data and detecting anomalies.
 *
 * - analyzeHealthData - A function that analyzes health data and provides warnings or insights.
 * - HealthDataInput - The input type for the analyzeHealthData function.
 * - HealthDataOutput - The return type for the analyzeHealthData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HealthDataInputSchema = z.object({
  bloodPressure: z
    .string()
    .describe('The blood pressure reading in mmHg (e.g., 120/80).'),
  heartRate: z.number().describe('The heart rate in beats per minute (BPM).'),
  additionalNotes: z
    .string()
    .optional()
    .describe('Any additional notes or context about the health data.'),
});
export type HealthDataInput = z.infer<typeof HealthDataInputSchema>;

const HealthDataOutputSchema = z.object({
  isAnomalous: z.boolean().describe('Whether the health data is anomalous.'),
  explanation:
    z.string().describe('The explanation of the anomaly detection result.'),
  suggestedActions:
    z.string().describe('Suggested actions based on the anomaly detection.'),
});
export type HealthDataOutput = z.infer<typeof HealthDataOutputSchema>;

export async function analyzeHealthData(
  input: HealthDataInput
): Promise<HealthDataOutput> {
  return analyzeHealthDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'healthAnomalyAnalyzerPrompt',
  input: {schema: HealthDataInputSchema},
  output: {schema: HealthDataOutputSchema},
  prompt: `You are an AI health assistant that analyzes health data and provides warnings or insights if it detects anomalies or potentially concerning trends.

  Analyze the following health data:
  Blood Pressure: {{{bloodPressure}}}
  Heart Rate: {{{heartRate}}} BPM
  Additional Notes: {{{additionalNotes}}}

  Determine if the data is anomalous and provide an explanation and suggested actions.
  Consider blood pressure ranges: Systolic (120-129 is Elevated, 130-139 is Stage 1 Hypertension, 140+ is Stage 2 Hypertension), Diastolic (80-89 is Stage 1 Hypertension, 90+ is Stage 2 Hypertension).
  Consider heart rate ranges: Normal (60-100 BPM), Bradycardia (below 60 BPM), Tachycardia (above 100 BPM).
  isAnomalous should be true if blood pressure or heart rate are outside of normal ranges.
  `,
});

const analyzeHealthDataFlow = ai.defineFlow(
  {
    name: 'analyzeHealthDataFlow',
    inputSchema: HealthDataInputSchema,
    outputSchema: HealthDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
