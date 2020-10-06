const BaseAdditiveSceneLoader = require('BaseAdditiveSceneLoader')

/**
 * Loads the main group scene.
 * 
 * Add one for every scene on scene group. Except for main scene who have a MainAdditiveSceneLoader.
 */
const self = cc.Class({
    extends: BaseAdditiveSceneLoader,

    properties: {
        groupMainSceneName: "",
    },

    onLoad(){
        this._super();
        if(this.groupMainSceneName=="")
            cc.error(`${this.originSceneName} AdditiveSceneLoader groupMainSceneName has empty!`);
        
    },
    start(){
        if(!BaseAdditiveSceneLoader.loadInProgress)
            this.loadGroupMainScene();
    },

    loadGroupMainScene(){
        BaseAdditiveSceneLoader.loadInProgress = true;
        this.loadScene(this.groupMainSceneName, this.loadGroupOtherScenes);
    },

    loadGroupOtherScenes(){
        let mainLoader = cc.director.getScene().getComponentInChildren(require("MainAdditiveSceneLoader"))
        if(mainLoader==null)
            cc.error(`Main group scene on ${this.groupMainSceneName} doesn't have a MainAdditiveSceneLoader component!`);
        mainLoader.onFirstSceneLoaded(this);
    },
});
