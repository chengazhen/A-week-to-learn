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
3. overflow的值部位visible(默认)
4. display的值为inline-block,table-cell,table-caption
5. position的值为absolute和fixed

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
