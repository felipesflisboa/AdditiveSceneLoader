cc.Class({
    extends: require('AdditiveComponent'),

    afterAdditiveLoad () {
        cc.log("calling a method on scene A after additive load. Uses AdditiveComponent.");
    },
});