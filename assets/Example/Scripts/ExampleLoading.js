const MainSceneGroupLoader = require('MainSceneGroupLoader');

/**
 * Loading panel example script.
 */
cc.Class({
    extends: cc.Component,

    properties: {
        progressBar: cc.ProgressBar,
        barSpeedPerFrame: {
            default: 0.005,
            tooltip: "Bar max speed per frame.",
        },
        barLoadedSpeedPerFrame: {
            default: 0.05,
            tooltip: "Bar max speed per frame when ProgressRario is 1 (max).",
        },

        CurrentBarSpeedPerFrame: {
            visible: false,
            get: function () {
                return !CC_EDITOR && this.ProgressRatio==1 ? this.barLoadedSpeedPerFrame : this.barSpeedPerFrame;
            }
        },
        Active:{
            visible: false,
            get: function () {
                return this.node.active;
            }
        },
        ProgressRatio:{
            visible: false,
            get: function () {
                return CC_EDITOR ? 0 : this.mainSceneLoader.LoadRatio;
            }
        },
    },

    onLoad(){
        this.mainSceneLoader = cc.director.getScene().getComponentInChildren(MainSceneGroupLoader);
        this.progressBar.progress = 0;
        this.onLoadEndCalled = false;
    },

    update(){
        this.updateProgressBar();
        if(this.progressBar.progress==1 && !this.onLoadEndCalled)
            this.onLoadEnd();
    },

    onLoadEnd(){
        if(this.onLoadEndCallback != null)
            this.onLoadEndCallback();
        this.onLoadEndCalled = true;
    },

    // Can't use a tween directly because of frame rate while loading scenes
    updateProgressBar(){
        this.progressBar.progress = Math.min(this.progressBar.progress+this.CurrentBarSpeedPerFrame, this.ProgressRatio);
    },

    show(){
        this.node.active = true;
    },

    close(){
        this.node.active = false;
    },
});