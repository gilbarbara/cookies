import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import external from 'rollup-plugin-exclude-dependencies-from-bundle';
import { terser } from 'rollup-plugin-terser';

const packageJson = require('./package.json');

// @ts-ignore
const sourcemapPathTransform = relativeSourcePath =>
  relativeSourcePath.replace('../src/src', '../src');

export default {
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
      sourcemapPathTransform,
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
      sourcemapPathTransform,
    },
  ],
  plugins: [
    external({ dependencies: true, peerDependencies: true }),
    resolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    terser(),
  ],
};
