const AdditiveNodeData = require('AdditiveNodeData');

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
        this.nodeDataPerId = {};
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
        this.registerIdArray(this.carriedNodeArray);
        this.registerIdArray(this.carriedCanvasNodeArray);
        cc.director.loadScene(sceneName, this.onSceneLoaded.bind(this));
    },

    onSceneLoaded(){
        this.checkIfIdAlreadyContained(cc.director.getScene().children);
        this.acoplateCanvasNodes(cc.director.getScene().getComponentInChildren(cc.Canvas), this.carriedCanvasNodeArray);
        this.acoplateNodes(this.carriedNodeArray);
        this.callback();
    },

    checkIfIdAlreadyContained(nodeArray){
        for (let node of nodeArray){
            if(this.hasRepeatedId(node)){
                cc.error(`${this.nodeDataPerId[node._id].name} from scene ${this.nodeDataPerId[node._id].originSceneName} `+ 
                    `and ${node} from scene ${this.originSceneName} have the same ID!`+
                    `\nTo solve this issue, duplicate one of these nodes and delete the original.`
                );
            }
        }
    },

    hasRepeatedId(node){
        return (
            this.nodeDataPerId.hasOwnProperty(node._id) && 
            !cc.isValid(this.nodeDataPerId[node._id].node) && 
            node.getComponent(cc.Canvas) == null
        );
    },

    registerIdArray(nodeArray){
        for (let node of nodeArray)
            if(!this.nodeDataPerId.hasOwnProperty(node._id))
                this.nodeDataPerId[node._id] = AdditiveNodeData.factory(node, this.originSceneName);
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