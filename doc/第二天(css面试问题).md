# 1. 介绍一下标准的css的盒子模型?与低版本IE的盒子模型有什么不同的?

标准盒子模型:宽度 = 内容的宽度(content) + padding + margin + border
低版本IE盒子模型: 宽度 = 内容的宽度(content + padding + border) + margin

# 2. box-sizing属性?

用来控制元素的盒子模型的解析模式,默认content-box
+ content-box: W3C的标准盒子模型,设置元素height/width属性指的是content部分的高/宽
+ border-box:IE传统盒子模型。设置元素的height/width属性值得是border + padding + (content部分的宽/高)

# 3. css选择器有哪些?那些属性可以继承?

css选择符: id选择器、类选择器、标签选择器、相邻选择器、子选择器、后代选择器、通配符选择器、属性选择器、伪类选择器
可继承的属性 ： `font-size`,`font-family`,`color`
不可继承的样式: `border,padding,margin,width,height`
优先级: `!important>id>class>tag`(就近原则)

# 4. css优先级算法如何计算?

元素选择符:1
class选择符:10
id选择符:100
内联:1000

> 1. `!important` 声明的样式优先级最高,如果冲突在进行计算
> 2. 如果优先级相同,最后出现的样式优先级最高
> 3. 继承得到的样式优先级最低 比如: `font-size`

# 5. css新增伪类有哪些

> 下面同时必有条件皆为同类型元素

p:first-of-type 选择属于其父元素的首个元素

p:last-of-type 选择属于其父元素的最后元素

p:only-of-type 选择属于其父元素唯一的元素

p:only-child  选择属于其父元素的唯一一个子元素

p:nth-child(2) 选择属于其父元素的第二个子元素

:enabled :disabled 表单空禁用状态

:checked 单选框或复选框被选中

# 6. 如何居中div? 如何绝对定位的div居中

1. div

```css
width:600px;
height:200px;
margin:0 auto
```
2. 绝对定位

+ margin + left

```css
position:absolute;
left:0;
right:0;
margin:0 auto;
width:200px; // 宽度必须一定
```
+ transform + left
```css
position:absolute;
left:50%;
transform:translateX(-50%)
width:200px;
```

# 7. css有哪些新特性

1. `RGBA,opacity`
2. `background-image, background-origin(content-box/border-box/padding-box), background-size, background-repeat`
3. `word-wrap(单词换行) word-wrap:break-word`
4. 文字阴影:`text-shadow:5px 5px 5px #FF0000;`（水平阴影，垂直阴影，模糊距离，阴影颜色）
5. `font-face` 自定义字体
6. `border-radius` 圆角
7. border-image 边框图片
8. `box-shadow` 盒子阴影
9. `@media` 媒体查询

# 8. css3的felx布局,其新特性

该布局是为了提供一种更高效的方式来对容器中的条目进行布局,对齐和分配空间,传统布局中,block布局是在垂直方向上由上到下依次排列,inline布局是在水平方向上排列,flex布局没有方向限制,开发人员自由操作
使用场景:弹性布局适合于移动端前端开发,在Android和iphone上也完美支持

# 9. 用css创建一个三角形的原理是什么?

设置宽度高度为0,设置边框样式
```css
width:0;
height:0;
border-top:40px soild transparent;
border-bottom:40px soild transparent;
border-left:40px soild transparent;
border-right:40px soild #000;
```
# 10. 常见的兼容性问题

1. 不同浏览器的margin和padding不一样
```css
margin:0;
padding:0
```
2. ie6 双边距:块属性标签float后,又有横行的margin情况下,在IE6显示margin比设置的大。hack: `display:inline;` 将其转化为行内属性。

# 11. 为什么要初始化css样式

因为浏览器的兼容问题,不同浏览器对有些标签的默认值是不同的,如果没对css初始化往往会出现浏览器之间的页面显示差异

# 12. display:none与visibility:hidden 的区别

display:none 不显示对应的元素,在文档布局中不再分配空间(回流-重绘)
visibility:hidden 隐藏对应元素,在文档布局中仍然保留原来的空间(重绘)
vue中的v-if是是否渲染元素 v-show相当于display:none

# 13. 对BFC规范(块级上下文:block formatting context) 的理解

BFC规定了内部的block Box如何布局
定位方案:
1. 内置的Box会在垂直方向上一个接一个放置
2. Box垂直方向的距离由margin决定,属于同一个BFC的两个相邻Box的margin会发生重叠
3. 每个元素的margin box的左边,与包含块border box的左边相接触
4. BFC的区域不会与float box 重叠
5. BFC是页面上的一个独立容器,容器内部的元素不会影响到外部的元素
6. 计算BFC的高度是,浮动元素也会参与计算
触发BFC条件
1. 根元素即html 本身就是BFC
2. float的值不为none(默认)
3. overflow的值不为visible(默认)
4. display的值为inline-block,table-cell,table-caption
5. position的值为absolute和fixed

+ Box垂直方向的距离由margin决定,属于同一个BFC的两个相邻Box的margin会发生重叠

![image.png](https://i.loli.net/2021/09/01/UuVz4lLxr16SQf9.png)

![image.png](https://i.loli.net/2021/09/01/1aHxWGIuhRb85VQ.png)

# 14. 设置元素浮动后,该元素的display值是多少?

自动被设置为 display:block

# 15. 移动端用过媒体查询吗?

通过媒体查询可以为不同大小和尺寸的媒体定义不同的css,适应相应的设备的显示

```html
<head>
  <link href='xxx.css' media='only screen and(max-device-width:480px)'/>
</head>
```

```css
@media only screen and(max-device-width:480px){

}
```

# 16. css优化,提高性能的方法有哪些

1. 避免过渡约束
2. 避免后代选择器
3. 避免链式选择符
4. 使用紧凑的语法
5. 避免不必要的命名空间
6. 避免不必要的重复
7. 最好使用语义化的名字。一个好的类名应该是他是什么而不是像什么
8. 避免使用!important,可以选择其他选择器
9. 尽可能地精简规则,你可以和合并同类里面的重复规则

# 17. 浏览器是怎么样解析css选择器的

css选择器是从右向左解析的。若从左向右的匹配,发现不符合规则,需要进行回溯,会损失很多性能。若从右向左匹配,先找到所有的最右节点,对于每一个节点,向上寻找其父节点直到找到根元素或满足条件的匹配规则,则结束这个分支的遍历。两种匹配规则的性能差别很大，是因为从右向左的匹配在第一部就筛选掉了大量的不符合条件的最右节点，而从左向右的匹配规则的性能的都浪费在了失败的查找上面。
而在css解析完毕后,需要将解析的结果与DOM Tree 的内容一起进行分析建立一刻Render Tree,最终用来进行绘图。在建立Render Tree时,浏览器就要为每个Dom Tree中的元素根据css的解析结果来确定生成怎样的Render Tree

示例:

```html
两种情况
<div>
   <--!正确--> 
    <p>
        <em></em>
    </p>
       <--!---错误->
    <p>
        这是空标签
    </p>
</div>
```

选择器 div p em

从右向左规则 首先匹配em 直接匹配到第一个含有em标签的 dom树

从左向右 如果是第二种错误的树 当查找到 p标签发现查找失败了,就要重新回到最初的div查找 => p => em 多次回溯造成效率低

# 18.  在网页中的应该会用奇数还是偶数的字体?

使用偶数字体。偶数字号相对更容易和web设计的其他部分构成比例关系.window自带的顶针宋体从Vista开始只提供12、14、16
px这三个大小的点阵,而13\15\17\px时用的是小一号的点。（即每个字站的空间大了1px,但是点阵没变),于世略显稀疏。

# 19. margin和padding分别是和什么场景的使用？

何时使用margin：

1. 需要在border外侧添加空白
2. 空白处不需要背景色
3. 上下相连的两个盒子之间的空白，需要相互抵消时。

何时使用padding

1. 需要在border内测添加空白
2. 空白处需要背景颜色
3. 上下想连的两个盒子的空白，希望为两者之和。

兼容性问题：在IE5，IE6中，float盒子指定margin，左侧的margin可能会变成两倍的宽度。通过改变padding或者指定盒子的display：inline解决

# 20. 元素竖向的百分比设定是相对于容器的高度吗？

当按照百分比设定一个元素的宽度是，它是相对于父容器的宽度计算的，但是，对于一些竖向距离的属性，例如`padding-top,padding-bottom,margin-top,margin-bottom`等,当按百分比设定他们时,依据的也是*父容器的宽度*,而不是高度。

# 21. ::before和:after 中双冒号和单冒号有什么区别?解释一下这两个伪元素的作用

1. 单冒号(:)用于css3伪类,双冒号(::)用于css3伪元素
2. ::before就是以一个字元素的存在,定义在元素主题内容之前的一个伪元素。并不存在于dom之中,只存在页面之中。
：before和：after这两个伪元素，是在css2.1里新出现的。起初，伪元素的前缀使用的是单冒号语法，随着web的进化，在css3的规范里,伪元素的语法被修改成使用双冒号,成为::before ::after

# 22. line-height 如何理解

行高是指一行文字的高度,具体说是两行文字间基线的距离。css中起高度作用的是height和line-height,没有定义height属性,最终其表现line-height
多行文本垂直居中:需要设置display:inline-block

![13674153-69927f4a414b6262.png](https://i.loli.net/2021/09/01/T12FR98cKNLeixU.png)

行高是指上下文本行的基线间的垂直距离，即图中两条红线间垂直距离。

# 23. 让页面里的字体变清晰,变细用css怎么做

>非标准: 该特性是非标准的，请尽量不要在生产环境中使用它！

`-webkit-font-smoothing` 在window系统下没有起作用,但是在IOS上起作用 `-webkit-font-smoothing:antialiased` 平滑

# 24. 手写动画,最小的时间间隔是多久

大部分显示器的频率是60hz,即一秒刷新60次,所以理论上最小间隔为1/60 * 1000ms = 16.7ms\

# 25. style 标签写在body后与body前有什么区别

页面加载是自上而下的,应该先加载样式
写在body后面,由于浏览器以逐行方式对HTML文档进行解析,当解析样式表会导致浏览器停止之前的渲染,等待加载并且解析完成样式继续渲染,可能会出现页面闪烁的问题(样式失效,FOUC)

