"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function HealthQA() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [disclaimer, setDisclaimer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const ask = async () => {
    if (!question.trim()) {
      toast({ title: "Please enter a question", variant: "destructive" });
      return;
    }
    setLoading(true);
    setAnswer(null);
    setDisclaimer(null);
    try {
      const res = await fetch('/api/health/ask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question }) });
      if (!res.ok) throw new Error('request failed');
      const data = await res.json();
      setAnswer(data.answer);
      setDisclaimer(data.disclaimers);
    } catch (_) {
      toast({ title: "Failed to get an answer", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Ask Health AI</CardTitle>
        </div>
        <CardDescription>Ask a general health question. Not a substitute for medical advice.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g., What are common signs of dehydration?"
        />
        <div className="flex justify-end">
          <Button onClick={ask} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ask'}
          </Button>
        </div>
        {answer && (
          <div className="space-y-2">
            <div className="text-sm whitespace-pre-wrap">{answer}</div>
            {disclaimer && <div className="text-xs text-muted-foreground">{disclaimer}</div>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}



