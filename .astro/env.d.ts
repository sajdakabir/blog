declare module 'astro:env/client' {
	
}

declare module 'astro:env/server' {
	export const NEWSLETTER_LOOPS_API: string;	
export const TWITTER_API_KEY: string;	
export const TWITTER_API_SECRET: string;	
export const TWITTER_ACCESS_TOKEN: string;	
export const TWITTER_ACCESS_TOKEN_SECRET: string;	


	export const getSecret: (key: string) => string | undefined;
}
