var url  = 'http://cricy.github.io/page2video/test/page.html'
var selector = '#capture'
// var Page = require("../lib/page");
var P2V = require('../index.js');

var fs = require('fs');
var assert = require('assert')


describe('pages2video ', function(){

	var p2v = new P2V(url, selector);

	it("to video", function(done) {

		this.timeout(15000);
  	
		p2v.on("paged", function(dir) {
			console.log(dir);
			assert(fs.statSync(dir + '/img0001.jpg').isFile())
			done();
		})

		// p2v.on("video", function(videoPath) {
		// 	console.log(videoPath);
		// 	setTimeout(function(){
		// 		var video = fs.statSync(videoPath).isFile();
		// 		console.log("video exists: " + video);
		// 		assert(video)
		// 		// destroy();
		// 		done();
		// 	}, 500)
		// })

		p2v.start();

		function destroy(){
			p2v.destroy();
			setTimeout(function(){
				assert.notEqual(fs.existsSync(p2v.tmpDir))
				done();
			}, 500)
		}
		
	});


})