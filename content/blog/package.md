---
title: 前端有趣的库
---



### **1、 [undici: 使用 Node 从零开发的 HTTP/1.1 客户端](https://github.com/nodejs/undici)**

``` js
import { request } from 'undici'

const {
  statusCode,
  headers,
  trailers,
  body
} = await request('http://localhost:3000/foo')

console.log('response received', statusCode)
console.log('headers', headers)
```

nodejs 官方发布，从头写一个 HTTP/1.1 客户端


+ [repo: nodejs/undici](https://github.com/nodejs/undici)
+ [npm: undici](https://npmjs.com/package/undefined)
    

### **2、 [np: 更好更安全的 npm publish](https://github.com/sindresorhus/np)**

![](./assets/np.gif)

一个更安全的 npm publish，比如发包之前需要通过单元测试，支持2FA等。


+ [repo: sindresorhus/np](https://github.com/sindresorhus/np)
+ [npm: np](https://npmjs.com/package/undefined)
    

### **3、 [size-limit: 控制你的 Package/Bundle 大小](https://github.com/ai/size-limit)**

无论是开发一个前端应用还是发布一个 npm package，它的包大小是敏感且重要的，实为开发者一大利器。

使用 size-limit 可在 git hooks 或者 CI 中控制发布包的大小 (可配置 gzip 或者 brotli 压缩算法)，及浏览器中 JS 的下载及执行时间。

你既可以在 `git hooks` 中使用

![](./assets/size-limit-show.png)

也可以在 `CI` 中使用，如 `github actions`、`Gitlab CI`

![](./assets/size-limit-ci.png)


+ [repo: ai/size-limit](https://github.com/ai/size-limit)
+ [npm: size-limit](https://npmjs.com/package/undefined)
    

### **4、 [pnpm: 更快、占用空间更小的包管理器](https://github.com/pnpm/pnpm)**

使用 npm、yarn 及 pnpm 下载 React 时的 Benchmark，可见 pnpm 比其它包管理工具要快两倍

![Benchmark](./assets/pnpm-react-app.svg)

从图中，也可以看出 npm v7 性能比 yarn 有更好的性能


+ [repo: pnpm/pnpm](https://github.com/pnpm/pnpm)
+ [npm: pnpm](https://npmjs.com/package/undefined)
    

### **5、 [popperjs: 轻量可定制化的 Tooltip 工具库](https://popper.js.org/)**

仅仅只有 3KB 大小，无任何依赖的轻量级 tooltip 工具库，支持 TS，非常流行，每个月有 3500 万次下载。

+ [repo: popperjs/popper-core](https://github.com/popperjs/popper-core)
+ [npm: @popperjs/core](https://npmjs.com/package/undefined)
    

### **6、 [multiavatar: 自动生成多元化头像](https://multiavatar.com/)**

可根据名称自动生成多元化的头像

![](./assets/multiavatar.gif)


+ [repo: multiavatar/Multiavatar](https://github.com/multiavatar/Multiavatar)
+ [npm: @multiavatar/multiavatar](https://npmjs.com/package/undefined)
    
