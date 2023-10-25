import { defineConfig, transformWithEsbuild } from 'vite'
import react from '@vitejs/plugin-react'

import * as fs from 'fs'
import url from 'url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), {
    name: 'load+transform-js-files-as-jsx',
    async transform(code, id) {
      if (!id.match(/src\/.*\.js$/)) {
        return null;
      }

      // Use the exposed transform from vite, instead of directly
      // transforming with esbuild
      return transformWithEsbuild(code, id, {
        loader: 'jsx',
        jsx: 'automatic', // 👈 this is important
      });
    },
  },],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
        '.jsx': 'jsx'
      },
      plugins: [
        // copied from "https://github.com/CodinGame/monaco-vscode-api/blob/main/demo/vite.config.ts"
        {
          name: 'import.meta.url',
          setup({ onLoad }) {
            // Help vite that bundles/move files in dev mode without touching `import.meta.url` which breaks asset urls
            onLoad({ filter: /.*\.js/, namespace: 'file' }, async args => {
              const code = fs.readFileSync(args.path, 'utf8');

              const assetImportMetaUrlRE = /\bnew\s+URL\s*\(\s*('[^']+'|"[^"]+"|`[^`]+`)\s*,\s*import\.meta\.url\s*(?:,\s*)?\)/g;
              let i = 0;
              let newCode = '';
              for (let match = assetImportMetaUrlRE.exec(code); match != null; match = assetImportMetaUrlRE.exec(code)) {
                newCode += code.slice(i, match.index);
                const path = match[1].slice(1, -1);

                const resolved = await import.meta.resolve(path, url.pathToFileURL(args.path));
                newCode += `new URL(${JSON.stringify(url.fileURLToPath(resolved))}, import.meta.url)`;
                i = assetImportMetaUrlRE.lastIndex;
              }
              newCode += code.slice(i);
              return { contents: newCode };
            });
          }
        }]
    }
  }
})
