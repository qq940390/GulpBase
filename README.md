# Gulp Base

一个基于 Windows NodeJs 环境，利用 Gulp 打包构建常规CSS、JS项目的基本应用。

- CSS支持SASS，支持 autoprefixer 自动添加前缀
- JS支持Babel自动转换
- 支持JS压缩，CSS压缩
- 支持生成 SourceMap
- Build 自动清理dist文件夹
- 支持本地调试

其中用到了SASS，所以需要安装Ruby和SASS，安装方法参考sass官网：
[https://www.sass.hk/install/](https://www.sass.hk/install/)

使用方法：

- 安装： npm install
- 启动本地调试： npm run server ，可以运行 _run_server.bat 快速启动调试
- Build： npm run build ，可以运行 _run_build.bat 快速 Build

配置文件是 gulpfile.js ，可根据自己需要进行更改

本地调试和Build不可同时运行，当然，你也可以同时运行，然后...
