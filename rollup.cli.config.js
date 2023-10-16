import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

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
