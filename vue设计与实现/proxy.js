// (() => {
//   const bucket = new WeakMap() // 存储依赖, 弱引用的map, 依赖被回收时, map中的key也会被回收

//   const data = { text: 'hello word' }

//   let activeEffect = null
//   function effect(fn) {
//     activeEffect = fn
//     fn()
//     activeEffect = null
//   }

//   const obj = new Proxy(data, {
//     get(target, key, receiver) {
//       if (activeEffect) {

//         // 数据结构如此
//         // target2
//         // 05     └── text2
//         // 06         └── effectFn2
//         let depsMap = bucket.get(target)
//         if (!depsMap) {
//           bucket.set(target, (depsMap = new Map()))
//         }

//         let deps = depsMap.get(key)
//         if (!deps) {
//           depsMap.set(key, (deps = new Set()))
//         }

//         deps.add(activeEffect)
//       }
//       return Reflect.get(target, key, receiver)
//     },
//     set(target, key, value, receiver) {
//       // 先赋值
//       Reflect.set(target, key, value, receiver)

//       // 再获取绑定的副作用函数
//       const depsMap = bucket.get(target)
//       if (depsMap) {
//         const deps = depsMap.get(key)
//         deps?.forEach(effect => {
//           effect()
//         });
//       }
//     }
//   })




//   // 一个属性绑定多个副作用函数
//   effect(() => {
//     console.log(obj.text)
//   })

//   effect(() => {
//     console.log(obj.text, '32323223')
//   })


//   setTimeout(() => {
//     obj.text = 33333
//   }, 1000);


// })();
//  ----------------------------------------------------如果副作用函数内部有一个三元表达式那么两个属性会同时绑定--------------------------------------------------------


// (() => {
//   const bucket = new WeakMap() // 存储依赖, 弱引用的map, 依赖被回收时, map中的key也会被回收
//   const data = { text: 'hello word', ok: true }

//   let activeEffect = null
//   function effect(fn) {
//     const effectFn = () => {
//       cleanUp(effectFn)
//       activeEffect = effectFn
//       fn()
//     }
//     effectFn.deps = []
//     effectFn()
//   }

//   function cleanUp(effectFn) {
//     for (let index = 0; index < effectFn.deps.length; index++) {
//       const deps = effectFn.deps[index];
//       deps.delete(effectFn)
//     }

//     effectFn.deps.length = 0
//   }

//   const obj = new Proxy(data, {
//     get(target, key, receiver) {
//       if (activeEffect) {

//         // 数据结构如此
//         // target2
//         // 05     └── text2
//         // 06         └── effectFn2
//         let depsMap = bucket.get(target)
//         if (!depsMap) {
//           bucket.set(target, (depsMap = new Map()))
//         }

//         let deps = depsMap.get(key)
//         if (!deps) {
//           depsMap.set(key, (deps = new Set()))
//         }

//         deps.add(activeEffect)
//         activeEffect.deps.push(deps)

//       }
//       return Reflect.get(target, key, receiver)
//     },
//     set(target, key, value, receiver) {
//       // 先赋值
//       Reflect.set(target, key, value, receiver)

//       // 再获取绑定的副作用函数
//       const depsMap = bucket.get(target)
//       if (depsMap) {
//         const effects = depsMap.get(key)
//         // deps?.forEach(effectf => {
//         //   effectf()
//         // });
//         const effectsToRun = new Set(effects)
//         effectsToRun?.forEach(effect => {
//           effect()
//         });
//       }
//     }
//   })




//   // 这样会导致 ok 和 text 属性都会和 effect 绑定, 但是按理说 只有 obj.ok 的值改变 text 的值才会做出改变
//   effect(() => {
//     let str = obj.ok ? obj.text : ''
//     console.log(str)
//   })


//   obj.text = 'hello word2'


//   setTimeout(() => {
//     obj.ok = false
//   }, 1000);



//   setTimeout(() => {
//     obj.text = 33333
//   }, 1000);

//   // 这里作者其实是为了解决当 obj.ok 为false, obj.text 再怎么修改也不应该触发副作用函数, 因为 obj.ok 是开关; 所以为了解决这个问题, 每一次修改 obj.ok 的值之后都要重新收集一次依赖;
//   // 例如: obj.ok 等于 true的时候 需要收集的依赖就是 text 和 ok 都要绑定 effect; 如果 obj.ok 等于 false 的时候, 这时候需要收集的依赖就只有 ok 了;
//   // 根据 obj.ok 来判断是否 text 需不需要绑定副作用函数

//   // setTimeout(() => {
//   //   obj.ok = false
//   // }, 1000);
// })();


// --------------------------------------------------------------------------解决effect嵌套使用的问题-----------------------------------------------------------------------------------------

(() => {
  const bucket = new WeakMap() // 存储依赖, 弱引用的map, 依赖被回收时, map中的key也会被回收
  const data = { text: 'hello word', ok: true }
  const effectStack = []
  let activeEffect = null
  function effect(fn) {
    const effectFn = () => {
      cleanUp(effectFn)
      activeEffect = effectFn
      effectStack.push(effectFn)
      console.log('fn===>');
      fn()
      console.log('fn===>, 此处是无法执行到的, 因为 obj.text = obj.text + 1 会一直导致 fn 函数的执行, 设置值的时候会执行 Effect, 当走到 fn 的时候又会执行 obj.text = obj.text + 1, 又会触发Effect执行, 所以代码逻辑只能走到 fn 这里, 就会进入一个死循环的调用栈, Effect(Effect(Effect())) , 副作用函数会一直调用副作用函数');
      // 在这里, fn 的执行, 触发了 get 拦截器的执行, get 拦截器内部的逻辑开始执行, deps.add(activeEffect), 副作用函数被收集到依赖中
      // 此处逻辑关联性较强, fn 的执行导致调用栈(此处的调用栈是浏览器的调用栈)又指向了 get 拦截器, 执行完毕之后又开始执行下面的代码
      console.log(fn.name, 'name===>'); // 此处是为了证明代码执行顺序
      // 副作用函数被收集后, 就要从栈中弹出, 重新将 activeEffect 指向栈顶的函数
      effectStack.pop()
      activeEffect = effectStack[effectStack.length - 1]
    }
    effectFn.deps = []
    effectFn()
  }

  function cleanUp(effectFn) {
    for (let index = 0; index < effectFn.deps.length; index++) {
      const deps = effectFn.deps[index];
      deps.delete(effectFn)
    }

    effectFn.deps.length = 0
  }

  const obj = new Proxy(data, {
    get(target, key, receiver) {
      if (activeEffect) {

        // 数据结构如此
        // target2
        // 05     └── text2
        // 06         └── effectFn2
        let depsMap = bucket.get(target)
        if (!depsMap) {
          bucket.set(target, (depsMap = new Map()))
        }

        let deps = depsMap.get(key)
        if (!deps) {
          depsMap.set(key, (deps = new Set()))
        }
        console.log('get');
        deps.add(activeEffect)
        activeEffect.deps.push(deps)

      }
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      // 先赋值
      Reflect.set(target, key, value, receiver)

      // 再获取绑定的副作用函数
      const depsMap = bucket.get(target)
      if (depsMap) {
        const effects = depsMap.get(key)
        // deps?.forEach(effectf => {
        //   effectf()
        // });
        const effectsToRun = new Set(effects)

        effectsToRun?.forEach(effect => {
          effect()
        });
      }
    }
  })




  // 这样会导致 ok 和 text 属性都会和 effect 绑定, 但是按理说 只有 obj.ok 的值改变 text 的值才会做出改变
  // effect(function effect1() {
  //   console.log('effect');
  //   effect(function effect2() {
  //     console.log('effect2');
  //     obj.text
  //   })
  //   obj.ok
  // })

  // 修改 obj.ok 的时候, 就会输出
  // effect, effect2, 因为 effect2 在 effect1 里面所以会执行一次
  // obj.ok = true

effect(() => {
  obj.text = obj.text + '1'
})



})()
