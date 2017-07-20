### 使用说明

### 安装
```javascript
npm install code-keeper --save-dev
这时候没法直接使用keeper命令
需要到node_modules/code-keeper目录下运行
npm link

运行keeper命令，等待keeper自动安装相关插件包

或者手动运行：
npm install --save-dev css-loader less-loader url-loader jsx-loader style-loader babel-loader babel-core babel-preset-env
npm install --save-dev webpack babel-preset-es2015 babel-preset-react babel-preset-stage-0

//router
npm install -S react-router
//antd
npm install antd --save
npm install babel-plugin-import --save-dev

```

### 查看当前配置
命令如下：
```javascript
keeper //进入keeper模式
.initconf //初始化生成默认的配置文件
.conf //查看当前配置文件信息
.help //查看所有命令及说明
```

### 初始化
命令如下：
```javascript
keeper //进入keeper模式
.init //初始化
..  //退出keeper模式
```

### 编译开发模式
```javascript
keeper //进入keeper模式
.dev //编译
.e  //退出监听编译模式
```

### 编译压缩模式
```javascript
keeper //进入keeper模式
.pub //压缩编译
```

### 清除垃圾
```javascript
keeper //进入keeper模式
.clear //清理
```

### 正静态
```javascript
keeper //进入keeper模式
.static //正静态
```

### 初始化router文件
```javascript
keeper //进入keeper模式
.initrouter //初始化所有router文件，包括，router文件及，routername
.reload  //重新加载配置文件
```

### 发布
```javascript
keeper //进入keeper模式
.release //提取需要发布的文件
```


### 插件更新日志

### v1.0.7
- 创建插件，新增nodejs内核编译引擎，新增io读写操作组件
- 新增规则文件，将规则进行封装
- 新增静态代理组件，封装正静态路由组件。
- 重构了渲染引擎和编译引擎。
- 独立封装了io流读写等操作，新增了nodejs自定义命令行
- 增加了对多语言的处理，可以同时编译多语言
- 增加了js缓存策略，根据编译时候的生成的hash来判断是否生成新的文件，来更新js
- 修改了SEO的规则
- 修改了static的规则，当文件存在时，局部更新html文件

- 去掉了app中，static的功能，从此版本开始，app和pc不同步了。（后期同步）
- 添加了增量式发布器，自动打包对应的资源文件。
- 增量发布，增加对img的控制开关，默认不打包图片
- 新增nodejs对话模式，目前主要用户release命令，提示是否清空文件夹，按命令提示，交互式动作。
- 将config.json改为config.js，摆脱json困扰，可以使用注释，更加方便
- 内嵌i18n插件
- 修复生产html时，可能截取的内容错误问题，导致产生重复内容，同时也修改了static的问题，兼容跨平台
- 增加了对trans配置文件的检测，如果不存在就不会执行。
- 提取了html的公共根目录的配置
- 新增了react-router的公共路由配置体系
- 新增了reload，可以重新加载所有配置文件，包括，config.js,seoinfor,routerlist
- 增加了对于config.js的版本效验。给出版本提示。
- 增加了导航中英文名称的配置，和管理
- 新增了导航的层级关系，可以自动设置2级导航。
- routername中，新增了icon及排序的设置
- 修改了对于翻译的统一处理，预先将router下面的所有的翻译收集起来，统一处理
- 新增了真实basepath.
- 将所有项目引用的资源路径，改为了绝对路径。

### v1.0.22
- 新增initconf,用来初始化config.js
- 将webpack的依赖插件全部分离出来了，不在跟随keeper一起安装了，请用户自行安装，有提供命令
- config中提供了对于公共资源的引入配置
- 优化了static的编译速度，过滤了图片资源的下载。提供了简易的进度条。
- 修改了一些文件的语法，替换为es6模式
- 增加了对keeper环境的效验

### v1.1.8
- 所有插件全面升级，webpack3.0，router4.0，babel7.1，i18n1.0，配置文件全面升级
- 新增了自动化安装所有依赖插件包
- 语法全面升级，改为es6以上，优化算法。
- 新增配置文件效验，每次使用keeper时，会自动效验config的相关参数是否正确。
- 新增初次使用keeper检索，来判断是否效验插件包
- 更新了相关模板
- 增加了对翻译文件位置及是否存在的效验
- 增加了wrap对于多语言的支持
- 增加了正静态时，是否忽略图片文件的配置