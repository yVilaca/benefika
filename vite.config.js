import { defineConfig } from 'vite';

export default defineConfig({
    resolve: {
      alias: {
        '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs'
      }
    }
  });