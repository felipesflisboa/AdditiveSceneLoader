/**
 * 
 */
//TODO canvas check alert (different)
//TODO check if isn't on canvas
//TODO call AddictiveSceneLoader
//TODO var
//TODO test build
//TODO canvas error message.
//TODO scene name empty error message
//TODO structure to check id errors
const self = cc.Class({
    extends: cc.Component,

    statics:{
        loadInProgress: false,
    },

    properties: {
        canvas: cc.Canvas,
    },

    onLoad () {
        this.carriedNodeArray = []
        this.carriedCanvasNodeArray = []
        this.originSceneName = cc.director.getScene().name;
    },

    loadScene(sceneName, callback){
        this.callback = callback;
        var z = cc.director.getScene();
        for(let node of cc.director.getScene().children){
            if(cc.game.isPersistRootNode(node))
                continue;
            cc.game.addPersistRootNode(node);
            this.carriedNodeArray.push(node);
        }
        this.canvas = cc.director.getScene().getComponentInChildren(cc.Canvas);
        while(this.canvas.node.childrenCount>0){
            let child = this.canvas.node.children[0];
            this.carriedCanvasNodeArray.push(child);
            child.parent = this.canvas.node.parent;
            cc.game.addPersistRootNode(child);
            //node.parent = cc.director.getScene();
        }
        cc.log(`Destroying ${this.canvas.node.name}`);
        this.canvas.node.destroy();
        cc.director.loadScene(sceneName, this.onSceneLoaded.bind(this));

    },

    onSceneLoaded(){
        var z = cc.director.getScene();
        var canvas = cc.director.getScene().getComponentInChildren(cc.Canvas);
        for(let node of this.carriedCanvasNodeArray){
            //if(node.parent != null)
            //    continue;
            cc.game.removePersistRootNode(node);
            node.parent = canvas.node;
        }
        for(let node of this.carriedNodeArray)
            cc.game.removePersistRootNode(node);
        this.carriedNodeArray.length = 0;
        this.carriedCanvasNodeArray.length = 0;
        this.callback();
    }
});