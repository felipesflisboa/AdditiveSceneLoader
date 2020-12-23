const BaseSceneGroupLoader = require('BaseSceneGroupLoader')

/**
 * Loads the main group scene.
 * 
 * Add one for every scene on scene group. Except for main scene who have a MainSceneGroupLoader.
 */
const self = cc.Class({
    extends: BaseSceneGroupLoader,

    properties: {
        groupMainSceneName: "",
    },

    onLoad(){
        this._super();
        if(this.groupMainSceneName=="")
            cc.error(`${this.originSceneName} SceneGroupLoader groupMainSceneName has empty!`);
        
    },
    start(){
        if(!BaseSceneGroupLoader.loadInProgress)
            this.loadGroupMainScene();
    },

    loadGroupMainScene(){
        BaseSceneGroupLoader.loadInProgress = true;
        this.loadScene(this.groupMainSceneName, this.loadGroupOtherScenes);
    },

    loadGroupOtherScenes(){
        let mainLoader = cc.director.getScene().getComponentInChildren(require("MainSceneGroupLoader"))
        if(mainLoader==null)
            cc.error(`${this.originSceneName} groupMainSceneName is ${this.groupMainSceneName}, but this scene doesn't have a node with MainSceneGroupLoader component!`);
        mainLoader.onFirstSceneLoaded(this);
    },
});
