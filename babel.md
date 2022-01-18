## 为什么没有使用babel
因为ta打包现在已经做的很好了，而且产物会比babel小很多，所以现在有一种趋向是去babel

## babel配置说明
```sh
npm install @babel/cli @babel/core @babel/preset-env @babel/plugin-transform-runtime -D

# polyfills
npm install core-js

# 如果打包类库，请安装
npm install @babel/runtime

# 如果打包应用，请安装
npm install @babel/runtime-corejs3
```

配置如下： 
```json
{
  "presets": [
    ["@babel/preset-env", {
        // 我们设置 "modules": false ，否则 Babel 会在 Rollup 有机会做处理之前，将我们的模块转成 CommonJS ，导致 Rollup 的一些处理失败。
        "modules": false,
        "targets": {
          "ie": 11,
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
      "corejs": 3, // 打包库
      "version": "^7.16.8"
    }],
    ["@babel/plugin-transform-runtime"] // 打包应用
  ]
}
```

## 插件说明

> 不引入@babel/runtime
```js
// 以全局变量的方式引入ployfills，如果用户有修改Array, Promise,可能会出现问题。
require("core-js/modules/es.array.includes.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.promise.finally.js");

function _defineProperties(target, props) { 
  for (var i = 0; i < props.length; i++) { 
    var descriptor = props[i]; 
    descriptor.enumerable = descriptor.enumerable || false; 
    descriptor.configurable = true; 
    if ("value" in descriptor) 
    descriptor.writable = true; 
    Object.defineProperty(target, descriptor.key, descriptor); 
  } 
}

function _createClass(Constructor, protoProps, staticProps) { 
  if (protoProps) _defineProperties(Constructor.prototype, protoProps); 
  if (staticProps) _defineProperties(Constructor, staticProps); 
  Object.defineProperty(Constructor, "prototype", { writable: false }); 
  return Constructor; 
}

function _classCallCheck(instance, Constructor) { 
  if (!(instance instanceof Constructor)) { 
    throw new TypeError("Cannot call a class as a function"); 
  }
}
```
可以看到辅助函数都是通过声明一次的方式，如果有很多文件，讲引起大量重复声明

> 引入@babel/runtime，但是如果不用@babel/plugin-transform-runtime， 则需要手动引入。
```js
require("@babel/runtime/helpers/createClass")
require("@babel/runtime/helpers/classCallCheck")
```
这样非常不方便，没人会记得住所有辅助函数

> @babel/plugin-transform-runtime 用于帮助我们自动从@babel/runtime中引入辅助函数，并且可以提供给我们一个sandbox环境, 避免污染全局变量（改功能使用@babel/runtime-corejs2/3）时才有
```js
// 可以看到，@babel/plugin-transform-runtime自动帮我们从runtime中引入了函数
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
```

使用@babel/runtime-corejs3

```js
// 可以看到用变量代替了直接修改原声全局对象
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));
```

