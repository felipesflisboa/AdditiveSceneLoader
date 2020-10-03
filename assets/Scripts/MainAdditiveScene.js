
//TODO canvas check alert (different)
//TODO check if isn't on canvas
//TODO call AddictiveSceneLoader
cc.Class({
    extends: cc.Component,

    properties: {
        canvas: cc.Canvas,
    },

    onLoad () {
        this.carriedNodeArray = []
        this.carriedCanvasNodeArray = []
    },

    start(){
        this.loadScene("A");
    },

    loadScene(sceneName){
        var z = cc.director.getScene();
        for(let node of cc.director.getScene().children){
            if(cc.game.isPersistRootNode(node))
                continue;
            cc.game.addPersistRootNode(node);
            this.carriedNodeArray.push(node);
        }
        while(this.canvas.node.childrenCount>0){
            let child = this.canvas.node.children[0];
            this.carriedCanvasNodeArray.push(child);
            child.parent = this.canvas.node.parent;
            cc.game.addPersistRootNode(child);
            //node.parent = cc.director.getScene();
        }
        this.canvas.node.destroy();
        cc.director.loadScene(sceneName, this.onSceneLoaded.bind(this));

    },

    onSceneLoaded(){
        var z = cc.director.getScene();
        var canvas = cc.director.getScene().getComponentInChildren(cc.Canvas);
        for(let node of this.carriedCanvasNodeArray)
            node.parent = canvas.node;
        for(let widget of canvas.node.getComponentsInChildren(cc.Widget))
            widget.updateAlignment();
        for(let node of this.carriedNodeArray)
            cc.game.removePersistRootNode(node);
        this.carriedNodeArray.length = 0;
        this.toPersistNodeArray = [];
    }
});
