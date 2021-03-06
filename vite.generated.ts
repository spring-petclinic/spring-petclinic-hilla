/**
 * NOTICE: this is an auto-generated file
 *
 * This file has been generated by the `flow:prepare-frontend` maven goal.
 * This file will be overwritten on every run. Any custom changes should be made to vite.config.ts
 */
import path from 'path';
import * as net from 'net';

import { processThemeResources } from '@vaadin/application-theme-plugin/theme-handle.js';
import settings from './target/vaadin-dev-server-settings.json';
import { UserConfigFn, defineConfig, mergeConfig, PluginOption, ResolvedConfig } from 'vite';
import { injectManifest } from 'workbox-build';

import * as rollup from 'rollup';
import brotli from 'rollup-plugin-brotli';
import checker from 'vite-plugin-checker';

const appShellUrl = '.';

const frontendFolder = path.resolve(__dirname, settings.frontendFolder);
const themeFolder = path.resolve(frontendFolder, settings.themeFolder);
const frontendBundleFolder = path.resolve(__dirname, settings.frontendBundleOutput);
const addonFrontendFolder = path.resolve(__dirname, settings.addonFrontendFolder);

const projectStaticAssetsFolders = [
  path.resolve(__dirname, 'src', 'main', 'resources', 'META-INF', 'resources'),
  path.resolve(__dirname, 'src', 'main', 'resources', 'static'),
  frontendFolder
];

// Folders in the project which can contain application themes
const themeProjectFolders = projectStaticAssetsFolders.map((folder) => path.resolve(folder, settings.themeFolder));

const themeOptions = {
  devMode: false,
  // The following matches folder 'target/flow-frontend/themes/'
  // (not 'frontend/themes') for theme in JAR that is copied there
  themeResourceFolder: path.resolve(__dirname, settings.themeResourceFolder),
  themeProjectFolders: themeProjectFolders,
  projectStaticAssetsOutputFolder: path.resolve(__dirname, settings.staticOutput),
  frontendGeneratedFolder: path.resolve(frontendFolder, settings.generatedFolder)
};

// Block debug and trace logs.
console.trace = () => {};
console.debug = () => {};

function transpileSWPlugin(): PluginOption {
  let config: ResolvedConfig;

  return {
    name: 'vaadin:transpile-sw',
    enforce: 'post',
    apply: 'build',
    async configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    async buildStart() {
      const includedPluginNames = [
        'alias',
        'vite:resolve',
        'vite:esbuild',
        'replace',
        'vite:define',
        'rollup-plugin-dynamic-import-variables',
        'vite:esbuild-transpile',
        'vite:terser',
      ]
      const plugins = config.plugins.filter((p) => includedPluginNames.includes(p.name))
      const bundle = await rollup.rollup({
        input: path.resolve(settings.clientServiceWorkerSource),
        plugins,
      })
      try {
        await bundle.write({
          format: 'es',
          exports: 'none',
          inlineDynamicImports: true,
          file: path.resolve(frontendBundleFolder, 'sw.js'),
        })
      } finally {
        await bundle.close()
      }
    },
  }
}

function injectManifestToSWPlugin(): PluginOption {
  const rewriteManifestIndexHtmlUrl = (manifest) => {
    const indexEntry = manifest.find((entry) => entry.url === 'index.html');
    if (indexEntry) {
      indexEntry.url = appShellUrl;
    }

    return { manifest, warnings: [] };
  }

  return {
    name: 'vaadin:inject-manifest-to-sw',
    enforce: 'post',
    apply: 'build',
    async closeBundle() {
      await injectManifest({
        swSrc: path.resolve(frontendBundleFolder, 'sw.js'),
        swDest: path.resolve(frontendBundleFolder, 'sw.js'),
        globDirectory: frontendBundleFolder,
        globPatterns: ['**/*'],
        globIgnores: ['**/*.br'],
        injectionPoint: 'self.__WB_MANIFEST',
        manifestTransforms: [rewriteManifestIndexHtmlUrl],
        maximumFileSizeToCacheInBytes: 100 * 1024 * 1024 // 100mb,
      });
    }
  }
}

function updateTheme(contextPath: string) {
  const themePath = path.resolve(themeFolder);
  if (contextPath.startsWith(themePath)) {
    const changed = path.relative(themePath, contextPath);

    console.debug('Theme file changed', changed);

    if (changed.startsWith(settings.themeName)) {
      processThemeResources(themeOptions, console);
    }
  }
}

function runWatchDog(watchDogPort) {
  const client = net.Socket();
  client.setEncoding('utf8');
  client.on('error', function () {
    console.log('Watchdog connection error. Terminating vite process...');
    client.destroy();
    process.exit(0);
  });
  client.on('close', function () {
    client.destroy();
    runWatchDog(watchDogPort);
  });

  client.connect(watchDogPort, 'localhost');
}

let spaMiddlewareForceRemoved = false;

const allowedFrontendFolders = [
  frontendFolder,
  addonFrontendFolder,
  path.resolve(addonFrontendFolder, '..', 'frontend'), // Contains only generated-flow-imports
  path.resolve(frontendFolder, '../node_modules')
];

export const vaadinConfig: UserConfigFn = (env) => {
  const devMode = env.mode === 'development';

  if (devMode && process.env.watchDogPort) {
    // Open a connection with the Java dev-mode handler in order to finish
    // vite when it exits or crashes.
    runWatchDog(process.env.watchDogPort);
  }
  return {
    root: 'frontend',
    base: '',
    resolve: {
      alias: {
        themes: themeFolder,
        Frontend: frontendFolder
      }
    },
    define: {
      OFFLINE_PATH: settings.offlinePath
    },
    server: {
      fs: {
        allow: allowedFrontendFolders,
      }
    },
    build: {
      outDir: frontendBundleFolder,
      assetsDir: 'VAADIN/build',
      rollupOptions: {
        input: {
          indexhtml: path.resolve(frontendFolder, 'index.html')
        }
      }
    },
    plugins: [
      !devMode && brotli(),
      settings.pwaEnabled && transpileSWPlugin(),
      settings.pwaEnabled && injectManifestToSWPlugin(),
      {
        name: 'vaadin:custom-theme',
        config() {
          processThemeResources(themeOptions, console);
        },
        handleHotUpdate(context) {
          updateTheme(path.resolve(context.file));
        }
      },
      {
        name: 'vaadin:force-remove-spa-middleware',
        transformIndexHtml: {
          enforce: 'pre',
          transform(_html, { server }) {
            if (server && !spaMiddlewareForceRemoved) {
              server.middlewares.stack = server.middlewares.stack.filter((mw) => {
                const handleName = '' + mw.handle;
                return !handleName.includes('viteSpaFallbackMiddleware');
              });
              spaMiddlewareForceRemoved = true;
            }
          }
        }
      },
      {
        name: 'vaadin:inject-entrypoint-script',
        transformIndexHtml: {
          enforce: 'pre',
          transform(_html, { path, server }) {
            if (path !== '/index.html') {
              return;
            }

            if (devMode) {
              const basePath = server?.config.base ?? '';
              return [
                {
                  tag: 'script',
                  attrs: { type: 'module', src: `${basePath}generated/vite-devmode.ts` },
                  injectTo: 'head',
                },
                {
                  tag: 'script',
                  attrs: { type: 'module', src: `${basePath}generated/vaadin.ts` },
                  injectTo: 'head',
                }
              ]
            }

            return [
              {
                tag: 'script',
                attrs: { type: 'module', src: './generated/vaadin.ts' },
                injectTo: 'head',
              }
            ]
          },
        },
      },
      checker({
        typescript: true
      })
    ]
  };
};

export const overrideVaadinConfig = (customConfig: UserConfigFn) => {
  return defineConfig((env) => mergeConfig(vaadinConfig(env), customConfig(env)));
};
