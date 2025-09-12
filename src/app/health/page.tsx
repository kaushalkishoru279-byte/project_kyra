import { HeartPulse } from "lucide-react";
import { AiAnomalyDetector } from "@/components/features/health-monitoring/ai-anomaly-detector";
import { HealthTrendsChart } from "@/components/features/health-monitoring/health-trends-chart";
import { HealthQA } from "@/components/features/health-monitoring/health-qa";

export default function HealthMonitoringPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <HeartPulse className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold font-headline tracking-tight">Health Monitoring</h1>
      </div>
      
      <p className="text-lg text-muted-foreground">
        Track vital signs, analyze trends, and get AI-powered insights for proactive health management.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <AiAnomalyDetector />
        <HealthTrendsChart />
        <div className="lg:col-span-2">
          <HealthQA />
        </div>
      </div>
    </div>
  );
}


