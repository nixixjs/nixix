import { join, normalize } from "path";

export default function NixixHMR(projectRoot, dev) {
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
          import.meta.hot?.accept((newMod) => {
            delete $nixixStore['$$__routeStore']
            $agnosticRouteObjects.length = 0;
            ($nixixStore?.root)?.replaceChildren?.("");
            newMod?.default?.();
          });
        };
        import { agnosticRouteObjects as $agnosticRouteObjects } from "${dev ? 'router/utils' : 'nixix/router/utils'}";
        `;
        return {
          code: `${prelude}${code}`,
        };
      }
    },
  };

  return [hmrplugin];
}

const esbuildOptions = {
  jsxFactory: "$Nixix.create",
  jsxFragment: '"fragment"',
  jsxImportSource: "nixix",
  jsxDev: false,
  jsx: "transform",
  jsxInject: "import $Nixix, { nixixStore as $nixixStore } from 'nixix/dom';",
  minifyIdentifiers: true,
};

const devEsbuildOptions = {
  jsxDev: false,
  jsx: "transform",
  jsxFactory: "$Nixix.create",
  jsxFragment: "'fragment'",
  jsxImportSource: "./index.js",
  jsxInject: 'import $Nixix, { nixixStore as $nixixStore } from "dom"',
};

export { devEsbuildOptions, esbuildOptions };
