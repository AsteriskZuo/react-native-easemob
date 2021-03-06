# 面向开发者的使用说明
    使用人群：代码贡献者、测试贡献者、问题发现者、对项目感兴趣的学习者

---

## 开发环境

### 操作系统
> 建议 macos: 10.15.7
> 如果是m1芯片: 建议 macos: 最新
> ### 环境变量
> JAVA_HOME
> ANDROID_HOME
### 工具: Xcode
> macos10.15.7 只能安装最高12.4版本的xcode
> 如果是m1芯片: 建议升级到最新
> 安装完成，需要安装命令行工具。
> 建议安装完成运行一下，权限或者秘钥是需要激活或者处理的。
### 工具: Android Studio
> 建议使用 2020.3.1或以上版本
> 如果是m1芯片: 建议安装arm64版本
> 建议安装完成运行一下，最好是运行该项目，这样保证需要下载的依赖全部下载。
### 工具: Visual Studio Code
> 建议安装最新版本
> 必须安装的插件: react-native-tools 微软出品。
### 工具: Brew
> 建议安装最新，或者升级到最新
> 如果是国内用户，可以参考gitee上的安装方法[参考](https://gitee.com/cunkai/HomebrewCN)  
### 工具: Git
> mac系统自带，建议使用brew升级到最新，或者官方安装
> 要求是配置ssh信息，因为项目里面使用ssh进行子项目管理。
### 工具: JDK
> 建议安装java8(别名1.8)或以上版本
> 如果是m1芯片: 建议使用arm64版本，android studio自带的也行。
### 工具: NodeJs
> 建议使用官方下载包安装，或者使用brew安装
> 建议版本16(长期支持版本)以上
### 工具: Cocoapods
> 建议使用brew安装最新版本或者升级到最新
> 该工具依赖ruby，ruby自带gem
> 如果是国内用户，建议更换国内源，下载速度快稳定。
> 如果是m1芯片，安装出现报错，可能是ruby2.6.x版本导致的，需要升级
### 工具: Watchman
> 这是调试工具。
> 建议使用brew安装最新，或者升级到最新。
### 工具: npm
> 这是js的包管理工具。
> 安装nodejs的使用自带安装。
### 工具: yarn
> 这是项目编译构建工具。
> 使用npm进行全局安装。
### 工具: react-native-cli
> 这是react-native的命令行工具。
> 使用npm进行全局安装。不建议全局安装react-native。
### 工具: create-react-native-library
> 这是npm包，创建react-native项目的工具。
> 使用npm进行安装，可以不用全局安装。
