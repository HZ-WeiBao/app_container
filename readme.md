# 小小的框架~

start: 2017/2/6<br>
end  : 2017/4/18

> nginx配置:nginx.conf<br>
> 配置: config.sample.php

[制作记录](http://www.jianshu.com/p/3bf037440cc0)

### 主要特性

#### 前端部分(主文件在./frame/views/Frame.js
> 0. 支持返回键
> 1. 有一个全局的事件组件, 支持的事件有:slide, doubleclick, pressStart, pressEnd, press, focus, blur, over, enter, leave, 弥补了原生事件, 事件的拓展支持, 比如popupclick, browserclick, 对click的定制, 增加了一些特殊判断和行为, 好处在于dsl~
> 2. 集成[Emmet模版引擎](https://github.com/deepkolos/emmet-template-engine), 拥有了强大的数据导入能力
> 3. 支持3个hash类型, action对应页面切换, viewStatus对应页面状态返回键支持, viewPopup对应popup类型的返回键支持
> 4. 这些返回键支持都支持过渡动画~
> 5. 子页面都是按需加载,支持声明依赖,还有加载动画,第一段动画结束还没加载完的话,就会显示

### 后端部分

> 0. 简单的orm的支持
> 1. 遵从MVC的结构
> 2. 支持插件
> 3. 万能this向~ (魔术方法滥用,逃~
> 4. component内支持所有方法的hook~
> 5. 内置个小型的爬虫框架~
> 6. 调优的记录在test文件夹里

### 效果演示

#### [微报应用框架](http://weibao.deepkolos.cn)<br>
<div>
  <img src="https://raw.githubusercontent.com/deepkolos/app_container/master/assets/list.jpg" width = "250" alt="" style="display:inline-block;"/>
  <img src="https://raw.githubusercontent.com/deepkolos/app_container/master/assets/show-emptyclass.gif" width = "250" alt="" style="display:inline-block;"/>
  <img src="https://raw.githubusercontent.com/deepkolos/app_container/master/assets/show-admin.gif" width = "250" alt="" style="display:inline-block;"/>
</div>

#### [微信高仿(半成品,手机截图250多张,切图切到眼瞎了)](http://weibao.deepkolos.cn/littleChat#Main/Index)

<div>
  <img src="http://upload-images.jianshu.io/upload_images/252050-56764d175bce1a6f.gif?imageMogr2/auto-orient/strip" width = "250" alt="" style="display:inline-block;"/>
  <img src="http://upload-images.jianshu.io/upload_images/252050-1ca769aee48f9f5d.gif?imageMogr2/auto-orient/strip" width = "250" alt="" style="display:inline-block;"/>
  <img src="http://upload-images.jianshu.io/upload_images/252050-51281edff619ccf7.gif?imageMogr2/auto-orient/strip" width = "250" alt="" style="display:inline-block;"/>
</div>

### 一些活动页面效果

<div>
  <img src="https://raw.githubusercontent.com/deepkolos/app_container/master/assets/show-qixi.gif" width = "250" alt="" style="display:inline-block;"/>
  <img src="https://raw.githubusercontent.com/deepkolos/app_container/master/assets/show-list.gif" width = "250" alt="" style="display:inline-block;"/>
  <img src="http://upload-images.jianshu.io/upload_images/252050-1d4a979dc9c02f28.gif?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" width = "250" alt="" style="display:inline-block;"/>
  <img src="http://upload-images.jianshu.io/upload_images/252050-b14d0d4aa7ae1273.gif?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" width = "250" alt="" style="display:inline-block;"/>
  <img src="http://upload-images.jianshu.io/upload_images/252050-2d6b10a9ff4a4f15.gif?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" width = "250" alt="" style="display:inline-block;"/>
</div>


### 空课室老版
<div>
  <img src="http://upload-images.jianshu.io/upload_images/252050-57e7e98145158aa0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" width = "250" alt="" style="display:inline-block;"/>
</div>