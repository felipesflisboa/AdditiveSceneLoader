const GroupNodeDataMap = require('GroupNodeDataMap');
const GroupCanvasData = require('GroupCanvasData');

const self = cc.Class({
    extends: cc.Component,

    statics:{
        loadInProgress: false,
    },

    properties:{
        sortOrder: 0,
    },

    onLoad () {
        this.carriedNodeArray = []
        this.carriedCanvasNodeArray = []
        this.nodeDataMap = new GroupNodeDataMap();
        this.originSceneName = cc.director.getScene().name;
        this.beforeLoadCanvasData = {};
        if(this.node.getComponent(cc.Canvas) != null){
            cc.error(
                `${this.originSceneName} SceneGroupLoader is on canvas!
                This script won't work on Canvas! Put this component on another node`
            );
        }
    },

    loadScene(sceneName, callback){
        this.callback = callback;
        this.carriedNodeArray.push(...this.uncoupleNodes(cc.director.getScene().children));
        this.currentSortOrder = this.getCurrentSortOrder();
        this.registerNodeIdArray(this.carriedNodeArray);
        this.prepareCanvasBeforeSceneLoad(cc.director.getScene().getComponentInChildren(cc.Canvas));
        cc.director.loadScene(sceneName, this.onSceneLoaded.bind(this));
    },
    
    onSceneLoaded(){
        this.currentSortOrder = this.getCurrentSortOrder();
        this.nodeDataMap.checkIfIdAlreadyContained(cc.director.getScene().children, cc.director.getScene().name);
        this.prepareCanvasAfterSceneLoad(cc.director.getScene().getComponentInChildren(cc.Canvas));
        this.acoplateNodes(this.carriedNodeArray);
        this.callback();
    },

    prepareCanvasBeforeSceneLoad(canvas){
        this.beforeLoadCanvasData = GroupCanvasData.factory(canvas, this.originSceneName);
        this.carriedCanvasNodeArray.push(...this.uncoupleCanvasNodes(canvas));
        this.registerNodeIdArray(this.carriedCanvasNodeArray);
        canvas.node.destroy();
    },

    prepareCanvasAfterSceneLoad(canvas){
        if(!this.beforeLoadCanvasData.equals(GroupCanvasData.factory(canvas)))
            cc.warn(`Scene ${this.beforeLoadCanvasData.originSceneName} canvas doesn't match with scene ${cc.director.getScene().name} canvas attributes.`);
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
        this.fixSortOrder(canvas.node.children);
        nodeArray.length = 0;
    },

    fixSortOrder(nodeArray){
        nodeArray.sort(((a, b) => this.getNodeSortPriority(a) - this.getNodeSortPriority(b)).bind(this));
        for(let i = 0; i < nodeArray.length; i++)
            nodeArray[i].setSiblingIndex(i);
    },

    acoplateNodes(nodeArray){
        for(let node of nodeArray)
            cc.game.removePersistRootNode(node);
        this.fixSortOrder(cc.director.getScene().children);
        nodeArray.length = 0;
    },

    registerNodeIdArray(nodeArray){
        this.nodeDataMap.registerIdArray(nodeArray, this.originSceneName, this.currentSortOrder);
    },

    getCurrentSortOrder(){
        for(let loader of cc.director.getScene().getComponentsInChildren(self))
            if(loader.originSceneName == cc.director.getScene().name)
                return loader.sortOrder;
        cc.error(`SceneLoader whith sortOrder not found for scene ${cc.director.getScene().name}!`);
        return 0;
    },

    getNodeSortPriority(node){
        return this.getNodeSortOrder(node)*10000+node.getSiblingIndex();
    },

    getNodeSortOrder(node){
        return this.nodeDataMap.hasId(node._id) ? this.nodeDataMap.get(node._id).sortOrder : this.currentSortOrder;
    },
});