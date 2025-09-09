# News Section Implementation

## Overview
The News Section provides real-time news aggregation from multiple trusted sources including BBC News, NDTV, and The Guardian. It features automated web scraping, database storage, and a beautiful frontend interface.

## Features

### 🔍 **Web Scraping**
- **Multi-source scraping**: BBC News, NDTV, The Guardian
- **Intelligent parsing**: Extracts headlines, descriptions, images, and metadata
- **Error handling**: Graceful fallbacks and retry mechanisms
- **Rate limiting**: Respectful scraping with proper headers

### 📊 **Database Storage**
- **PostgreSQL integration**: Efficient storage with proper indexing
- **Article deduplication**: Prevents duplicate articles based on URL
- **Automatic cleanup**: Removes articles older than 7 days
- **Categorization**: Organizes articles by source and category

### ⏰ **Automated Scheduling**
- **Daily updates**: Runs at midnight every day
- **Periodic updates**: Additional runs every 6 hours
- **Manual triggers**: On-demand scraping via API
- **Development mode**: Immediate execution for testing

### 🎨 **Frontend Interface**
- **Dashboard widget**: Quick news overview on main dashboard
- **Dedicated news page**: Full news browsing experience
- **Filtering**: By source and category
- **Responsive design**: Works on all device sizes
- **Real-time updates**: Refresh button for latest news

## File Structure

```
src/
├── lib/
│   ├── news-scraper.ts          # Web scraping logic
│   ├── news-scheduler.ts        # Cron job management
│   ├── startup.ts               # Service initialization
│   └── db.ts                    # Database schema (news_articles table)
├── app/
│   ├── api/news/
│   │   ├── route.ts             # GET/POST news articles
│   │   └── scrape/route.ts      # Manual scraping trigger
│   ├── news/page.tsx            # News page component
│   └── page.tsx                 # Updated dashboard with news widget
├── components/features/news/
│   └── news-widget.tsx          # Dashboard news widget
└── docs/
    └── NEWS_SECTION.md          # This documentation
```

## Database Schema

```sql
CREATE TABLE public.news_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  image_url TEXT,
  source TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_news_articles_published_at ON public.news_articles(published_at DESC);
CREATE INDEX idx_news_articles_source ON public.news_articles(source);
CREATE INDEX idx_news_articles_category ON public.news_articles(category);
```

## API Endpoints

### GET `/api/news`
Retrieve news articles with optional filtering.

**Query Parameters:**
- `limit` (number): Number of articles to return (default: 10)
- `source` (string): Filter by news source (BBC News, NDTV, The Guardian)
- `category` (string): Filter by category (General, Top Story, Latest, World)

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Article Title",
    "description": "Article description",
    "url": "https://example.com/article",
    "image_url": "https://example.com/image.jpg",
    "source": "BBC News",
    "published_at": "2024-01-01T00:00:00Z",
    "category": "General",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### POST `/api/news/scrape`
Manually trigger news scraping job.

**Response:**
```json
{
  "message": "News scraping completed successfully",
  "totalScraped": 15,
  "newArticles": 8,
  "articles": [...]
}
```

## Installation & Setup

### 1. Install Dependencies
```bash
npm install cheerio node-cron
```

### 2. Environment Variables
No additional environment variables required. Uses existing `DATABASE_URL`.

### 3. Database Setup
The news table will be created automatically on first API call.

### 4. Start the Application
```bash
npm run dev
```

The news scheduler will start automatically and begin scraping news.

## Usage

### Dashboard Widget
- Located on the main dashboard (`/`)
- Shows top 5 latest news articles
- Includes refresh button for manual updates
- Links to full news page

### News Page
- Access via `/news` or sidebar navigation
- Full news browsing experience
- Filter by source and category
- Manual scraping trigger
- Responsive card layout

### Manual Scraping
```bash
# Trigger scraping via API
curl -X POST http://localhost:3000/api/news/scrape
```

## Configuration

### Scraping Sources
Edit `src/lib/news-scraper.ts` to add/modify news sources:

```typescript
// Add new source
static async scrapeNewSource(): Promise<NewsArticle[]> {
  // Implementation
}
```

### Scheduling
Modify `src/lib/news-scheduler.ts` to change cron schedules:

```typescript
// Daily at midnight
cron.schedule('0 0 * * *', async () => {
  await this.runScrapingJob();
});

// Every 6 hours
cron.schedule('0 */6 * * *', async () => {
  await this.runScrapingJob();
});
```

### Cleanup Policy
Change article retention period in `src/lib/news-scheduler.ts`:

```typescript
// Keep articles for 7 days
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
```

## Error Handling

- **Network errors**: Graceful fallbacks, continues with other sources
- **Parsing errors**: Logs errors, skips problematic articles
- **Database errors**: Transaction rollback, detailed error logging
- **Rate limiting**: Respects website policies with proper headers

## Performance Considerations

- **Database indexing**: Optimized queries with proper indexes
- **Caching**: Articles cached in database, no external API calls
- **Lazy loading**: Images loaded on demand
- **Pagination**: Configurable article limits

## Security

- **User-Agent spoofing**: Prevents blocking by news sites
- **Input validation**: Sanitizes scraped content
- **SQL injection protection**: Parameterized queries
- **Rate limiting**: Respectful scraping practices

## Monitoring

- **Console logging**: Detailed operation logs
- **Error tracking**: Comprehensive error reporting
- **Performance metrics**: Scraping duration and success rates
- **Database monitoring**: Query performance and storage usage

## Future Enhancements

- **Additional sources**: CNN, Reuters, local news
- **AI categorization**: Automatic topic classification
- **User preferences**: Personalized news feeds
- **Push notifications**: Breaking news alerts
- **Offline support**: Cached articles for offline reading
- **Analytics**: Reading patterns and engagement metrics

## Troubleshooting

### Common Issues

1. **No articles appearing**
   - Check database connection
   - Verify scraping job is running
   - Check console for errors

2. **Scraping failures**
   - Verify internet connection
   - Check if news sites are accessible
   - Review error logs

3. **Performance issues**
   - Check database indexes
   - Monitor memory usage
   - Review scraping frequency

### Debug Mode
Enable detailed logging by setting `NODE_ENV=development` in your environment.

## Support

For issues or questions regarding the news section, check:
1. Console logs for error messages
2. Database connection status
3. Network connectivity to news sources
4. API endpoint responses

The news section is designed to be robust and self-healing, with automatic retries and graceful error handling.
