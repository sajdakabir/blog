/// <reference path="../.astro/env.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly TWITTER_API_KEY: string;
  readonly TWITTER_API_SECRET: string;
  readonly TWITTER_ACCESS_TOKEN: string;
  readonly TWITTER_ACCESS_TOKEN_SECRET: string;
  readonly GITHUB_TOKEN: string;
  readonly CRON_SECRET: string;
  readonly WEBSITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
