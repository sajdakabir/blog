import type { APIRoute } from 'astro';
import { Octokit } from '@octokit/rest';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Verify cron secret to ensure only our GitHub Action can call this
    const authHeader = request.headers.get('authorization');
    console.log('Auth header:', authHeader);
    console.log('Expected:', `Bearer ${import.meta.env.CRON_SECRET}`);
    if (authHeader !== `Bearer ${import.meta.env.CRON_SECRET}`) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Unauthorized'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Fetch current location from our website's API
    const locationResponse = await fetch(`${import.meta.env.WEBSITE_URL}/api/location`);
    if (!locationResponse.ok) {
      throw new Error('Failed to fetch location from website');
    }
    
    const locationData = await locationResponse.json();
    if (!locationData.success || !locationData.location) {
      throw new Error('Invalid location data from website');
    }

    // Initialize GitHub client
    const octokit = new Octokit({
      auth: import.meta.env.GITHUB_TOKEN
    });

    // Update GitHub profile
    await octokit.users.updateAuthenticated({
      location: locationData.location
    });

    return new Response(JSON.stringify({
      success: true,
      location: locationData.location,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error in cron sync:', error);
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
