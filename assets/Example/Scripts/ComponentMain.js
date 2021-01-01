cc.Class({
    extends: cc.Component,

    onLoad(){
        this.initializeLoading();
    },

    initializeLoading(){
        this.loading = cc.director.getScene().getComponentInChildren(require('ExampleLoading'));
        this.loading.onLoadEndCallback = this.onLoadEnd.bind(this);
    },

    onLoadEnd () {
        cc.log("Load ended! Closing load panel!");
        this.scheduleOnce(() => this.loading.close(), 0.5);
    },
});