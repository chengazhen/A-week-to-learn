# 实现一个简单的 Promise (抽时间在写一个符合promise A+规范的)

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
				item(value)
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
		this.notification.push(_resolve)
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