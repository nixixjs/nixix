// @ts-check
import { join, normalize } from "path";

/**
 * @typedef {import('vite').Plugin} Plugin_2
 * @typedef {import('vite').ESBuildOptions} ESBuildOptions
 * @typedef {import('./types.d.ts').PluginOptions} PluginOptions 
 * @typedef {import('./types.d.ts').ExtendedPluginOptions} ExtendedPluginOptions
 */

/**
 * 
 * @param {PluginOptions} options 
 * @returns {Plugin_2}
 */
function NixixHMR({projectRoot, dev} = { dev: false }) {

  /**
   * @type {Plugin_2}
   */
  const hmrplugin = {
    name: "nixix-vite-hmr",
    apply: "serve",
    async transform(code, id) {
      // if file extension is not ts | js | jsx | tsx.
      if (/node_modules/.test(id) || !/\.(t|j)sx?$/.test(id)) return;
      // project root
      const root = projectRoot?.split?.("/") || ["src", "index.tsx"];
      const path = normalize(join(`${process.cwd()}`, ...root));
      const regExp = normalize(id).includes(path);
      if (regExp) {
        const prelude = `if (import.meta.hot) {
          import.meta.hot?.accept()
          import.meta.hot?.dispose(() => {
            delete $nixixStore['$$__routeStore']
            if ($agnosticRouteObjects.length) $agnosticRouteObjects.length = 0;
            ($nixixStore as any).root?.replaceChildren();
            ($nixixStore as any).reactiveScope = true;
          })
        };
        import { agnosticRouteObjects as $agnosticRouteObjects } from "${dev ? 'router/utils' : 'nixix/router/utils'}";
        `;
        return {
          code: `${prelude}${code}`,
        };
      }
    },
  };

  return hmrplugin;
}

/**
 * 
 * @param {PluginOptions} options 
 * @returns {Plugin_2}
 */
function NixixEsbuildConfig({dev} = { dev: false }) {
  
  /**
   * @type {ESBuildOptions}
   */
  const baseEsbuildOptions = {
    jsxFactory: "$Nixix.create",
    jsxFragment: "'fragment'",
    jsxDev: false,
    jsx: "transform",
  }

  /**
   * @type {ESBuildOptions}
   */
  const esbuildOptions = {
    ...baseEsbuildOptions,
    ...(dev ? {
      jsxImportSource: "./index.js",
      jsxInject: 'import $Nixix, { nixixStore as $nixixStore } from "dom"',
    } : {
      jsxImportSource: "nixix",
      jsxInject: "import $Nixix, { nixixStore as $nixixStore } from 'nixix/dom';",
      minifyIdentifiers: true,
    })
  }
  
  /**
   * @type {Plugin_2}
   */
  const configPlugin = {
    name: "nixix-vite-config",
    config: (userConfig) => {
      userConfig.esbuild = {
        ...userConfig.esbuild,
        ...esbuildOptions
      }
    }
  };

  return configPlugin;
}

/**
 * 
 * @param {ExtendedPluginOptions} options 
* @returns {Plugin_2[]}
*/
export default function NixixPlugin({projectRoot, dev, hmr} = { projectRoot: 'src/index.tsx', dev: false, hmr: false }) {
  /**
   * @type {Plugin_2[]}
   */
  const plugins = [NixixEsbuildConfig({dev})]
  hmr && plugins.push(NixixHMR({projectRoot, dev}))
  return plugins
}

