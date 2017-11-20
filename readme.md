# 小小的框架~

start: 2017/2/6<br>
end  : 2017/4/18

> nginx配置:nginx.conf<br>
> 配置: config.sample.php

[微报应用框架](http://weibao.deepkolos.cn)<br>
[制作记录](http://www.jianshu.com/p/3bf037440cc0)

### 主要特性

#### 前端部分
> 0. 支持返回键
> 1. 有一个全局的事件组件, 支持的事件有:slide, doubleclick, pressStart, pressEnd, press, focus, blur, over, enter, leave, 弥补了原生事件, 事件的拓展支持, 比如popupclick, 派生于click, 但是增加了一些特殊判断
> 2. 集成[Emmet模版引擎](https://github.com/deepkolos/emmet-template-engine), 拥有了强大的数据导入能力
> 3. 支持3个hash类型, action对应页面切换, viewStatus对应页面状态返回键支持, viewPopup对应popup类型的返回键支持
> 4. 这些返回键支持都支持过渡动画~

### 后端部分

> 0. 简单的orm的支持
> 1. 遵从MVC的结构
> 2. 支持插件
> 3. 万能this向~ (魔术方法滥用,逃~
> 4. component内支持所有方法的hook~
> 5. 内置个小型的爬虫框架~
> 6. 调优的记录在test文件夹里

### 效果演示
<div>
  <img src="https://raw.githubusercontent.com/deepkolos/app_container/master/assets/list.jpg" width = "250" alt="" style="display:inline-block;"/>
  <img src="https://raw.githubusercontent.com/deepkolos/app_container/master/assets/show-emptyclass.gif" width = "250" alt="" style="display:inline-block;"/>
  <img src="https://raw.githubusercontent.com/deepkolos/app_container/master/assets/show-admin.gif" width = "250" alt="" style="display:inline-block;"/>
</div>