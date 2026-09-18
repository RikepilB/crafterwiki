import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  // Set CRAFTERWIKI_SITE (and optionally CRAFTERWIKI_BASE) when deploying, for canonical URLs.
  site: process.env.CRAFTERWIKI_SITE ?? 'https://crafterwiki.vercel.app',
  base: process.env.CRAFTERWIKI_BASE ?? '/',
  vite: {
    // Pages and client scripts import the shared query library from ../cli.
    server: { fs: { allow: ['..'] } },
  },
});
