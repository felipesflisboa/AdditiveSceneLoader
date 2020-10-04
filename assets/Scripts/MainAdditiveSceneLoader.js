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

    onFirstSceneLoaded(firstSceneName){
        this.loadedSceneNameArray.push(firstSceneName);
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
        cc.log("ended!");
        //TODO call method  on every component
    },

    /**
     * Get elements of first array that aren't on second
     */
    getElementsNotOnSecondArray(first, second){
        return first.filter(element => !second.includes(element)); 
    }
});