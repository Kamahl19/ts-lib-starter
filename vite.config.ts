/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { externalizeDeps } from 'vite-plugin-externalize-deps';
import tsconfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';
import { preserveDirectives } from 'rollup-plugin-preserve-directives';

const dtsConfig = {
  entryRoot: './src',
  include: './src',
  exclude: ['./src/**/*.{spec,test}.*'],
};

export default defineConfig({
  plugins: [
    externalizeDeps(),
    preserveDirectives(),
    tsconfigPaths(),
    dts({
      ...dtsConfig,
      outDir: 'dist/esm',
      compilerOptions: {
        // module: 'esnext',
        module: 99, // ESNext
        declarationMap: false,
      },
      beforeWriteFile: (filePath, content) => ({
        filePath,
        content: content.replace(
          /^(im|ex)port\s[\w{}*\s,]+from\s['"]\.\/[^.'"]+(?=['"];?$)/gm,
          '$&.js',
        ),
      }),
    }),
    dts({
      ...dtsConfig,
      outDir: 'dist/cjs',
      compilerOptions: {
        // module: 'commonjs',
        module: 1, // CommonJS
        declarationMap: false,
      },
      beforeWriteFile: (filePath, content) => ({
        content: content.replace(
          /^(im|ex)port\s[\w{}*\s,]+from\s['"]\.\/[^.'"]+(?=['"];?$)/gm,
          '$&.cjs',
        ),
        filePath: filePath.replace('.d.ts', '.d.cts'),
      }),
    }),
  ],
  build: {
    outDir: 'dist',
    minify: false,
    sourcemap: true,
    lib: {
      entry: './src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'cjs' ? 'cjs/[name].cjs' : 'esm/[name].js'),
    },
    rollupOptions: {
      output: {
        preserveModules: true,
      },
    },
  },
  test: {
    coverage: {
      provider: 'istanbul',
      include: ['src/**/*'],
    },
  },
});
