import { defineConfig , envField} from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import react from "@astrojs/react";

export default defineConfig({
  output: "hybrid",
  adapter: vercel(),
  site: "https://oliursahin.com",
  integrations: [mdx(), sitemap(), tailwind(), react()],
  experimental: {
    env: {
        schema: {
            // NEWSLETTER_LOOPS_API: envField.string({ context: "server", access: "secret" }),
            TWITTER_API_KEY: envField.string({ context: "server", access: "secret" }),
            TWITTER_API_SECRET: envField.string({ context: "server", access: "secret" }),
            TWITTER_ACCESS_TOKEN: envField.string({ context: "server", access: "secret" }),
            TWITTER_ACCESS_TOKEN_SECRET: envField.string({ context: "server", access: "secret" }),
        }
    }
},
});
