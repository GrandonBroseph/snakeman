module.exports = (function(){
    var geometry = require("./geometry");
    var video = require("./video");

    function init() {
        video.load("/img/tileset.png", function(){
            this.init();
        });
    }

    return {
        init: init
    }
})();
