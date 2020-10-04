const AdditiveNodeData = require('AdditiveNodeData');
const AdditiveCanvasData = require('AdditiveCanvasData');

/**
 * 
 */
const self = cc.Class({
    extends: cc.Component,

    statics:{
        loadInProgress: false,
    },

    properties:{
        canvasSortOrder: 0,
    },

    onLoad () {
        this.carriedNodeArray = []
        this.carriedCanvasNodeArray = []
        this.nodeDataPerId = {};
        this.originSceneName = cc.director.getScene().name;
        this.beforeLoadCanvasData = {};
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
        this.registerIdArray(this.carriedNodeArray);
        this.prepareCanvasBeforeSceneLoad(cc.director.getScene().getComponentInChildren(cc.Canvas));
        cc.director.loadScene(sceneName, this.onSceneLoaded.bind(this));
    },
    
    onSceneLoaded(){
        this.checkIfIdAlreadyContained(cc.director.getScene().children);
        this.prepareCanvasAfterSceneLoad(cc.director.getScene().getComponentInChildren(cc.Canvas));
        this.acoplateNodes(this.carriedNodeArray);
        this.callback();
    },

    prepareCanvasBeforeSceneLoad(canvas){
        this.currentCanvasSortOrder = this.getCurrentCanvasSortOrder();
        this.beforeLoadCanvasData = AdditiveCanvasData.factory(canvas, this.originSceneName);
        this.carriedCanvasNodeArray.push(...this.uncoupleCanvasNodes(canvas));
        this.registerIdArray(this.carriedCanvasNodeArray, this.currentCanvasSortOrder);
        canvas.node.destroy();
    },

    prepareCanvasAfterSceneLoad(canvas){
        this.currentCanvasSortOrder = this.getCurrentCanvasSortOrder();
        if(!this.beforeLoadCanvasData.equals(AdditiveCanvasData.factory(canvas)))
            cc.warn(`Scene ${this.beforeLoadCanvasData.originSceneName} canvas doesn't match with scene ${cc.director.getScene().name} data`);
        this.acoplateCanvasNodes(canvas, this.carriedCanvasNodeArray);
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
        return ret;
    },

    acoplateCanvasNodes(canvas, nodeArray){
        for(let node of nodeArray){
            cc.game.removePersistRootNode(node);
            node.parent = canvas.node;
            node.setSiblingIndex(canvas.childrenCount-1);
        }
        this.fixCanvasSortOrder(canvas);
        nodeArray.length = 0;
    },

    fixCanvasSortOrder(canvas){
        let canvasChildren = [...canvas.node.children];
        canvasChildren.sort(((a, b) => this.getNodeSortPriority(a) - this.getNodeSortPriority(b)).bind(this));
        for(let i = 0; i < canvasChildren.length; i++)
            canvasChildren[i].setSiblingIndex(i);
        /* //remove
        for(let node of newNodeArray){
            for (let i = 0; i < canvas.node.childrenCount; i++) {
                const canvasChildren = canvas.node.children[i];
                if(node==canvasChildren)
                    continue;
                let sort = this.getNodeSortOrder(canvasChildren);    //remove
                if(this.getNodeSortOrder(canvasChildren) > this.currentCanvasSortOrder){
                    node.setSiblingIndex(i);
                    break;
                }
            }
        }
        */
    },

    compareCanvasNodes(a,b ){

    },

    acoplateNodes(nodeArray){
        for(let node of nodeArray)
            cc.game.removePersistRootNode(node);
        nodeArray.length = 0;
    },

    getCurrentCanvasSortOrder(){
        let b = cc.director.getScene().name; //remove
        var a = cc.director.getScene().getComponentsInChildren(self); //remove
        for(let loader of cc.director.getScene().getComponentsInChildren(self))
            if(loader.originSceneName == cc.director.getScene().name)
                return loader.canvasSortOrder;
        cc.error(`SceneLoader whith canvasSortOrder not found for scene ${cc.director.getScene().name}!`);
        return 0;
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

    registerIdArray(nodeArray, canvasSortOrder=0){
        for (let node of nodeArray)
            if(!this.nodeDataPerId.hasOwnProperty(node._id))
                this.nodeDataPerId[node._id] = AdditiveNodeData.factory(node, canvasSortOrder, this.originSceneName);
    },

    getNodeSortPriority(node){
        return this.getNodeSortOrder(node)*10000+node.getSiblingIndex();
    },

    getNodeSortOrder(node){
        return this.nodeDataPerId.hasOwnProperty(node._id) ? this.nodeDataPerId[node._id].sortOrder : this.currentCanvasSortOrder;
    },
});