var Page = require("../lib/page");

var page = new Page("http://localhost:800/devel/page2video/test/page.html", "#capture");

page.start();

console.log(page.tmpDir)