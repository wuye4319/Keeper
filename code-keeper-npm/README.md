### 使用说明

### 安装
```javascript
npm install code-keeper-npm -g
运行nkeeper，等待nkeeper自动安装相关插件包
```

### 查看当前配置
命令如下：
```javascript
nkeeper //启动keeper，自动对项目环境进行检查
-h // 查看帮助
nkeeper registry // 查看并切换代码源
```

### 项目初始化
```javascript
nkeeper init //项目生成
```

### 编译开发模式
自动识别环境版本
```javascript
nkeeper dev //开发编译
nkeeper pub //发布编译
nkeeper inspect // 检查配置文件
```

### 文件生成
```javascript
nkeeper create //项目生成
-p page //生成页面
-c component //生成组件碎片
```

### 文件清理
```javascript
nkeeper clear //进入keeper模式
-p page //生成页面
-c component //生成组件碎片
```

### 插件更新日志

### v1.0.7
- 创建插件，新增nodejs内核编译引擎，新增io读写操作组件
- 重构了渲染引擎和编译引擎。
- 独立封装了io流读写等操作，新增了nodejs自定义命令行
- 提取了html的公共根目录的配置
- 增加了对keeper环境的效验
- 新增了自动化安装所有依赖插件包
- 新增初次使用keeper检索，来判断是否效验插件包
