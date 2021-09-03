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

