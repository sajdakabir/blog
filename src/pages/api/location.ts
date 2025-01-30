import type { APIRoute } from 'astro';
import { TwitterApi } from 'twitter-api-v2';

export const prerender = false;

// In-memory cache
let cache = {
  data: null as any,
  timestamp: 0
};

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

const syncGithubLocation = async () => {
  try {
    const response = await fetch('/api/sync-github-location', {
      method: 'POST'
    });
    const data = await response.json();
    if (!data.success) {
      console.error('Failed to sync GitHub location:', data.error);
    }
  } catch (error) {
    console.error('Error syncing GitHub location:', error);
  }
};

export const GET: APIRoute = async ({ url }) => {
  try {
    const forceRefresh = url.searchParams.get('refresh') === 'true';
    
    // Check if we have cached data that's less than the cache duration
    const now = Date.now();
    if (!forceRefresh && cache.data && (now - cache.timestamp) < CACHE_DURATION) {
      return new Response(JSON.stringify(cache.data), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }

    const client = new TwitterApi({
      appKey: import.meta.env.TWITTER_API_KEY,
      appSecret: import.meta.env.TWITTER_API_SECRET,
      accessToken: import.meta.env.TWITTER_ACCESS_TOKEN,
      accessSecret: import.meta.env.TWITTER_ACCESS_TOKEN_SECRET,
    });

    // Use v2 API to get user profile
    const me = await client.v2.me({
      'user.fields': ['location', 'created_at', 'description', 'profile_image_url']
    });

    console.log('Twitter API response:', me);

    const newLocation = me.data.location || 'Location not set';
    const locationChanged = !cache.data || cache.data.location !== newLocation;

    const responseData = {
      success: true,
      location: newLocation,
      timestamp: new Date().toISOString(),
      cached: false
    };

    // Update cache
    cache = {
      data: responseData,
      timestamp: now
    };

    // If location has changed, trigger GitHub sync
    if (locationChanged) {
      await syncGithubLocation();
    }

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error fetching Twitter profile:', error);
    
    // If we have cached data and get an error, return the cached data
    if (cache.data) {
      return new Response(JSON.stringify({
        ...cache.data,
        cached: true
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }

    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      timestamp: new Date().toISOString()
    }), {
      status: error instanceof Error && error.message.includes('429') ? 429 : 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  }
}
