### 使用说明

### 安装
```javascript
npm install code-keeper -g
运行keeper，等待keeper自动安装相关插件包
```

### 查看当前配置
命令如下：
```javascript
keeper //进入keeper模式
.initconf //自动生成，默认的配置文件
.initconf -a //自动生成，管理后台的，默认配置文件
.conf //查看当前配置文件信息
.help //查看所有命令及说明
```

### 初始化
命令如下：
```javascript
先配置config.js里的myModule,childModule
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
.static //正静态，默认是不会缓存静态图片资源的
.static img // 正静态，缓存图片
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
.release img //提取包括图片的需要发布的文件
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
- 添加了增量式发布器，自动打包对应的资源文件。
- 增量发布，增加对img的控制开关，默认不打包图片
- 新增nodejs对话模式，目前主要用户release命令，提示是否清空文件夹，按命令提示，交互式动作。
- 内嵌i18n插件
- 提取了html的公共根目录的配置
- 新增了react-router的公共路由配置体系
- 新增了reload，可以重新加载所有配置文件，包括，config.js,seoinfor,routerlist
- 增加了对于config.js的版本效验。给出版本提示。
- 增加了导航中英文名称的配置，和管理
- 新增了导航的层级关系，可以自动设置2级导航。
- routername中，新增了icon及排序的设置
- 新增了真实basepath.
- 将所有项目引用的资源路径，改为了绝对路径。

### v1.0.49
- 新增initconf,用来初始化config.js
- config中提供了对于公共资源的引入配置
- 增加了对keeper环境的效验

### v1.1.8
- 所有插件全面升级，webpack3.0，router4.0，babel7.1，i18n1.0，配置文件全面升级
- 新增了自动化安装所有依赖插件包
- 新增配置文件效验，每次使用keeper时，会自动效验config的相关参数是否正确。
- 新增初次使用keeper检索，来判断是否效验插件包
- 增加了对翻译文件位置及是否存在的效验
- 增加了wrap对于多语言的支持
- 增加了正静态时，是否忽略图片文件的配置
- 增加了作者身份信息签名，方便后期维护

### v1.2.0
- 梳理算法，语法
- 分离了wrap，配置独立化了，不再和dev公用，config生成过程更加清晰
- 读取config改为实时读取，并将全局函数清理，避免变量污染。
- 清理rules里的path，模块需要的配置，分离到各自模块文件中，不在统一管理，很多配置仅仅在该模块中使用，复用率很低
- 修复html里loadjs路径，路由单页面也会生成独立的html，读的js和总路由的js路径是相同的
- 修复clear命令，修正路径，并去除了清理文件后，自动化重置路由，路由要手动重置，可能清理时，整个路由都为空了，无法遍历路径的问题，
  而且，由用户手动来决定，是否重置路由。
- 修复翻译问题，提取loading img到配置文件
- 配置文件，架构层次中，新增主题概念
