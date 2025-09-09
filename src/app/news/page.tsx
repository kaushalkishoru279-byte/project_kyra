"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, ExternalLink, Calendar, Globe, Filter } from 'lucide-react';
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
  created_at: string;
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScraping, setIsScraping] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { toast } = useToast();

  const sources = ['all', 'BBC News', 'NDTV', 'The Guardian'];
  const categories = ['all', 'General', 'Top Story', 'Latest', 'World'];

  const loadNews = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedSource !== 'all') params.append('source', selectedSource);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      params.append('limit', '20');

      const response = await fetch(`/api/news?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      } else {
        throw new Error('Failed to load news');
      }
    } catch (error) {
      console.error('Error loading news:', error);
      toast({
        title: "Error",
        description: "Failed to load news articles",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runScraping = async () => {
    setIsScraping(true);
    try {
      const response = await fetch('/api/news/scrape', { method: 'POST' });
      if (response.ok) {
        const result = await response.json();
        toast({
          title: "News Updated",
          description: `Scraped ${result.totalScraped} articles, ${result.newArticles} new articles added`
        });
        await loadNews(); // Reload the news
      } else {
        throw new Error('Failed to scrape news');
      }
    } catch (error) {
      console.error('Error scraping news:', error);
      toast({
        title: "Error",
        description: "Failed to scrape news articles",
        variant: "destructive"
      });
    } finally {
      setIsScraping(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, [selectedSource, selectedCategory]);

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'BBC News': return 'bg-red-100 text-red-800 border-red-200';
      case 'NDTV': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'The Guardian': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'Top Story': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'World': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Latest': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Globe className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-4xl font-bold font-headline tracking-tight">Today's News</h1>
          <p className="text-lg text-muted-foreground">
            Stay informed with the latest headlines from trusted sources
          </p>
        </div>
      </div>

      {/* Controls */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Filters & Actions</h3>
            </div>
            <Button 
              onClick={runScraping}
              disabled={isScraping}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isScraping ? 'animate-spin' : ''}`} />
              {isScraping ? 'Scraping...' : 'Refresh News'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Source:</label>
              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sources.map(source => (
                    <SelectItem key={source} value={source}>
                      {source === 'all' ? 'All Sources' : source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Category:</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* News Articles */}
      {isLoading ? (
        <div className="text-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading news articles...</p>
        </div>
      ) : articles.length > 0 ? (
        <div className="grid gap-6">
          {articles.map((article) => (
            <Card key={article.id} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {article.image_url && (
                    <div className="flex-shrink-0">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-32 h-24 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-xl font-semibold leading-tight line-clamp-2">
                        {article.title}
                      </h3>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                    
                    {article.description && (
                      <p className="text-muted-foreground mb-3 line-clamp-2">
                        {article.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(parseISO(article.published_at), 'MMM dd, yyyy • h:mm a')}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getSourceColor(article.source)}>
                          {article.source}
                        </Badge>
                        {article.category && (
                          <Badge className={getCategoryColor(article.category)}>
                            {article.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-lg">
          <CardContent className="text-center py-12">
            <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No news articles found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or refresh the news to get the latest articles.
            </p>
            <Button onClick={runScraping} disabled={isScraping}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isScraping ? 'animate-spin' : ''}`} />
              Refresh News
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
