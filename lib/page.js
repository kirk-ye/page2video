var require = patchRequire(require);
var casper = require('casper'),
    utils = require('utils'),
    events = require('events'),
    system = require('system');



var captureStatus = {
    unCapture: 1,
    capturing: 2,
    captured: 3
};

/**
    options:
        casper:  casper options参数
        callbackCapture: 开始截图

*/
function Page(url, selector, options) {
    // body...

    var defaults = {
        casper: null,
        casperOptions: null,
        // callbackCapture: false,
        fps: 20,
        timeout: 100000
    }

    this.url = url;
    this.options = utils.mergeObjects(defaults, options);
    this.selector = selector;
    this.imgCount = 0;
    this.casper = this.options.casper || casper.create(this.options.casperOptions);

    this.tmpDir = getTempDir();
    this.status = captureStatus.unCapture;
    this.duration = 1000 / this.options.fps;

}

utils.inherits(Page, events.EventEmitter);


Page.prototype.start = function() {
    var me = this;

    me.casper.start(this.url);
    me.casper.page.onCallback = (function(data) {
        this.onCallback(data);
    }).bind(this)

    me.casper.waitFor(function() {
        return me.status === captureStatus.captured;
    }, null, null, this.options.timeout)
    me.casper.run();
};

/*
    data = {'action': captureStart|captureEnd }
*/
Page.prototype.onCallback = function(data) {

    if (data && data.action) {
        switch (data.action) {
            case "captureStart":
                this.captureStart();
                break;
            case "captureEnd":
                this.captureEnd();
                break;
        }
    }

    this.emit("callback", data);
};



Page.prototype._capture = function() {

    this.casper.captureSelector(this.tmpDir + "/" + getPerfixName(this.imgCount) + ".jpg", this.selector, {
        format: "jpg",
        quality: 100
    })
}



Page.prototype._captureTimeout = function() {
    var me = this;
    if (me.status != captureStatus.capturing) {
        return;
    }
    console.log(me.imgCount + "===" + me.duration)
    me.imgCount++;
    setTimeout(function() {
        me._captureTimeout();
    }, me.duration);
    me._capture();
}
Page.prototype.captureStart = function() {
    this.status = captureStatus.capturing;
    this.imgCount = 0;
    this._captureTimeout();
    this.emit("captureStart");
}
Page.prototype.captureEnd = function() {


    this.status = captureStatus.captured;

    this.emit("captureEnd");
}

Page.prototype.captureStatus = captureStatus;

module.exports = Page;

//========== helpers  ============ 

function getPerfixName(b) {
    var l = b.toString().length;
    var zero = ""
    if (l == 1) {
        zero = "000";
    } else if (l == 2) {
        zero = "00";
    } else if (l == 3) {
        zero = "0";
    }
    return "img" + zero + b
};

function getTempDir() {
    var tmp = system.env["TMPDIR"] || "./tmp/";
    return tmp + Date.now() + "_" + (Math.random() * 0x100000000 + 1).toString(36)
}