import resolve from '@rollup/plugin-node-resolve'
import commonJs from '@rollup/plugin-commonjs'
import { terser } from "rollup-plugin-terser"
import babel from '@rollup/plugin-babel'

const getPlugins = (runtime = true) => {
  return [
    resolve({
      extensions: ['.js', '.ts', '.tsx'] // 不声明无法识别 import {} from './utils/device'
    }),
    commonJs(),
    babel({
      babelHelpers: runtime ? 'runtime' : 'bundled', // 给别的应用使用的库，需要用 runtime，这样不会将 helper 函数打包，而是使用 babel-transform-runtime 引入
      extensions: ['.js', 'jsx', '.ts', '.tsx'],
      exclude: 'node_modules/**',
      presets: [
        [
          "@babel/preset-env",
          {
            "targets": "last 2 versions", // 浏览器兼容目标
            "useBuiltIns": "usage", // 按需引入 polyfill
            "corejs": 3,
            "modules": false
          }
        ],
        "@babel/preset-typescript"
      ],
      plugins: runtime ? [
        [
          "@babel/plugin-transform-runtime", 
          {
            "corejs": 3,
            "helper": true,
            "useESModules": true
          }
        ]
      ] : []
    }),
    terser()
  ]
}
export default [
  {
    input: 'src/main.ts',
    // 当设置 babelHelpers: 'runtime' 时，Babel 将会将 helper 函数（比如 _classCallCheck, _createClass 等）转化为对 @babel/runtime/helpers 的 import。
    // 如果不把 @babel/runtime 设置为外部依赖，Rollup 会将 @babel/runtime 也一起打包进输出文件，导致你的 helpers 既通过 import 引入，又被内联到打包文件中。
    external: [/@babel\/runtime/],
    plugins: getPlugins(),
    output: [
      {
        file: 'dist/main.cjs.js',
        format: 'cjs',
        exports: 'named',
      },
      {
        file: 'dist/main.esm.js',
        format: 'es',
        exports: 'named',
      },
    ]
  },
  // umd 不推荐
  {
    input: 'src/main.ts',
    plugins: getPlugins(false),
    output:
    {
      file: 'dist/main.umd.js',
      format: 'umd',
      name: 'myUtil',
      esModule: true,
      exports: 'named',
    },
  }
]