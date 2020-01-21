### 使用说明

### 查看当前配置
命令如下：
```javascript
marauder //进入cadmin模式
.help //查看所有命令及说明
```

### 功能解析说明
```javascript


```

### 插件更新日志
### v0.0.1
- 新增相关koa依赖插件
- 自动化安装相关插件
- io流静态缓存体系，缓存读写，清理缓存
- 静态文件流，日志系统，日志读写
- 进程总数限制
- ip测试系统，自动切换动态ip地址
- http测试系统
- 新增一种监控方式，3重监控，包括：
  1）控制台日志级控制，主要为人为肉眼识别监控信息。
  2）screen控制台级动态实时监控，主要为手控模式，提供引擎动态信息识别，方便手控模式
  3）数据日志系统，为数据统计提供的，人为很难辨识

### 使用说明

### 安装
```javascript
npm install data-marauder --save-dev
到node_modules/data-marauder目录下运行
npm link

### 查看当前配置
命令如下：
```javascript
seo //进入cadmin模式
.help //查看所有命令及说明
```

### 功能解析说明
```javascript
.ipinterval [mins]
动态设置IP切换的时间间隔，参数以分钟为单位
// .auto-login [account]
自动登录，参数为账号列表索引，可以选择用哪一个账号来登录
.clearprocess
强制清理进程池
.manualchangeip
将IP代理切换到人工模式，自动关闭智能IP切换
智能IP切换规则：连续2次解析失败，则判断为IP不可以用，自动切换IP
.autoproxy
开启智能判断，自动切换IP

// /loginstatus/self/curr/ 查看登录态
// /logincode/self/curr/ 登录码

```

### 插件更新日志

### v1.0.2
- 分离SEO体系
- 新增相关koa依赖插件
- 修改readme

### v1.1.18
- 自动化安装相关插件

### v1.1.30
- 新版本，启用puppeteer
- 静态文件流，日志系统，日志读写

### v1.1.50
- 提取对于Chrome内核的控制拦截器机制，前置拦截器
- http测试系统

### v1.1.70
- 日志，增加失败，时间，商品，登录，等信息

### v1.3.0
- 集群中控平台
- 初始化运行的时候，自动创建图片文件夹路径
