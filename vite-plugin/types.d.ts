import { Plugin as Plugin_2 } from 'vite';

export type PluginOptions = {
  projectRoot?: `${string}/${string}`;
  dev?: boolean;
};

export type ExtendedPluginOptions = PluginOptions & {
  hmr?: boolean;
};

export default function NixixPlugin({projectRoot, dev, hmr}: ExtendedPluginOptions): Plugin_2[]

