var P2V = require('../index.js');


var p2v = new P2V("http://localhost:800/devel/page2video/test/page.html", "#capture");
p2v.on("paged", function(dir) {
	console.log(dir);
})

p2v.on("video", function(videoPath) {
	console.log(videoPath);
})
p2v.start();