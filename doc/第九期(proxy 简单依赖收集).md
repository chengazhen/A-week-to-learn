## 实现一个简单的依赖触发

proxy 的功能不仅仅是这些，还有函数等等，这里主要是 get，set [proxy 文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy)

首先看下 proxy 的功能, 简单来说就是修改(访问)属性触发时候，你可以做一些操作，下面是修改(访问)属性的时候, 打印出来修改(访问)的什么属性

```js
const obj = {
	name: '张三',
	age: 123,
}

const handler = {
	set(target, key, value, receiver) {
		console.log('set==>', target, key, value)
		return Reflect.set(target, key, value, receiver)
	},
	get(target, key, receiver) {
		console.log('get==>', target, key)
		return Reflect.get(target, key, receiver)
	},
}

const proxy = new Proxy(obj, handler)

proxy.name = '李四'
```

如果操作某个属性的时候, 我需要他通知我, 也就是调用我的回调函数

```js
const subscribe = [] // 订阅集合

// 通知函数
const notified = function (key, value) {
	subscribe.forEach((item) => {
		item(key, value)
	})
}

const handler = {
	set(target, key, value, receiver) {
		notified(key, value)
		return Reflect.set(target, key, value, receiver)
	},
	get(target, key, receiver) {
		console.log('get==>', target, key)
		return Reflect.get(target, key, receiver)
	},
}

// 开始订阅
subscribe.push((key, value) => {
	console.log(`修改了${key}值是${value}`)
})

const obj = {
	name: '张三',
	age: 123,
}

const proxy = new Proxy(obj, handler)

proxy.name = '李四'

proxy.age = 324
```

我想给特定的属性添加特定的回调事件, 那么上面的逻辑就不行了, 因为需要精准到属性 => 对应回调

依赖集合 我们的依赖关系是 Dep(全局依赖集合) => objDep(对象依赖) => keyDep(属性依赖), 为什么使用 Map 对象, 因为 Map 对象保存键值对, 其 key 值可以是任何类型的值

```js
// 依赖收集副作用是用的全局变量
let currentEffect = ''

// 全局依赖集合
const Dep = new Map()

// 我们在访问对象或者属性的时候收集依赖
const handler = {
	set(target, key, value, receiver) {
		const keyDep = getDep(target, key)
		keyDep()

		return Reflect.set(target, key, value, receiver)
	},
	get(target, key, receiver) {
		getDep(target, key)
		return Reflect.get(target, key, receiver)
	},
}

// 查找依赖
function getDep(target, key) {
	let objDep = Dep.get(target)
	// 首先在全局 Dep 里面查找到当前对象的对应的依赖关系
	if (!objDep) {
		objDep = new Map()
		Dep.set(target, objDep)
	}

	// 在对象 Dep 里面查找属性对应的副作用, 如果没有就要吧副作用放进依赖集合
	let keyDep = objDep.get(key)
	if (!keyDep) {
		keyDep = currentEffect
		objDep.set(key, keyDep)
	}
	return keyDep
}

const obj = {
	name: '张三',
	age: 123,
}

currentEffect = function () {
	console.log('我是 name 触发的函数')
}

const proxy = new Proxy(obj, handler)

proxy.name = 3242
```

走到这里距离实现精准到属性回调还有点路程, 继续路程吧

首先看下 vue 的 watchEffect(() => console.log(count.value))

立即执行传入的一个函数，同时响应式追踪其依赖，并在其依赖变更时重新运行该函数。

```js
// 依赖收集副作用是用的全局变量
let currentEffect = ''

const Dep = new Map()
// 我们在访问对象或者属性的时候收集依赖

const handler = {
	set(target, key, value, receiver) {
		const keyDep = getDep(target, key)
		const res = Reflect.set(target, key, value, receiver)
		// 放在 Reflect.set 下面是因为调用副作用的时候需要将最新值返回出去
		keyDep()
		return res
	},
	get(target, key, receiver) {
		getDep(target, key)
		return Reflect.get(target, key, receiver)
	},
}

// 查找依赖
function getDep(target, key) {
	let objDep = Dep.get(target)
	// 首先在全局 Dep 里面查找到当前对象的对应的依赖关系
	if (!objDep) {
		objDep = new Map()
		Dep.set(target, objDep)
	}

	// 在对象 Dep 里面查找属性对应的副作用, 如果没有就要吧副作用放进依赖集合
	let keyDep = objDep.get(key)
	if (!keyDep) {
		keyDep = currentEffect
		objDep.set(key, keyDep)
	}
	return keyDep
}

const obj = {
	name: '张三',
	age: 123,
}

const proxy = new Proxy(obj, handler)

// 首先看下 vue 的 watchEffect(() => console.log(count.value))
// 立即执行传入的一个函数，同时响应式追踪其依赖，并在其依赖变更时重新运行该函数。

function watchEffect(callBack) {
	currentEffect = callBack
	// 直接执行, 是因为需要把依赖收集进去
	callBack()
	currentEffect = ''
}

watchEffect(() => {
	console.log('name触发', proxy.name)
})

watchEffect(() => {
	console.log('age触发', proxy.age)
})

proxy.name = '李四'

proxy.age = 4545
```

遗留问题: 如果属性是对象的话, 依赖收集就会失败, 因为没有做属性判断, 属性为 object 或者基本类型

## 补充深度数据代理

proxy 代理的只是最外层的对象，如果属性也是一个对象那么修改或者访问子属性的属性时是无法监听到的

像这种数据, proxy 代理之后去访问 sub_name 是无法监听到的

```js
const obj = {
	name: '张三',
	age: 123,
	sub: {
		sub_name: 'sub',
	},
}
```

深度监听的实现，网上实现方法很多，这里用了自己感觉很不错的一种，也是之前看过的知乎上一篇文章写的，今日刚好用上，只不过找不到当初文章所在有些遗憾

```js
// 数据深度劫持
const handler = {
	set(target, key, value, receiver) {
		console.log('set==>', target, key, value)
		return Reflect.set(target, key, value, receiver)
	},
	get(target, key, receiver) {
		// 可以从一开始就直接递归遍历属性是否为 Object 直接生成代理数据, 这里这样做的好处就是当你访问的时候才会代理需要代理的对象，看过一篇文章就说过 vue 里面也是这样代理对象的, 没有采用直接递归
		if (typeof target[key] === 'object') {
			target[key] = reactive(target[key])
		}
		return Reflect.get(target, key, receiver)
	},
}

function reactive(obj) {
	return new Proxy(obj, handler)
}

// 原始数据
const obj = {
	name: '张三',
	age: 123,
	sub: {
		sub_name: 'sub',
	},
}

// 代理数据
const proxy = new Proxy(obj, handler)

proxy.sub.sub_name = '李四'

proxy.name = 32424
```
