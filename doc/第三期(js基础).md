# 1. js 的数据类型

1. 6 种原始数据

- number
- string
- Boolean
- undefined
- Symbol
- BigInt

---

- Object
- Function
- null

[文档](https://developer.mozilla.org/ru/docs/Web/JavaScript/Data_structures)

# 2. Map 和 Set 的区别

Map 以键值的形式存在，并且能够记住键的原始插入顺序。任何值(对象或者原始值) 都可以作为一个键或一个值。

`Set` 以集合的形式存在,Set 中的元素只会出现一次,可以用来数组去重

```JavaScript
	const arr = [1, 2, 3, 4, 5]
	const arr2 = [1, 2, 3, 4, 5, 6]
	const res = Array.from(new Set([...arr, ...arr2]))
  //[1, 2, 3, 4, 5, 6]
```

# 3. WeakMap 和 Map 之间的区别

WeakMap 只能用复杂类型的数据作为 key, 并且 key 是弱引用的,对于垃圾回收机制更加友好

Map 可以被遍历, WeakMap 不能被遍历, Map 的 key 可以使任何值

WeakMap 的垃圾回收机制(创建一个文件 粘贴下面的代码) 执行命令 `node --expose-gc demo.js`

--expose-gc 参数表示允许手动执行垃圾回收机制, 如果不使用这个参数执行,下面的对比是不可行的

- Map(对比)

```JavaScript
//map.js
global.gc(); // 0 每次查询内存都先执行gc()再memoryUsage()，是为了确保垃圾回收，保证获取的内存使用状态准确

function usedSize() {
    const used = process.memoryUsage().heapUsed;
    return Math.round((used / 1024 / 1024) * 100) / 100 + "M";
}

console.log(usedSize()); // 1 初始状态，执行gc()和memoryUsage()以后，heapUsed 值为 1.64M

var map = new Map();
var b = new Array(5 * 1024 * 1024);

map.set(b, 1);

global.gc();
console.log(usedSize()); // 2 在 Map 中加入元素b，为一个 5*1024*1024 的数组后，heapUsed为41.82M左右

b = null;
global.gc();

console.log(usedSize()); // 3 将b置为空以后，heapUsed 仍为41.82M，说明Map中的那个长度为5*1024*1024的数组依然存在
```

- WeakMap(对比)

```javascript
// weakmap.js
function usedSize() {
	const used = process.memoryUsage().heapUsed
	return Math.round((used / 1024 / 1024) * 100) / 100 + 'M'
}

global.gc() // 0 每次查询内存都先执行gc()再memoryUsage()，是为了确保垃圾回收，保证获取的内存使用状态准确
console.log(usedSize()) // 1 初始状态，执行gc()和 memoryUsage()以后，heapUsed 值为 1.64M
var map = new WeakMap()
var b = new Array(5 * 1024 * 1024)

map.set(b, 1)

global.gc()
console.log(usedSize()) // 2 在 Map 中加入元素b，为一个 5*1024*1024 的数组后，heapUsed为41.82M左右

b = null
global.gc()

console.log(usedSize()) // 3 将b置为空以后，heapUsed 变成了1.82M左右，说明WeakMap中的那个长度为5*1024*1024的数组被销毁了
```

# 4. 原型链

实例对象的原型(`__proto__`)指向构造函数的原型(prototype)

构造函数的原型的 constructor 指向它本身

```js
function Person() {}
const person = new Person()

person.__proto__ === Person.prototype //true

Person.prototype.constructor === Person //true
```

[详细文档](https://github.com/mqyqingfeng/Blog/issues/2)

# 5. this

this 指向调用者

改变 this 指向的几个方法:call, apply, bind

箭头函数中没有 this,箭头函数捕捉其所在上下文的 this,作为自己的 this 值,在全局上下文中向上查
找的过程中一旦找到 this,就会停止直接为自己所用,就近;查找 this 是在声明时的位置,不是调用位置

call, apply, bind 也无法改变箭头函数的 this 指向,this 不遵守隐式绑定规则

```
var a = 1;
var obj = {
  a: 2
};
function fun() {
    var a = 3;
    let f = () => console.log(this.a);
      f();
};
fun();//1
fun.call(obj);//2
```

结果是 1 的情况

- this.a 查找规则: this.a(此时的 this 就是 fun 函数中的 this) => fun 函数中的 this(此时的 this 指向 window) => a 声明为全局变量,自动挂载到全局 window 对象上=> 最终 this.a 就是 window.a

- 严格模式下 fun 中的 this 就是 undefined 所以 this.a 就是 undefined

结果是 2 的情况

- fun 使用 call 方法将其的 this 指向改为了 obj

- this.a (此时的 this 就是 fun 函数中的 this) => fun 函数中的 this(此时的 this 指向 obj) => this.a 就是 obj.a

# 6. 浅拷贝和深拷贝

1. 浅拷贝: 一般指的是把对象的第一层拷贝到一个新对象上去，比如

- `Object.assign()`

- 扩展运算符

```javascript
const obj = { name: 234324, say() {} }

const obj2= {...obj,age:'234324'} 
obj2.name=111
obj.name // 1111
```

2. 深拷贝:

- 递归实现 需要判断各种情况

- `JSON.stringify`;如果对象属性有函数,则会丢失这个函数属性

```javascript
const obj = { name: 234324, say() {} }

JSON.parse(JSON.stringify(obj)) // {name: 234324}
```
3. 拓展

关于函数的参数为对象时,传参的形式就是浅复制,是引用地址的拷贝,两者还是指向同一个引用地址(基本类型数据是直接拷贝值)

+ 基本类型值是存储在栈中的简单数据段，也就是说，他们的值直接存储在变量访问的位置。堆是存放数据的基于散列算法的数据结构，在javascript中，引用值是存放在堆中的。

![image.png](https://i.loli.net/2021/09/02/lCquGexZNQhFMf6.png)

+ 修改属性的值还是会通过当前引用地址找到属性值

![image.png](https://i.loli.net/2021/09/02/GytP7TbAFqNYoHe.png)

+ 直接操作对象本身，也就是最外层，会和之前的对象断开连接

![image.png](https://i.loli.net/2021/09/02/KsUDbkHaNRxdivF.png)

```JavaScript
const obj={name:111}

function func(argu){
  argu.name=222
}

func(obj)

obj.name // 222

// 第二种
function func1(argu){
  argu={name:6666}
}

obj.name //111

```

# 事件冒泡和事件捕获

事件冒泡:事件冒泡就是水里面的水泡从最底层一直像水面冒出,放在html这个大水池里面就是 

p=>parent=>parent=> => html => document

事件捕获与事件冒泡相反,从外往内,事件具体到某个触发的元素

document -> html -> body -> div -> p

+ 阻止事件冒泡

event.stopPropagation

阻止捕获和冒泡阶段中当前事件的进一步传播。

但是，它不能防止任何默认行为的发生； 例如，对链接的点击仍会被处理。

拓展

+ 阻止事件触发后默认动作的发生

```JavaScript
document.addEventListener(
    'touchstart',
    (event) => {
      //  cancelable 表明该事件是否可以被取消 ,比如滚动行为正在进行是无法阻止的,像阻止双指放大的脚本里面就可以用到
      if (event.cancelable) {
          event.preventDefault()
      }
    },
    { passive: false }
  )
```
现在的浏览器为了性能 将`target.addEventListener(type, listener, options);`passive设置为true, 某些浏览器（特别是Chrome和Firefox）已将文档级节点 Window，Document和Document.body的touchstart (en-US)和touchmove (en-US)事件的passive选项的默认值更改为true。这可以防止调用事件监听器，因此在用户滚动时无法阻止页面呈现,所以需要将passive设置为false 才能阻止这些特定的dom元素的默认行为

[参考文档,stopPropagation](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/stopPropagation)

[参考文档,preventDefault](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/preventDefault)