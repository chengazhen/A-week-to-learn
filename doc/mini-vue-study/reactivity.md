模块文件夹分布

```javascript
D: baseHandlers.ts
computed.ts
dep.ts
effect.ts
index.ts
reactive.ts
ref.ts
```

## reactive

依赖的其他函数

```javascript
import {
  mutableHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers
} from './baseHandlers'
```

**mutableHandlers:** 代理的 `get`, `set` 方法, 把这些逻辑提出去做了一层封装

**readonlyHandlers:** 对象只读处理

**shallowReadonlyHandlers:** 浅层次只读处理; 例如一个嵌套对象, 只读对 `nestObj.num` 生效, 对 `obj.num` 不生效

```javascript
const nestObj = {
  obj: {
    num: 0
  },
  num: 0
}
```

### 主要的方法

```javascript
// 生成一个响应对象
export function reactive(target) {
  return createReactiveObject(target, reactiveMap, mutableHandlers)
}

function createReactiveObject(target, proxyMap, baseHandlers) {
  // 核心就是 proxy
  // 目的是可以侦听到用户 get 或者 set 的动作

  // 如果命中的话就直接返回就好了
  // 使用缓存做的优化点
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }

  const proxy = new Proxy(target, baseHandlers)

  // 把创建好的 proxy 给存起来，
  proxyMap.set(target, proxy)
  return proxy
}
```

可以看出代码里面 reactive 本质就是`createReactiveObject`, 里面传了三个参数; 介绍

> `target` 这是需要代理的对象, `reactiveMap` 是用来储存生成的代理对象的集合,本质缓存优化, `mutableHandlers` 这个是代理对象的 `get`, `set` 方法

举个栗子 这个 `mutableHandlers` 相当于下面的 `handler`, 不过这里的处理比较简单

```javascript
const obj = {
  name: 'zhangsan'
}
const handler = {
  get(target, key, receiver) {
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    return Reflect.set(target, key, value, receiver)
  }
}
const p = new Proxy(obj, handler)
```

### 其他的方法

这里的方法本质上都是基于 `createReactiveObject` 传入不同的 handler 来达到目的

```javascript
// 生成只读对象
export function readonly(target) {
  return createReactiveObject(target, readonlyMap, readonlyHandlers)
}

// 生成浅层只读对象
export function shallowReadonly(target) {
  return createReactiveObject(
    target,
    shallowReadonlyMap,
    shallowReadonlyHandlers
  )
}
```

## baseHandlers

> 这里面主要是一些 get set 方法的处理

### 生成一个正常的 get

```javascript
function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key, receiver) {
    const isExistInReactiveMap = () =>
      key === ReactiveFlags.RAW && receiver === reactiveMap.get(target)

    const isExistInReadonlyMap = () =>
      key === ReactiveFlags.RAW && receiver === readonlyMap.get(target)

    const isExistInShallowReadonlyMap = () =>
      key === ReactiveFlags.RAW && receiver === shallowReadonlyMap.get(target)

    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    } else if (
      isExistInReactiveMap() ||
      isExistInReadonlyMap() ||
      isExistInShallowReadonlyMap()
    ) {
      return target
    }

    const res = Reflect.get(target, key, receiver)

    // 问题：为什么是 readonly 的时候不做依赖收集呢
    // readonly 的话，是不可以被 set 的， 那不可以被 set 就意味着不会触发 trigger
    // 所有就没有收集依赖的必要了

    if (!isReadonly) {
      // 在触发 get 的时候进行依赖收集
      track(target, 'get', key)
    }

    if (shallow) {
      return res
    }

    if (isObject(res)) {
      // 把内部所有的是 object 的值都用 reactive 包裹，变成响应式对象
      // 如果说这个 res 值是一个对象的话，那么我们需要把获取到的 res 也转换成 reactive
      // res 等于 target[key]
      return isReadonly ? readonly(res) : reactive(res)
    }

    return res
  }
}
```

**代码中关键字的意思**
`createGetter` 传了两个参数, `isReadonly` 代表只读, `shallow` 代表浅层只读; 接下来就是三个集合: `isExistInReactiveMap` 是否已经在响应对象集合中存在, `isExistInReadonlyMap` 是否在只读对象集合中存在, `isExistInShallowReadonlyMap` 是否在浅层只读集合中存在

代码中提到如果 res 是一个对象, 就要递归调用 reactive 方法, 以此来达到将内部属性为对象性质的都转换为响应式对象, 这里的转换是在访问属性的时候进行的, 而不是一开始就递归将所有内部属性, 这一点很妙

**代码里面有一段判断 key === ReactiveFlags.RAW && receiver === reactiveMap.get(target) 意思就像 `raw` 的中文意思一样, 未经过处理的数据, 这里的功能是为 `toRaw` 做处理的, 如果需要原始数据, 就直接把当前的 target 返回出去**

```javascript
export function toRaw(value) {
  // 如果 value 是proxy 的话 ,那么直接返回就可以了
  // 因为会触发 createGetter 内的逻辑
  // 如果 value 是普通对象的话，
  // 我们就应该返回普通对象
  // 只要不是 proxy ，只要是得到的 undefined 的话，那么就一定是普通对象
  // TODO 这里和源码里面实现的不一样，不确定后面会不会有问题
  if (!value[ReactiveFlags.RAW]) {
    return value
  }

  return value[ReactiveFlags.RAW] // 在这里直接访问了 ReactiveFlags.RAW 此属性, 从而被代理拦截直接把target return 出去
}
```
流程

![20220106105953](https://cdn.jsdelivr.net/gh/azhen98/A-week-to-learn@assert/image/20220106105953.png)