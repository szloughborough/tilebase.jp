import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import { verifyProductionReadiness } from './scripts/production-guard.mjs';
const buildEnv = { ...loadEnv(process.env.NODE_ENV === 'development' ? 'development' : 'production', process.cwd(), ''), ...process.env };
verifyProductionReadiness(buildEnv);
export default defineConfig({
  site: buildEnv.SITE_URL || 'https://tilebase.jp',
  output: 'static',
  vite: { cacheDir: './.astro/vite-cache' },
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});

