/**
 * 
 */
const self = cc.Class({
    extends: cc.Component,

    statics:{
        loadInProgress: false,
    },

    onLoad () {
        this.carriedNodeArray = []
        this.carriedCanvasNodeArray = []
        this.originSceneName = cc.director.getScene().name;
        if(this.node.getComponent(cc.Canvas) != null){
            cc.error(
                `${this.originSceneName} AdditiveSceneLoader is on canvas!
                This script won't work on Canvas! Put this component on another node`
            );
        }
    },

    loadScene(sceneName, callback){
        this.callback = callback;
        this.carriedNodeArray.push(...this.uncoupleNodes(cc.director.getScene().children));
        this.carriedCanvasNodeArray.push(...this.uncoupleCanvasNodes(cc.director.getScene().getComponentInChildren(cc.Canvas)));
        cc.director.loadScene(sceneName, this.onSceneLoaded.bind(this));
    },

    uncoupleNodes(nodeArray){
        let ret = [];
        for(let node of nodeArray){
            if(cc.game.isPersistRootNode(node))
                continue;
            cc.game.addPersistRootNode(node);
            ret.push(node);
        }
        return ret;
    },
    
    // Also destroys canvas
    uncoupleCanvasNodes(canvas){
        let ret = [];
        if(canvas==null)
            return ret;
        while(canvas.node.childrenCount>0){
            let child = canvas.node.children[0];
            ret.push(child);
            child.parent = canvas.node.parent;
            cc.game.addPersistRootNode(child);
        }
        canvas.node.destroy();
        return ret;
    },

    onSceneLoaded(){
        this.acoplateCanvasNodes(cc.director.getScene().getComponentInChildren(cc.Canvas), this.carriedCanvasNodeArray);
        this.acoplateNodes(this.carriedNodeArray);
        this.callback();
    },

    acoplateCanvasNodes(canvas, nodeArray){
        for(let node of nodeArray){
            cc.game.removePersistRootNode(node);
            node.parent = canvas.node;
        }
        nodeArray.length = 0;
    },

    acoplateNodes(nodeArray){
        for(let node of nodeArray)
            cc.game.removePersistRootNode(node);
        nodeArray.length = 0;
    },
});