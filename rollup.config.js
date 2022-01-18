import resolve from '@rollup/plugin-node-resolve'
import commonJs from '@rollup/plugin-commonjs'
import { terser } from "rollup-plugin-terser"
import typescript from '@rollup/plugin-typescript'
const production = !process.env.ROLLUP_WATCH
export default {
  input: 'src/main.ts',
  output: [
    {
      // sourcemap: !production,
      file: 'dist/main.cjs.js',
      format: 'cjs',
    },
    {
      // sourcemap: !production,
      file: 'dist/main.esm.js',
      format: 'esm',
    }
  ],
  plugins: [ 
    typescript(),
    resolve(), 
    commonJs(),
    terser()
  ],
  // 指出将哪些模块视为外部模块，不会将引用库的源码加入到打出的包中
  // external: [/@babel\/runtime/]
}