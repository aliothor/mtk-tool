import { readFile, readdir } from 'node:fs/promises'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: 'src/index.ts',
  output: {
    file: 'index.js',
    format: 'es',
    dir: 'bin',
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript(),
  ],
}
