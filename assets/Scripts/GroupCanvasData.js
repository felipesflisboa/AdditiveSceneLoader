const self = cc.Class({
    statics:{
        factory(canvas, originSceneName=null) {
            let ret = new self();
            ret.originSceneName = originSceneName;
            ret.fitHeight = canvas.fitHeight;
            ret.fitWidth = canvas.fitWidth;
            ret.designResolution  = canvas.designResolution;
            return ret;
        },
    },

    equals(other){
        return (
            this.fitHeight == other.fitHeight &&
            this.fitWidth == other.fitWidth &&
            this.designResolution.equals(other.designResolution)
        );
    },
});