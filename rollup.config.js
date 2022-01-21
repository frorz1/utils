import resolve from '@rollup/plugin-node-resolve'
import commonJs from '@rollup/plugin-commonjs'
import { terser } from "rollup-plugin-terser"
import typescript from '@rollup/plugin-typescript'
import babel, { getBabelOutputPlugin } from '@rollup/plugin-babel'
const production = !process.env.ROLLUP_WATCH
const input = 'src/main.ts'
const getBabelConfig = (buildBundled = true) => {
  // 在ts编译结束之后再进行ployfill，这样不会影响模块化的结构
  const config = {
    exclude: 'node_modules/**',
    extensions: ['.ts'],
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
    ]
  }
  if (buildBundled) {
    config.babelHelpers = 'bundled' // bundle-打包应用，runtime-打包库
  } else {
    // getBabelOutputPlugin 是在rollup打包结束之后，把产物(esm, cjs, umd)传递给babal, 然后babel再对其做polyfill, babel此时并不会破坏产物的规范
    // 真正的解析import xxx from 'xxx'是在rollup或者webpack打包的时候
    // 也就是，先Babel，后rollup -> 得到的是bundle
    // 先rollup， 再babel的到的是 -> 具有（esm, cjs）规范的代码
    config.allowAllFormats = true
    config.plugins = [
      ["@babel/plugin-transform-runtime", {
        corejs: 3,
        useESModules: true
      }]
    ]
  }
  return config
}
const plugins = [
  typescript({sourceMap: !production}),
  resolve(),
  commonJs(),
  // terser()
]
export default [
  {
    input,
    plugins: [...plugins, babel(getBabelConfig(true))], // umd需要单独打包
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
    plugins: [...plugins, getBabelOutputPlugin(getBabelConfig(false))],
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