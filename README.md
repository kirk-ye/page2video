
# page to video

[![Build Status](https://api.travis-ci.org/cricy/page2video.png?branch=master)](http://travis-ci.org/cricy/page2video)

基于 [casperjs](http://casperjs.org)、[fluent-ffmpeg](https://github.com/schaermu/node-fluent-ffmpeg)，把页面生成视频功能

## 原理

用`casperjs`生成多张图片，再用`fluent-ffmpge`把多张图片合成视频


## 安装

npm安装

```
$ npm install page2video
```


## 使用



```
var P2V = require("page2video");


var p2v = new P2V(url, selector);

p2v.start(function(videoPath){
	
	// videoPath： 最终生成的视频路径， 需要复制到别的地址，不然会被删除

});
```

## page页面

需要设置开始截屏与结束截屏

```
send("captureStart");

send("captureEnd");

function send(action){
  if (typeof window.callPhantom === 'function') {
    window.callPhantom({ 'action': action });
  }
}
```
