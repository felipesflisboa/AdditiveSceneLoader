const BaseAdditiveSceneLoader = require('BaseAdditiveSceneLoader')

/**
 * Loads all scenes on group that aren't loaded yet.
 * 
 * Add one on main scene with each other scene on groupSceneNameArray.
 * For other group scenes, add an AdditiveNodeDataMap pointing to this component instance scene.
 */
const self = cc.Class({
    extends: BaseAdditiveSceneLoader,

    properties: {
        groupSceneNameArray: {
            default: [],
            type: [cc.String],
            tooltip: "All scene names except self" 
        },
        shouldDisableExtraCameras: {
            default: false,
            tooltip: "When true, disable all extra cameras outside usedCameraArray" 
        },
        usedCameraArray: {
            visible: function() {return this.shouldDisableExtraCameras}, 
            default: [],
            type: [cc.Camera],
            tooltip: "Cameras to don't disable." 
        },
        SceneNamesToLoadArray: {
            visible: false,
            get: function(){
                return CC_EDITOR ? null : this.getElementsNotOnSecondArray(this.groupSceneNameArray, this.loadedSceneNameArray);
            },
        },
        /**
         * Return 0-1 with many scenes loaded (not counting self).
         * 0.5 means half scenes loaded.
        **/
        SceneLoadRatio: {
            visible: false,
            get: function(){
                if(CC_EDITOR)
                    return 0;
                if(this.groupSceneNameArray.length==0)
                    cc.error(`Main group scene on ${this.originSceneName} doesn't have scenes to load!`);
                return (this.sceneLoadedCount-1)/this.groupSceneNameArray.length;
            },
        },
    },

    onLoad(){
        this.sceneLoadedCount = 0; // Counts self
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
        this.sceneLoadedCount++;
        this.loadRemainingScenes();
    },

    loadRemainingScenes(){
        this.sceneLoadedCount++;
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
        if(this.shouldDisableExtraCameras)
            this.disableOtherCameras();
        else
            this.checkActiveCameraCount();
        this.scheduleOnce(this.afterAdditiveLoad, 0.1);
    },

    disableOtherCameras(){
        for(let cam of cc.director.getScene().getComponentsInChildren(cc.Camera))
            if(!this.usedCameraArray.includes(cam))
                cam.node.active = false;
    },

    checkActiveCameraCount(){
        let activeCamCount = cc.director.getScene().getComponentsInChildren(cc.Camera).filter((cam) => cam.enabled && cam.node.active).length;
        if(activeCamCount > 1)
            cc.warn(`There is ${activeCamCount} active cameras! If this isn't intended, toggle shouldDisableExtraCameras.`);
    },

    afterAdditiveLoad(){
        for(let callable of cc.director.getScene().getComponentsInChildren(require("AdditiveComponent")))
            callable.afterAdditiveLoad();
    },

    /**
     * Get elements of first array that aren't on second
     */
    getElementsNotOnSecondArray(first, second){
        return first.filter(element => !second.includes(element)); 
    }
});