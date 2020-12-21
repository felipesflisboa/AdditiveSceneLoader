const self = cc.Class({
    extends: cc.Component,

    onLoad () {
        this.node.getComponent(require("CallableAfterGroupLoad")).eventCallback.push(this.createEvent());
    },

    createEvent(){
        let ret = new cc.Component.EventHandler();
        ret.target = this.node;
        ret.component = cc.js.getClassName(self);
        ret.handler = this.afterGroupLoad.name;
        return ret;
    },

    afterGroupLoad () {
        cc.log("Programmatically calling a method on scene B after group load. Uses CallableAfterGroupLoad.");
    },
});
