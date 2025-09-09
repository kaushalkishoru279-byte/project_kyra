"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertTriangle, CheckCircle2, Bot, Sparkles } from "lucide-react";
import { analyzeHealthData, type HealthDataInput, type HealthDataOutput } from "@/ai/flows/health-anomaly-analyzer";

const HealthDataFormSchema = z.object({
  bloodPressure: z.string()
    .min(3, { message: "Blood pressure is required (e.g., 120/80)." })
    .regex(/^\d{2,3}\/\d{2,3}$/, { message: "Invalid format. Use SYS/DIA (e.g., 120/80)." }),
  heartRate: z.coerce.number()
    .min(30, { message: "Heart rate seems too low." })
    .max(250, { message: "Heart rate seems too high." }),
  additionalNotes: z.string().optional(),
});

type HealthDataFormValues = z.infer<typeof HealthDataFormSchema>;

export function AiAnomalyDetector() {
  const [analysisResult, setAnalysisResult] = useState<HealthDataOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rules, setRules] = useState<Array<{ id: string; level: 'info'|'warn'|'critical'; message: string }>>([]);

  const form = useForm<HealthDataFormValues>({
    resolver: zodResolver(HealthDataFormSchema),
    defaultValues: {
      bloodPressure: "",
      heartRate: 70, // Default sensible heart rate
      additionalNotes: "",
    },
  });

  const onSubmit: SubmitHandler<HealthDataFormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setRules([]);
    try {
      // 1) Persist readings to backend
      const [sysStr, diaStr] = data.bloodPressure.split('/');
      const systolic = Number(sysStr);
      const diastolic = Number(diaStr);
      const takenAt = new Date().toISOString();
      await Promise.all([
        fetch('/api/health/readings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-User-Id': 'demo-user' },
          body: JSON.stringify({ userId: 'demo-user', metric: 'blood_pressure', valueJson: { systolic, diastolic }, unit: 'mmHg', source: 'manual', takenAt })
        }),
        fetch('/api/health/readings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-User-Id': 'demo-user' },
          body: JSON.stringify({ userId: 'demo-user', metric: 'heart_rate', valueNum: data.heartRate, unit: 'BPM', source: 'manual', takenAt })
        }),
      ]);

      // 2) Analyze recent window via backend (rules + AI)
      const analyzeRes = await fetch('/api/health/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-User-Id': 'demo-user' }, body: JSON.stringify({ windowMinutes: 120 }) });
      if (!analyzeRes.ok) throw new Error('Analysis failed');
      const analyzeJson = await analyzeRes.json();
      if (analyzeJson.ai) setAnalysisResult(analyzeJson.ai as HealthDataOutput);
      if (analyzeJson.rules) setRules(analyzeJson.rules as typeof rules);
    } catch (e) {
      console.error("Error analyzing health data:", e);
      setError("An unexpected error occurred while analyzing health data. Please try again later.");
    }
    setIsLoading(false);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">AI Health Analysis</CardTitle>
        </div>
        <CardDescription>Enter recent health metrics to get an AI-powered analysis for potential anomalies.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="bloodPressure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Pressure (SYS/DIA mmHg)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 120/80" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="heartRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heart Rate (BPM)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 70" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any other relevant information..." {...field} className="min-h-[100px] font-code" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col items-start gap-4">
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze Data
                </>
              )}
            </Button>
            
            {error && (
              <Alert variant="destructive" className="w-full">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {analysisResult && (
              <Alert variant={analysisResult.isAnomalous ? "destructive" : "default"} className="w-full mt-4">
                {analysisResult.isAnomalous ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                <AlertTitle className="font-headline">
                  {analysisResult.isAnomalous ? "Anomaly Detected" : "Analysis Complete"}
                </AlertTitle>
                <AlertDescription className="space-y-2">
                  <p><strong className="font-semibold">Explanation:</strong> {analysisResult.explanation}</p>
                  <p><strong className="font-semibold">Suggested Actions:</strong> <span className="font-code">{analysisResult.suggestedActions}</span></p>
                </AlertDescription>
              </Alert>
            )}

            {rules.length > 0 && (
              <div className="w-full space-y-2">
                {rules.map(r => (
                  <Alert key={r.id} variant={r.level === 'critical' ? 'destructive' : 'default'}>
                    <AlertTitle className="font-headline">Rule: {r.id}</AlertTitle>
                    <AlertDescription>{r.message}</AlertDescription>
                  </Alert>
                ))}
              </div>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
