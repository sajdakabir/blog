import type { APIRoute } from 'astro';
import { TwitterApi } from 'twitter-api-v2';
import { Octokit } from '@octokit/rest';

export const prerender = false;

export const POST: APIRoute = async () => {
  try {
    // Initialize Twitter client
    const twitterClient = new TwitterApi({
      appKey: import.meta.env.TWITTER_API_KEY,
      appSecret: import.meta.env.TWITTER_API_SECRET,
      accessToken: import.meta.env.TWITTER_ACCESS_TOKEN,
      accessSecret: import.meta.env.TWITTER_ACCESS_TOKEN_SECRET,
    });

    // Get location from Twitter
    const me = await twitterClient.v2.me({
      'user.fields': ['location']
    });

    const location = me.data.location;

    if (!location) {
      return new Response(JSON.stringify({
        success: false,
        error: 'No location found on Twitter'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Initialize GitHub client
    const octokit = new Octokit({
      auth: import.meta.env.GITHUB_TOKEN
    });

    // Update GitHub profile
    await octokit.users.updateAuthenticated({
      location: location
    });

    return new Response(JSON.stringify({
      success: true,
      location: location
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error syncing location:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
