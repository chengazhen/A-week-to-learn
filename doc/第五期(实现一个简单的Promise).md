# 实现一个简单的 Promise (抽时间写一个符合 promise A+规范的)

```js
// 首先思考 Promise 里面的内置属性

// 状态
// 正确的状态 需要一个 最终值
// 错误的状态 需要一个错误消息
// 进行中的状态 value和错误消息都是空的

// 内置方法
// resolve 成功的调用方法
// reject 失败的调用方法
// then 把结果返回出去的方法

// 三种状态提前准备好
const PENDING = 'pending' // 进行中状态
const FULFILLED = 'fulfilled' // 操作完成状态
const REJECTED = 'rejected' // 拒绝状态
class Promise {
	// promise 内置属性 决定值 错误值 状态值
	value = ''
	error = ''
	status = PENDING
	notification = [] // 订阅结果的集合

	constructor(executable) {
		// 在这里是通过这个传递进来的函数,将内部方法传递出去
		executable(this.resolve, this.reject)
	}

	// 成功获取值
	resolve = (value) => {
		// 状态一旦确定是无法改变的
		if (this.status === PENDING) {
			this.status = FULFILLED
			this.value = value
			this.notification.forEach((item) => {
				item()
			})
		}
	}

	// 发生错误(为什么使用一个箭头函数,因为reject函数在外部调用时是单独调用不是以.reject属性方式调用,隐式绑定this就会失效,函数中的this.status就会是undefined,而剪头函数中的this是由当前上下文决定的,所以不管怎么调用,this始终是Promsie)
	reject = (error) => {
		// 状态一旦确定是无法改变的
		if (this.status === PENDING) {
			this.status = REJECTED
			this.error = error
		}
	}

	// then 方法将结果返回出去

	then(_resolve) {
		this.notification.push(() => {
			_resolve(this.value)
		})
	}
}

const p = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve(555)
	}, 10000)
})

p.then((res) => {
	console.log(res)
})
```

执行逻辑

首先 new 一个 Promise 对象, 并且把 resolve, reject 函数以参数方式传到外部, 现在 setTimeout 函数是异步,先不执行, 接下来开始执行 then 方法, 这时候 then 方法 传入一个订阅函数, 通过 then 方法的内部逻辑将订阅方法添加到订阅集合里面,2s(这里的时间不必过于纠结精确问题)过去了, 这个时候执行了 resolve 方法, 通过 resolve 内部的逻辑, 改变状态,确定成功值, 执行订阅集合里面的 onResolve 函数, 这样 value 值就被返回出来了, 本质就是回调

# 链式调用方式

```js
// 首先思考 Promise 里面的内置属性

// 状态
// 正确的状态 需要一个 最终值
// 错误的状态 需要一个错误消息
// 进行中的状态 value和错误消息都是空的

// 内置方法
// resolve 成功的调用方法
// reject 失败的调用方法
// then 把结果返回出去的方法

// 三种状态提前准备好
const PENDING = 'pending' // 进行中状态
const FULFILLED = 'fulfilled' // 操作完成状态
const REJECTED = 'rejected' // 拒绝状态
class Promise {
	// promise 内置属性 决定值 错误值 状态值
	value = ''
	error = ''
	status = PENDING
	notification = [] // 订阅结果的集合

	constructor(executable) {
		// 在这里是通过这个传递进来的函数,将内部方法传递出去
		executable(this.resolve, this.reject)
	}

	// 成功获取值
	resolve = (value) => {
		// 状态一旦确定是无法改变的
		if (this.status === PENDING) {
			this.status = FULFILLED
			this.value = value
			this.notification.forEach((item) => {
				item()
			})
		}
	}

	// 发生错误(为什么使用一个箭头函数,因为reject函数在外部调用时是单独调用不是以.reject属性方式调用,隐式绑定this就会失效,函数中的this.status就会是undefined,而剪头函数中的this是由当前上下文决定的,所以不管怎么调用,this始终是Promsie)
	reject = (error) => {
		// 状态一旦确定是无法改变的
		if (this.status === PENDING) {
			this.status = REJECTED
			this.error = error
		}
	}

	// then 方法将结果返回出去(缺点是无论什么情况都会返回一个promise)
	then(onResolve) {
		// 返回一个 Promise 的目的是为了解决链式 `.then`
		const promise2 = new Promise((resolve, reject) => {
			this.notification.push(() => {
				// 首先把第一次订阅的的结果返回出去,接下来判断结果订阅里面是否有返回值(这个时候)
				const res = onResolve(this.value)
				//  返回了一个Promsie 的实例
				if (res instanceof Promise) {
					// 这样好理解一点 promise2.resolve 充当订阅方法(onResolve)
					const _onResolve = resolve
					// 这个时候 promise2.resolve 充当订阅方法(onResolve), 当 res 的 resolve 在外部被调用的时候, 这个 promise2.resolve 方法就会被执行, 并且把 res 的当前 value 值 通过 promise2.resolve 传入 进而改变promise2 的 value, 进而通过订阅执行 onResolve 函数,
					// 就会获取到 当前 promise2 的 value 值 返回出去
					res.then(_onResolve)
				} else if (this.value) {
					// 返回值是一个非 Promise 的值
					resolve(res)
				}
			})
		})
		return promise2
	}
}

const p = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve(555)
	}, 2000)
})

p.then((res) => {
	console.log(res) // 555
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(666)
		}, 1000)
	})
}).then((res) => {
	console.log(res) // 666
})

// 缺点始终会返回一个 promise
const p = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve(555)
	}, 2000)
})

const p2 = p.then((res) => {
	console.log(p2.status)
})
```

> ![surprise](https://cdn.jsdelivr.net/gh/azhen98/A-week-to-learn@assert/image/surprise.png)

书籍:《你不知道的 JavaScript 上册》 2.2.4 章 new 绑定

关于 this 指向, 这里涉及到 new 绑定,使用 new 操作符会发生以下四步

1. 创建一个全新的对象
2. 这个新对象会被执行 [prototype] 连接
3. **这个新对象会绑定到函数的 this 上**

```js
function Person(name) {
	this.name = name
}

var p = new Person('zhang')
p.name // zhang
```

4. 如果函数没有返回其他对象, 那么 new 表达式中的函数调用会自动返回这个新对象

```js
function Person(params) {
	this.name = 'person'
	setTimeout(() => {
		console.log(this) // {name:'person'}
	}, 1000)
	return {
		name: 'return',
	}
}

const c = new Person() // {name:'return'}
```
