cc.Class({
    extends: require('GroupComponent'),

    afterGroupLoad () {
        cc.log("calling a method on scene A after group load. Uses GroupComponent.");
    },
});