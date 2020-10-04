const BaseAdditiveSceneLoader = require('BaseAdditiveSceneLoader')

const self = cc.Class({
    extends: BaseAdditiveSceneLoader,

    properties: {
        groupSceneNameArray: {
            default: [],
            type: [cc.String],
            tooltip: "All scene names except self" 
        },

        SceneNamesToLoadArray: {
            visible: false,
            get: function(){
                return CC_EDITOR ? null : this.getElementsNotOnSecondArray(this.groupSceneNameArray, this.loadedSceneNameArray);
            },
        },
    },

    onLoad(){
        this._super();
        this.loadedSceneNameArray = [this.originSceneName];
    },

    start(){
        if(!BaseAdditiveSceneLoader.loadInProgress)
            this.loadAllScenes();
    },

    loadAllScenes(){
        BaseAdditiveSceneLoader.loadInProgress = true;
        this.loadRemainingScenes();
    },

    onFirstSceneLoaded(firstSceneLoader){
        this.nodeDataMap = firstSceneLoader.nodeDataMap;
        this.loadedSceneNameArray.push(firstSceneLoader.originSceneName);
        this.loadRemainingScenes();
    },

    loadRemainingScenes(){
        if(this.SceneNamesToLoadArray.length == 0){
            this.onAllLoadEnd();
            return;
        }
        this.loadedSceneNameArray.push(this.SceneNamesToLoadArray[0]);
        this.loadScene(this.loadedSceneNameArray[this.loadedSceneNameArray.length-1], this.loadRemainingScenes);
    },

    onAllLoadEnd(){
        for(let widget of cc.director.getScene().getComponentsInChildren(cc.Widget))
            widget.updateAlignment();
        self.loadInProgress = false;
        cc.log("ended!"); //remove
        this.scheduleOnce(this.afterAdditiveLoad, 0.1);
    },

    afterAdditiveLoad(){
        let z = cc.director.getScene();
        for(let callable of cc.director.getScene().getComponentsInChildren(require("CallableAfterAdditiveLoad")))
            callable.afterAdditiveLoad();
    },

    /**
     * Get elements of first array that aren't on second
     */
    getElementsNotOnSecondArray(first, second){
        return first.filter(element => !second.includes(element)); 
    }
});