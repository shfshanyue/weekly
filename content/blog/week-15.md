---
title: "第 15 期: Rclone: 一条命令提高前端部署效率"
date: 2021-11-12T00:00:00.000Z
---

前端爱好者周刊 (Github: shfshanyue/weekly)，每周记录关于前端的开源工具、优秀文章、重大库版本发布记录等等，周刊中优秀文章会在公众号**全栈成长之路**逐一推送。每周一发布，订阅平台如下，欢迎订阅。

- 订阅网站: <https://weekly.shanyue.tech>
- 订阅 Github: [shfshanyue/weekly](https://github.com/shfshanyue/weekly)
- [点击在微信订阅](https://mp.weixin.qq.com/mp/appmsgalbum?action=getalbum&__biz=MjM5NjU5NjQ0NQ==&scene=1&album_id=1880625492081344514&count=3#wechat_redirect)

## 开发利器

### **一、 [Rclone: 支持多个云存储的，高性能的文件同步工具](https://rclone.org/)**

![Rclone](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dceae98f6d6a453692f1b093862ae235~tplv-k3u1fbpfcp-watermark.image?)

Rclone，rsync for cloud storage，是使用 Go 语言编写的一款高性能云文件同步的命令行工具，可理解为云存储版本的 rsync。

1. 支持多个云存储，如阿里云、腾讯与、青云、AWS 等
1. 支持按需复制，每次仅仅复制更改的文件
1. 可断点续传
1. 可压缩传输

```bash
# 安装 Rclone
$ curl https://rclone.org/install.sh | bash

# 配置 Rclone 的云存储器交互式配置，如配置阿里云的 key/secret
$ rclone config

# 配置结束之后在本机生成配置文件，可查看目录 ~/.config
$ cat ~/.config/rclone/rclone.conf
[alioss]
type = s3
provider = Alibaba
env_auth = true
access_key_id = *********************
secret_access_key = *********************
endpoint = oss-cn-beijing.aliyuncs.com
acl = public-read
storage_class = STANDARD

# 列出所有的 bucket
$ rclone lsd alioss:/
      -1 2018-11-14 21:34:17        -1 shanyue
      -1 2019-11-23 13:54:28        -1 shanyue-blog
      -1 2020-01-27 15:06:08        -1 shanyue-ncov
      -1 2019-12-02 17:48:42        -1 shanyue-question

# 复制文件，以 vuepress 为示例
$ rclone copy .vuepress/dist alioss:/shanyue-blog --progress
Transferred:              0 B / 0 B, -, 0 B/s, ETA -
Checks:              1099 / 1099, 100%
Elapsed time:         3.8s

# 对比远程文件与现在文件的区别
$ rclone copy .vuepress/dist alioss:/shanyue-blog --progress
```

**现在前端静态资源大多扔在对象存储之上，如阿里云的 OSS，腾讯云的 COS 等，使用 Rclone 大大降低传输时间，并大大缩短前端的部署时间。**

### **二、 [Image Tool 纯网页端的图像压缩工具](https://renzhezhilu.github.io/webp2jpg-online/#/)**

![Image Tool](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6f2e28069f54eef900ca7345f05d3c5~tplv-k3u1fbpfcp-watermark.image?)

颜值高、功能强大，使用 WASM 的纯网页端的图像压缩工具

- [repo: renzhezhilu/webp2jpg-online](renzhezhilu/webp2jpg-online)

### **三、 [sshshape: 简单几个点画出漂亮图形](https://fffuel.co/ssshape/)**

![sshshape](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4c6b315ff3a43b985c310e1d08041fa~tplv-k3u1fbpfcp-watermark.image?)

通过几个点就可以画出漂亮的 SVG 图形。

## 文章推荐

### **一、 [node_modules 困境](https://juejin.cn/post/6914508615969669127)**

洋洋洒洒将近一万字，提出了 node_modules 的发展现状及其若干问题，每次读后都受益匪浅。

### **二、 [Webpack 性能系列四：分包优化](https://mp.weixin.qq.com/s/LrASIdA19iwIwng29G5HpA)**

详细讲述了 SplitChunksPlugin 的分包方案及其细节

### **三、 [Chrome 新功能：支持录制、重放和测试用户操作！](https://mp.weixin.qq.com/s/MkaNfzYJMSFCiAABQuIjuA)**

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d7a2018aab64e12b222e2e8679750fb~tplv-k3u1fbpfcp-watermark.image?)

Chrome 在最新的版本（Chrome 97）里面新增了一个非常好用的功能，可以帮助我们录制、回放、测试用户操作。

## 开源与库

### **一、 [WASM-ImageMagick: WASM 版图像压缩器](https://github.com/KnicKnic/WASM-ImageMagick)**

Webassembly compilation of <https://github.com/ImageMagick/ImageMagick> & samples

- [repo: KniKnic/WASM-ImageMagick](KniKnic/WASM-ImageMagick)
- [npm: WASM-ImageMagick](https://npm.devtool.tech/WASM-ImageMagick)

### **二、 [teaful: 一个小型的 React 全局状态管理器](https://aralroca.com/blog/teaful)**

```js
import createStore from "teaful";

const { useStore } = createStore({
  username: "Aral",
  count: 0,
  age: 31,
  cart: {
    price: 0,
    items: [],
  },
});

function Example() {
  const [username, setUsername] = useStore.username();
  const [cartPrice, setCartPrice] = useStore.cart.price();

  return (
    <>
      <button onClick={() => setUsername("AnotherUserName")}>
        Update {username}
      </button>
      <button onClick={() => setCartPrice((v) => v + 1)}>
        Increment price: {cartPrice}€
      </button>
    </>
  );
}
```

- [repo: teafuljs/teaful](https://github.com/teafuljs/teaful)
- [npm: teaful](https://npm.devtool.tech/teaful)
