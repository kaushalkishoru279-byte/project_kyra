"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Globe, RefreshCw, Calendar } from "lucide-react";
import { format, parseISO } from 'date-fns';
import { useToast } from "@/hooks/use-toast";

interface NewsArticle {
  id: string;
  title: string;
  description?: string;
  url: string;
  image_url?: string;
  source: string;
  published_at: string;
  category?: string;
}

export function NewsWidget() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadNews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/news?limit=5');
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      } else {
        console.error('Failed to load news');
        setArticles([]);
      }
    } catch (error) {
      console.error('Error loading news:', error);
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadNews();
  }, []);

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'BBC News': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200';
      case 'NDTV': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200';
      case 'The Guardian': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const handleRefresh = async () => {
    try {
      const response = await fetch('/api/news/scrape', { method: 'POST' });
      if (response.ok) {
        toast({
          title: "News Updated",
          description: "Latest news articles have been refreshed"
        });
        await loadNews();
      } else {
        throw new Error('Failed to refresh news');
      }
    } catch (error) {
      console.error('Error refreshing news:', error);
      toast({
        title: "Error",
        description: "Failed to refresh news articles",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline">Top News Today</CardTitle>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <CardDescription>Latest headlines from trusted news sources</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading news...</p>
          </div>
        ) : articles.length > 0 ? (
          <div className="space-y-4">
            {articles.map((article, index) => (
              <div key={article.id} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-start gap-3">
                  {article.image_url && (
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-16 h-12 object-cover rounded-md flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-medium text-sm leading-tight line-clamp-2">
                        {article.title}
                      </h4>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 p-1 hover:bg-muted rounded transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(parseISO(article.published_at), 'MMM dd, h:mm a')}
                      </div>
                      <Badge className={`text-xs ${getSourceColor(article.source)}`}>
                        {article.source}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="pt-2">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href="/news">
                  View All News
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Globe className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-3">No news articles available</p>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Load News
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
