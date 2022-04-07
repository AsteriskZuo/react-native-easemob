# 说明

## 参考资料
[react native website](https://reactnative.dev/)
[react native website cn](https://reactnative.cn/)

## 下载项目
```
# 连带子项目一起clone
git clone --recurse-submodules git@github.com:AsteriskZuo/react-native-easemob.git

# 初始化子项目(如果clone主项目的时候没有更新子项目)
git submodule update --init --recursive
```

## 构建准备
[native说明](../native_src/cpp/README.md)

## 本项目创建流程
```~bash
npm install -g react-native@0.66.4
npm install -g create-react-native-library
npm install -g react-native-builder-bob
npm install -g yarn
npx create-react-native-library --slug "react-native-easemob" --languages "java-objc" --type "module" --example "native" "react-native-easemob"
cd react-native-easemob
npx react-native-builder-bob init

```

```~bash
➜  easemob npx create-react-native-library --version
0.20.1
```

```~bash
➜  easemob npx react-native-builder-bob --version
0.18.2
```

```~bash
➜  react-native-easemob git:(master) ✗ npx react-native-builder-bob init
✔ The working directory is not clean. You should commit or stash your changes before configuring bob. Continue anyway? … yes
✔ Where are your source files? … src
✔ Where do you want to generate the output files? … lib
✔ Which targets do you want to build? › commonjs - for running in Node (tests, SSR etc.), module - for bundlers (metro, webpack etc.), typescript - declaration files for typechecking
✔ Your package.json has the 'main' field set to 'lib/commonjs/index'. Do you want to replace it with 'lib/commonjs/index.js'? … no
✔ Your package.json has the 'react-native' field set to 'src/index'. Do you want to replace it with 'src/index.tsx'? … no
✔ Your package.json has the 'module' field set to 'lib/module/index'. Do you want to replace it with 'lib/module/index.js'? … no
✔ Your package.json has the 'types' field set to 'lib/typescript/index.d.ts'. Do you want to replace it with 'lib/typescript/src/index.d.ts'? … yes
✔ Your package.json already has a 'files' field. Do you want to update it? … yes
Project react-native-easemob configured successfully!

Perform last steps by running:

  $ yarn

Good luck!
```


## 编译和运行
```~bash
// 初始化
$ yarn

// 编译和构建ios
$ yarn example ios

// 编译和构建android
$ yarn example android
```

## 调试技巧
```~bash
// you can run watch mode to automatically rebuild the changes
$ yarn watch

// make sure your code passes TypeScript and ESLint. Run the following to verify:
$ yarn typescript
$ yarn lint

// fix formatting errors, run the following
$ yarn lint --fix

// 显示开发菜单
// ios模拟器中使用 `command` + `D`
// android模拟器中使用 `command` + `M`
// 或者摇晃手机


// 显示弹窗
// LogBox
import { LogBox } from 'react-native';

// Ignore log notification by message:
LogBox.ignoreLogs(['Warning: ...']);

// Ignore all log notifications:
LogBox.ignoreAllLogs();


// 开发工具
// chrome可以调试源码
// react-devtools可以调试界面
$ npm install -g react-devtools
****

```


## 创建完成之后编译遇到的问题
1. 无法调试问题
   1. vscode需要安装插件 `React Native Tools` `https://github.com/microsoft/vscode-react-native`
2. 找不到入口函数问题
   1. 添加文件 `example/index.js`， 原来的文件是 `example/index.tsx`
3. android编译报错问题 `No toolchains found in the NDK toolchains folder for ABI with prefix: arm-linux-androideabi`
   1. 需要设置gradle版本以及ndk目录
   2. `classpath("com.android.tools.build:gradle:4.1.0")`, 原来是3.5.3版本，必须4.x以上(https://stackoverflow.com/questions/66922162/no-toolchains-found-in-the-ndk-toolchains-folder-for-abi-with-prefix-arm-linux)
   3. `android {ndkVersion '23.1.7779620' }`
4. ios 编译问题：`Typedef redefinition with different types ('uint8_t' (aka 'unsigned char') vs 'enum clockid_t')`
   1. 设置最低版本高于iphone 10.例如：11.4
   2. 比较笨但是有效的方法是，注释掉 `/Users/asterisk/tmp/js/react_native_demo/crnl_demo/example/ios/Pods/Headers/Public/Flipper-Folly/folly/portability/Time.h` 该文件内容，这个文件是为了解决xcode8以及更低版本的问题。
   3. 提高 `Flipper-Folly` ios deployment target 版本到11.4
   4. 前面3个建议都不是最优选择，应该升级pod里面的`Flipper-Folly`的版本。`use_flipper!({ 'Flipper-Folly' => '2.5.3', 'Flipper' => '0.87.0', 'Flipper-RSocket' => '1.3.1' })`




## 调试遇到的问题
1. android调试问题：示例app启动，找不到调试服务器
   * 手机没有正确连接到电脑
   * 飞行模式需要禁用
   * 需要手机和电脑在同一个网络
   * 5.0以上的版本，需要进行数据转发： `adb reverse tcp:8081 tcp:8081`

## 可能遇到的问题
1. editorconfig影响第三方代码格式
   * 可以忽略文件夹： https://stackoverflow.com/questions/30310396/possible-to-ignore-exclude-file-folder-from-editorconfig


## 安装日志
```
asterisk@msyncdeMBP rn % npm install -g react-native@0.66.4
npm WARN ERESOLVE overriding peer dependency
npm WARN While resolving: use-subscription@1.6.0
npm WARN Found: react@17.0.2
npm WARN node_modules/react-native/node_modules/react
npm WARN   peer react@"17.0.2" from react-native@0.66.4
npm WARN   node_modules/react-native
npm WARN     react-native@"0.66.4" from the root project
npm WARN     1 more (@react-native-community/cli)
npm WARN 
npm WARN Could not resolve dependency:
npm WARN peer react@"^18.0.0" from use-subscription@1.6.0
npm WARN node_modules/react-native/node_modules/use-subscription
npm WARN   use-subscription@"^1.0.0" from react-native@0.66.4
npm WARN   node_modules/react-native
npm WARN 
npm WARN Conflicting peer dependency: react@18.0.0
npm WARN node_modules/react
npm WARN   peer react@"^18.0.0" from use-subscription@1.6.0
npm WARN   node_modules/react-native/node_modules/use-subscription
npm WARN     use-subscription@"^1.0.0" from react-native@0.66.4
npm WARN     node_modules/react-native
npm WARN deprecated urix@0.1.0: Please see https://github.com/lydell/urix#deprecated
npm WARN deprecated source-map-url@0.4.1: See https://github.com/lydell/source-map-url#deprecated
npm WARN deprecated resolve-url@0.2.1: https://github.com/lydell/resolve-url#deprecated
npm WARN deprecated source-map-resolve@0.5.3: See https://github.com/lydell/source-map-resolve#deprecated
npm WARN deprecated uuid@3.4.0: Please upgrade  to version 7 or higher.  Older versions may use Math.random() in certain circumstances, which is known to be problematic.  See https://v8.dev/blog/math-random for details.
npm WARN deprecated uglify-es@3.3.9: support for ECMAScript is superseded by `uglify-js` as of v3.13.0
npm WARN deprecated sane@4.1.0: some dependency vulnerabilities fixed, support for node < 10 dropped, and newer ECMAScript syntax/features added

added 692 packages, and audited 693 packages in 4m

20 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
asterisk@msyncdeMBP rn % npm install -g create-react-native-library

added 74 packages, and audited 75 packages in 22s

4 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
asterisk@msyncdeMBP rn % npm install -g react-native-builder-bob

added 282 packages, and audited 283 packages in 54s

28 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
asterisk@msyncdeMBP rn % 
```

## eslint
[eslint en](https://eslint.org/docs/rules/no-shadow)  
[eslint cn](http://eslint.cn/docs/rules/no-shadow)  