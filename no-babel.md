这是一个没有 babel 的版本，并且提供了 util 多平台的配置方式，项目的具体目录如下

```bash
.
└── util
    ├── dist
    │   ├── h5.esm.js
    │   ├── h5.umd.js
    │   ├── pc.esm.js
    │   ├── pc.umd.js
    │   └── ...
    ├── h5
    │   └── package.json
    ├── pc
    │   └── package.json -> "main": "../dist/umd.js", "module": "../dist/h5.esm.js"
    ├── src
    │   ├── h5
    │   │   └── index.ts
    │   ├── pc
    │   │   └── index.ts
    │   └── index.ts
    ├── rollup.config.js
    └── tsconfig.json
```
当我使用 import {} from '@frorz/util/h5 时，会自动寻址到 util 包下的 h5 文件夹下，然后该文件夹下有 package.json，因此会被认为是一个 package

```ts
import resolve from '@rollup/plugin-node-resolve'
import commonJs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import camelcase from 'camelcase'

const h5Entry = 'src/h5/index.ts'
const pcEntry = 'src/pc/index.ts'
const entry = 'src/index.ts'

const plugins = [
  json(),
  resolve(),
  commonJs(),
  typescript({
    tsconfig: './tsconfig.json',
    outDir: '',
    declaration: false,
  }),
  terser(),
]
const getBuildOptions = (entry, fileName) => {
  return {
    input: entry,
    plugins,
    external: (id) => {
      return /webview_jsbridge/.test(id) || /@mdap/.test(id)
    },
    output: [
      {
        file: `dist/${fileName}.umd.js`,
        format: 'umd',
        name:
          fileName === 'index'
            ? `svUtil`
            : `sv${camelcase(fileName, { pascalCase: true })}Util`,
        globals: {
          '@mdap/javascript-sdk': 'javascriptSdk',
          '@mdap/sdk-plugin-api': 'APIPlugin',
          '@mdap/sdk-plugin-resource': 'ResourcePlugin',
          '@mdap/sdk-plugin-performance': 'PerformancePlugin',
          '@mdap/sdk-plugin-exception': 'ExceptionPlugin',
        },
        esModule: true,
        exports: 'named',
      },
      {
        file: `dist/${fileName}.cjs.js`,
        format: 'cjs',
        exports: 'named',
      },
      {
        file: `dist/${fileName}.esm.js`,
        format: 'esm',
        exports: 'named',
      },
    ],
  }
}

export default [
  getBuildOptions(entry, 'index'),
  getBuildOptions(h5Entry, 'h5'),
  getBuildOptions(pcEntry, 'pc'),
]
```
