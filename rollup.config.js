import resolve from '@rollup/plugin-node-resolve'
import commonJs from '@rollup/plugin-commonjs'
import { terser } from "rollup-plugin-terser"
import typescript from '@rollup/plugin-typescript'
import babel, { getBabelOutputPlugin } from '@rollup/plugin-babel'
const production = !process.env.ROLLUP_WATCH
const input = 'src/main.ts'
const plugins = [
  typescript({sourceMap: !production}),
  resolve(), 
  // 在ts编译结束之后再进行ployfill，这样不会影响模块化的结构
  getBabelOutputPlugin({
    exclude: 'node_modules/**',
    // babelHelpers: 'runtime',
    extensions: ['.ts'],
    allowAllFormats: true,
    "presets": [
      ["@babel/preset-env", {
          "modules": false,
          "targets": {
            "browsers": [
              "> 1%",
              "last 2 versions"
            ]
          },
          "useBuiltIns": "usage",
          "corejs": {
            "version": 3,
            "proposals": true
          }
        }]
    ],
    "plugins": [
      ["@babel/plugin-transform-runtime", {
        corejs: 3
      }]
    ]
  }),
  commonJs(),
  // terser()
]
export default [
  {
    input,
    plugins: [babel()], // umd需要单独打包
    output: {
      file: 'dist/main.umd.js',
      format: 'umd',
      name: 'myUtil',
      esModule: true,
      exports: 'named',
    },
  },
  {
    input,
    plugins,
    output: [
      {
        file: 'dist/main.cjs.js',
        format: 'cjs',
        exports: 'named',
      },
      {
        file: 'dist/main.esm.js',
        format: 'esm',
        exports: 'named',
      }
    ]
  }
]