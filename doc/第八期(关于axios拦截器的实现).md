## 首先思考 axios 的基本功能
> 我们首先要弄清 axios 拦截器它实现的功能, 不能直接上手实现, 如果连它的功能都没有摸透, 那么我们就没办法掌握它, 更不要说自己实现了(这里主要是实现请求拦截器)

值得注意的是拦截器可以多次对 config 进行处理,处理的顺序是从右向左, 也就是说从第一个拦截器开始执行,第一个拦截器就是第一个 use 的拦截器, 每一个拦截器接收的参数, 都是上一个拦截器处理过的数据

这里的拦截被放在一个集合里面, 如果按照顺序来执行拦截器, 自然就需要从右边开始

![20210915170705](https://cdn.jsdelivr.net/gh/azhen98/A-week-to-learn@assert/image/20210915170705.png)

一起来看下 axios 自身拦截器的多次拦截功能

下面的代码中一共拦截了两次请求, 每次都添加了一个 `tip`, 用来证明第二次接收的 `config` 是第一次修改过的配置, 在响应拦截器中可以看到, config 里面确实含有两次处理的结果

```html
<script src="https://cdn.jsdelivr.net/npm/axios@0.21.4/dist/axios.min.js"></script>
<script>
	// 第一次添加请求拦截器
	axios.interceptors.request.use(
		function (config) {
			return {
				...config,
				tip: '这是第一次拦截处理',
			}
		},
		function (error) {
			// 对请求错误做些什么
			return Promise.reject(error)
		}
	)

	//第二次添加请求拦截器
	axios.interceptors.request.use(
		function (config) {
			return {
				...config,
				tip2: '这是第二次拦截处理',
			}
		},
		function (error) {
			// 对请求错误做些什么
			return Promise.reject(error)
		}
	)

	// 响应拦截器 用来查看 被请求拦截器修改的 config
	axios.interceptors.response.use(
		function (response) {
			console.log(response.config) // {	tip: '这是第一次拦截处理',tip2: '这是第二次拦截处理',....}
			// 对响应数据做点什么
			return response
		},
		function (error) {
			// 对响应错误做点什么
			return Promise.reject(error)
		}
	)
	axios.get('xxxxx.com')
</script>
```

走到这里感觉有点像 compose 函数, compose 函数,通俗点说就是将一个函数的返回值作为另外一个函数的参数, 最终获取被多个逻辑处理过的结果

在这里是从右往左执行

```js
function compose(...fns) {
	return (initValue) => fns.reduceRight((currentValue, fn) => fn(currentValue), initValue)
}

function test(config) {
	console.log(config) // {config: 'init', tip: '第一次'}
	return {
		...config,
		tip: '第一次',
	}
}
function test2(config) {
	console.log(config) // {config: 'init'}
	return {
		...config,
		tip2: '第二次',
	}
}

compose(test, test2)({ config: 'init' }) // {config: 'init', tip: '第一次', tip2: '第二次'}
```

可以发现,compose 是一次行将所有逻辑录入, 而拦截器是 可以多次 use 调用传入拦截逻辑, 所以这里不适用 compose

核心就是利用 `promise.then` 方法会返回一个 `promise` 对象

```js
const axios = { requestList: [], responseList: [] }
axios.intercept = Object.create(axios) // 这里将拦截属性的 prototype 关联到 axios, 方便将拦截逻辑直接存入 requestList
axios.intercept.request = function (resolve, reject) {
	this.requestList.push({ resolve, reject })
}
axios.intercept.request(
	(config) => {
		return {
			...config,
			tip: '第一次',
		}
	},
	// 对错误做点什么
	(error) => {
		console.log(error)
	}
)
axios.intercept.request(
	(config) => {
		return {
			...config,
			tip2: '第二次',
		}
	},
	// 对错误做点什么
	(error) => {
		console.log(error)
	}
)

axios.run = function (config) {
	// 请求拦截器逻辑
	const promise = Promise.resolve(config) // 把 config 包装成一个拥有确定值的 promise 对象
	config = this.requestList.reduceRight((currnetPromise, item) => {
		const { resolve, reject } = item
		// promise then 方法默认会返回一个 promise 对象, 如果 then 方法返回了一个值, 那么这个 promise 就是一个 有确定值的 promise 对象
		return currnetPromise.then((config) => {
			return resolve(config)
		})
	}, promise)
	return config
}

axios.run({
	url: 'xxx.com',
})
```

`currnetPromise.then((res) => { return resolve(res) })` 这里究竟做了什么

在 promise then 方法中, 第一个函数接收正确值,第二个是接受错误, 所以当 then 方法的回调函数被执行的时候, promise 的值可以自动当做参数被传入回调函数中,我们可以基于这个参数的基础上进行修改, 然后返回一个修改过的值, 拥有返回值的 then 方法 就会返回一个拥有确定值的 promise 对象(此处有点绕, 建议先自己写一个简单的 promise, 这样逻辑就了然于心了)

```js
axios.intercept.request(
	(config) => {
		return {
			...config,
			tip: '第一次',
		}
	},
	// 对错误做点什么
	(error) => {
		console.log(error)
	}
)

// 这里其实就是把这个拦截 当做 promise then 方法的响应回调了
promise.then((config) => {
	return function (config) {
		return {
			...config,
			tip: '第一次',
		}
	}
})
```

[MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/then)

[手写一个 promise](<https://github.com/azhen98/A-week-to-learn/blob/master/doc/%E7%AC%AC%E4%BA%94%E6%9C%9F(%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E7%AE%80%E5%8D%95%E7%9A%84Promise).md>)

[掘金大佬](https://juejin.cn/post/6844904039608500237#heading-3)
