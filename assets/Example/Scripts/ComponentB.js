const self = cc.Class({
    extends: cc.Component,

    onLoad () {
        this.node.getComponent(require("CallableAfterAdditiveLoad")).eventCallback.push(this.createEvent());
    },

    createEvent(){
        let ret = new cc.Component.EventHandler();
        ret.target = this.node;
        ret.component = cc.js.getClassName(self);
        ret.handler = this.afterAdditiveLoad.name;
        return ret;
    },

    afterAdditiveLoad () {
        cc.log("Programmatically calling a method on scene B after additive load. Uses CallableAfterAdditiveLoad.");
    },
});
