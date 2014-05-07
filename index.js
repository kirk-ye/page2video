var child_process = require('child_process');
var FFmpeg = require('fluent-ffmpeg');
var util = require("util"),
    EventEmitter = require('events').EventEmitter;
var rimraf = require('rimraf');
var debug = require("debug")("page2video");

function P2V(url, selector, options) {

    var defaults = {
        fps: 20,
        viewportSize: '1200x600'
    }

    this.url = url;
    this.selector = selector;
    this.options = util._extend(defaults, options || {});
    this._child = null;
    this.tmpDir = "";
}

util.inherits(P2V, EventEmitter);

P2V.prototype.start = function(cb) {
    this.on("video", function(videoPath) {
        if (cb && typeof(cb).toLowerCase() === "function") {
            cb(videoPath);
        }
    })
    this.callPage();
}

P2V.prototype.callPage = function(){
    try{
        this.spawn()
    }catch(err){
        debug(err);
        // throw err;
    }
}

P2V.prototype.spawn = function() {

    var child = this._child = child_process.spawn(getCasperCommand(), this.getArgs());

    child.stdout.setEncoding('utf8');
    child.stdout.on("data", function(data) {
        debug(data);
        if (data.indexOf("dir=") > -1) {
            this.tmpDir = data.substr(4).replace(/\s+$/, "");
            debug("tmpDir:" + this.tmpDir);
            
            setTimeout(function(){
                this.emit("paged", this.tmpDir);
                this.buildVideo();
            }.bind(this),0);
            
        }
    }.bind(this));
    child.stderr.setEncoding('utf8');
    child.stderr.on("data", function(data) {
        debug('child process errors: ' + data);
    })
    child.on('error', function(err){
         debug('child process error: ' + err);
    })
    child.on('close', function(code){
         debug('child process close width code: ' + code);
    })
    child.on('exit', function(code) {
        this._child = null;
        debug('child process exited with code ' + code);
    }.bind(this));
};

P2V.prototype.buildVideo = function() {
    var tmpDir = this.tmpDir;
    var fps = this.options.fps;
    var videoPath = tmpDir + '/video.mp4';
    try {
        var ff = new FFmpeg({
            source: tmpDir + '/img%04d.jpg'
        });
        ff.addOption("-r", this.options.fps)
        .withVideoCodec('libx264')
        .on("end", function(){
            debug("save video:" + videoPath);
            this.emit("video", videoPath);
        }.bind(this))
        .on("error", function(err){
            debug("save video error:" + err.message);
        })
        .saveToFile(videoPath);
    }catch(err){
        debug("save video error try:" + err);
        throw err;
    }
    
};

P2V.prototype.destroy = function() {
    var tmpDir = this.tmpDir;
    rimraf(tmpDir, function(){
        debug("deleted tmpDir:" + this.tmpDir);
        this.emit("deleted")
    }.bind(this));
};

P2V.prototype.getArgs = function getArgs() {
    var args = [__dirname + "/lib/cli.js"];

    args.push("--url=" + this.url);
    if (this.selector) {
        args.push("--selector=" + this.selector);
    }

    if (this.options.fps) {
        args.push("--fps=" + this.options.fps);
    }
    if (this.options.timeout) {
        args.push("--timeout=" + this.options.timeout);
    }
    if (this.options.viewportSize) {
        args.push("--viewportSize=" + this.options.viewportSize);
    }
    return args;
}

// module exports
module.exports = P2V;



// =========helpers ========

function getCasperCommand() {
    return __dirname + "/node_modules/.bin/casperjs"
}