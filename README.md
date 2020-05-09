# Gulp Base

一个基于 Windows NodeJs 环境，利用 Gulp 打包构建常规CSS、JS项目的基本应用。

- CSS支持SCSS，支持 postcss 自动添加兼容性前缀
- JS支持Babel自动转换
- 支持JS压缩，CSS压缩
- 支持生成 SourceMap
- 支持svg图标生成图标字体
- 支持静态文件自动复制
- Build 自动清理dist文件夹
- 支持本地调试，热重载

使用方法：

- 安装： npm install
- 启动本地调试： npm run serve ，可以运行 _run_serve.bat 快速启动调试
- Build： npm run build ，可以运行 _run_build.bat 快速 Build

配置文件是 gulpfile.js ，可根据自己需要进行更改
