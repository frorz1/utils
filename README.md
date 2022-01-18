# rollup

## external
该字段用于说明那些依赖是我们不想打入到最终的包里面的, 外部的包。通常我们会放到`peerDependence`或者`dependence`中。
- `dependence` - 中的依赖在用户使用我们的包的时候，会自动直接下载到我们包的node_modules中
- `peerDependence` - 则是要求用户要安装这个依赖。在安装我们包的过程中，如果用户没有次依赖，则会提示用户自行下载。比如组件库会将 vue, react等设置peerDependence

## FAQ
Q: 为什么不打到最终的包里，而是让用户侧去安装？
A: 比如我们的库依赖了A, 如果用户安装的包里有B,C也依赖了A，那么如果我们没有使用external: ["A"], 那么我们的代码里会包含一份A, 并且用户打包的其他chunk里也会有一份A, 最终产物里会出现两个A。
## babel相关配置可以参考babel.md