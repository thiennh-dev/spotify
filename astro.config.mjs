// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare'; // 👈 Add this

// https://astro.build/config
export default defineConfig({
  output: 'server', // 👈 Required for Cloudflare Functions
  adapter: cloudflare(), // 👈 Add this
  integrations: [react()],
});
