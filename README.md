# 项目简介

vue多页面项目模板.

## 使用

安装依赖

```bash
npm install
```
本地开发模式

```bash
npm start
```

打包编译

```bash
npm run build
```

配置说明

css, js 等资源内联编译，在 `config/index.js` 中进行设置 inlineSource, 默认是 true

目录结构
```
  |--build ... 打包编译启动等文件
  |--config ... 各个配置
  |--dist ... 打包后的目标文件
  |--src  ... 项目目录
  |----components ... 公用组件
  |----common  ... 公用目录
  |----pages ... 页面目录
  |------demo ... 示例目录
  |--------detail
  |----------components 组件目录
  |------------base.vue 
  |----------index.js ... 入口文件【该名称为强制命名】
  |----------index.html ... html根模版文件【该名称为强制命名】
  |----------router.js
  |----------main.vue
  |--static ... 静态资源
  |----fonts... 字体
  |----img ... 图片
  |----media ... 其他媒体资源
```

        



