/**
 * 
 */
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad(){
        this.persistentNodeArray = [];
    },

    markAllNodesAsPersistent(){
        cc.game.addPersistRootNode(cc.director.getScene());
    },


});
