# http报文结构

```起始行 + 头部 + 空行 + 实体```


##  请求报文

起始行结构: 方法 + 路径 + http版本

```JavaScript
POST /mock/ebd9fdbd926cb76a6bcc60a60cb8b20b/api/dms/user/login HTTP/1.1
```

头部就是请求头里面的一些选项,内容比较多,这里就不一一赘述了

```JavaScript
Accept: application/json, */*
Content-Type: application/json
```

空行是 请求头和实体(请求参数)的分割线

[空行作用](#空行作用)

实体是请求参数,请求body

```JavaScript
// post
{'name':'张三'} 
// get
 xxxx.com?name=gaoyuanyuan
```

整体示例

```JavaScript
POST /mock/ebd9fdbd926cb76a6bcc60a60cb8b20b/api/dms/user/login HTTP/1.1
Accept: application/json, */*
Content-Type: application/json

{'name':'张三'}
```

![image.png](https://i.loli.net/2021/09/03/oBm7nljOkeiHrpg.png)

##  响应报文

起始行结构: http版本 + 状态码 + 原因

```JavaScript
HTTP/1.1 200 OK
```

响应头部

```JavaScript
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: https://www.fastmock.site
Connection: keep-alive
Content-Length: 80
Content-Type: application/json; charset=utf-8
Date: Fri, 03 Sep 2021 06:01:17 GMT
Etag: W/"50-8fTCRozfmd5gGhhiwMsWgIeuEPo"
Server: nginx/1.17.8
Vary: Accept, Origin, Accept-Encoding
X-Powered-By: Express
```

空行是响应和实体(响应数据)的分割线。

[空行作用](#空行作用)

实体就是响应体,body

```JavaScript
{
  "code": 0,
  "data": {
    "access_token": "editor-token",
    "refresh_token": "editor-token"
  }
}
```
完整示例

```JavaScript
HTTP/1.1 200 OK
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: https://www.fastmock.site
Connection: keep-alive
Content-Length: 80
Content-Type: application/json; charset=utf-8
Date: Fri, 03 Sep 2021 06:01:17 GMT
Etag: W/"50-8fTCRozfmd5gGhhiwMsWgIeuEPo"
Server: nginx/1.17.8
Vary: Accept, Origin, Accept-Encoding
X-Powered-By: Express

{
  "code": 0,
  "data": {
    "access_token": "editor-token",
    "refresh_token": "editor-token"
  }
}
```

![image.png](https://i.loli.net/2021/09/03/Ee67VSCXLr2isQc.png)

### 起始行

值得注意的是，在起始行中，每两个部分之间用空格隔开，最后一个部分后面应该接一个换行，严格遵循ABNF语法规范。

### 空行作用

如果说在头部中间故意加一个空行会怎么样？那么空行后的内容全部被视为实体。

# http 状态码

RFC规定HTTP的状态码为三位数,被分为五类:
+ 1xx: 表示目前是协议处理的中间状态,还需要后续操作。
+ 2xx: 表示成功状态
+ 3xx: 重定向状态,资源位置发生变动,需要重新请求
+ 4xx: 请求报文错误
+ 5xx: 服务端发生错误

## 1xx

101 switching Protocol。在HTTP升级为websocket的时候，如果服务器同意变更，就会发送状态吗101

## 2xx

200 是成功的状态,通常响应体中会有数据

204 No content 成功,但是响应体里面没有内容

206 `Partial Content` 顾名思义,表示部分内容,使用场景是 `HTTP`分块下载和断点续传, 响应头字段 `Content-Range`

## 3xx

301 Moved Permanently 永久重定向,对应着302 Found, 即临时重定向。

302 Found 临时重定向

网站从http升级为https,以前的站点不用了,应当返回301,浏览器会做缓存优化,在第二次访问http地址的时候自动访问重定向的https地址

如果只是暂时不用,可以返回302 即可, 302浏览器不会做缓存优化

304 Not Modified 协商缓存命中时会返回这个状态码。

客户端怎么知道有没有修改,这是个服务端的事情

[相关解释]:(https://baike.baidu.com/item/304%E7%8A%B6%E6%80%81%E7%A0%81/7867141)

## 4xx

400 Bad Request: 最有可能的错误是请求方法弄错了, 比如: get 方法用成了post 这是我的经验,哈哈

403 Forbidden: 服务器禁止访问,原因很多,比如法律禁止、信息敏感等

404 Not Found: 资源未找到,表示没在服务器上找到相应的资源。

405 Method Not Allowed: 请求方法不被服务端允许

406 Not Acceptable: 资源无法满足客户端的条件。

408 Request Timeout: 服务器等待了太长时间

409 Conflict: 多个请求发生了冲突

413 Request Entity Too Large: 请求体的数据过大

414 Request-URL Too Long: 请求过多。

429 Too Many Request: 客户端发送的请求过多

431 Request Header Fields Too Large 请求头的字段内容过大

## 5xx 

500 Internal Server Error:仅仅告诉你服务器出错了,啥错咱不知道,找后端就对了

501 Not Implemented: 表示客户端请求的功能还不支持

502 Bad GateWay:服务器自身是正常的,但访问的时候出错了,啥错误咱也不知道,单词的意思就是网关

503 Service Unavailable:表示服务器当前很忙, 暂时无法响应服务

# 浏览器输入url发生了什么

DNS解析 => TCP连接 => 发送http请求 => 关闭TCP连接 => 浏览器渲染

## DNS解析

域名系统（英文：Domain Name System，缩写：DNS）是互联网的一项服务。它作为将域名和IP地址相互映射的一个分布式数据库，能够使人更方便地访问互联网。树状结构

域名和IP的关系 = 小红和家庭地址的关系

通俗点讲就是说 DNS就是一个地址簿,比如你有很多朋友,小明,小红,小刚等等,你很容易就叫出这些名字,但是让你说出小红家在哪,很难马上说出来吧,此时地址簿的用处就出现了,在上面查到地址就可以去了


![image.png](https://i.loli.net/2021/09/06/fJuNHVBpDkCnLms.png)

1. root级DNS服务器=>顶级域名DNS服务器的ip地址
2. 顶级域DNS服务器=>权威域名DNS服务器的ip地址
3. 权威域名服务器=>请求的主机的ip地址

### DNS的域名查找

客户端和浏览器端,本地DNS之间的查询方式是递归查询;只要其中一环找到结果就会都会结束查找流程

![image.png](https://i.loli.net/2021/09/06/9VOyDpFiAgdzLtN.png)

本地DNS服务器与根域和其子域名之间的查询方式是迭代查询,若未用转发模式，则迭代查找过程如下图：

![image.png](https://i.loli.net/2021/09/06/Q4Xbz5rGlwg8SBo.png)

[关于转发模式的解释](https://www.huaweicloud.com/articles/12529141.html)


优化处理

+ DNS存在这多级缓存,浏览器缓存,DNS缓存,路由器缓存,IPS服务器缓存,根域名服务器缓存,顶级域名服务器缓存,主域名服务器缓存
+ 域名和ip映射的过程中,有了做均衡负载的机会,可以是简单的均衡负载,也可以是根据地址和运营商的全局负载均衡

## 建立TCP连接

首先,判断是不是https的,如果是,https其实是http + ssl / Tls ,在http上加上一层处理加密信息的模块。服务端和客户端的信息传输都会通过TLS进行加密，所以传输的数据都是加密的数据

三次握手

1. 第一次握手
建立连接。客户端发送请求报文段，将 SYN 位置为1, sequence Number 为 x; 然后, 客户端进入 SYN_SEND状态, 等待服务器的确认
2. 第二次握手
服务器收到SYN报文段,服务器收到客户端的 SYN 报文段,需要对这个报文段进行确认,设置 Acknowledgment Number 为 x + 1; 同时, 自己还要发送 SYN 消息, Sequence Number 为 y ; 服务端将上述所有信息放到一个报文段(SYN + ACK 报文段) 中, 一并发给客户端, 此时服务器进入 SYN_RECV 状态

3. 第三次握手
客户端收到 SYN + ACK 报文段。然后 Acknowledgment Number 设置为 y + 1, 向服务器发送 ACK 字段, 这个报文段发送完毕以后, 客户端和服务端都进入 ESTABLISHED 状态, 完成 TCP 三次状态

SSL 握手过程

1. 第一阶段
建立安全能力,协议版本,会话ID密码构件,压缩方法和初始随机数
2. 第二阶段
服务器发送证书, 密匙交换数据和证书请求,最后发送请求-相应阶段的结束信号
3. 第三阶段
如果有证书,请求客户端发送证书,之后客户端发送密匙交换数据,也可以发送证书验证消息
4. 第四阶段 
变更密码构件和结束握手协议

完成之后就可以开始数据传输了

> ACK: 即确认字符, 在数据通信中, 接收站发给发送站的一种传输类控制字符, 表示发来的数据已经确认接收无误有两个取值：0和1，为1的时候表示应答域有效，反之为0。TCP协议规定，只有ACK=1时有效，也规定连接建立后所有发送的报文的ACK必须为1

> SYN(SYNchronization): 在建立连接时用的同步序号, 是建立连接时使用的握手信号。当 SYN=1而 ACK=0时，表明这是一个连接请求报文。对方若同意建立连接，则应在响应报文中使SYN=1和ACK=1. 因此, SYN置1就表示这是一个连接请求或连接接受报文。

> FIN(finis）即完，终结的意思， 用来释放一个连接。当 FIN = 1 时，表明此报文段的发送方的数据已经发送完毕，并要求释放连接。

[相关解释](https://baike.baidu.com/item/ACK/3692629?fr=aladdin)

## 发送 http 请求, 服务器处理请求, 返回响应结果

TCP 连接建立后, http / https 就可以发送请求, 服务器接受到请求, 就解析请求头, 如果头部有缓存信息如: `If-None-Match` 或者 `If-Modified-Since` 就会判断缓存是否有效, 有效就返回304, 无效就重新返回资源 200

浏览器缓存，也称Http缓存，分为强缓存和协商缓存。优先级较高的是强缓存，在命中强缓存失败的情况下，才会走协商缓存。