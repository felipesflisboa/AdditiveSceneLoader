const self = cc.Class({
    extends: cc.Component,

    printMessage (event, message) {
        cc.log(message);
    },
});