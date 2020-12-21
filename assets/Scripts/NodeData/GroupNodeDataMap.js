const GroupNodeData = require('GroupNodeData');

const self = cc.Class({
    ctor (){
        this.content = {};
    },

    get(id){
        return this.content[id];
    },

    set(id, value){
        this.content[id] = value;
    },

    hasId(id){
        return this.content.hasOwnProperty(id);
    },

    registerIdArray(nodeArray, originSceneName, canvasSortOrder=0){
        for (let node of nodeArray)
            if(!this.hasId(node._id))
                this.set(node._id, GroupNodeData.factory(node, canvasSortOrder, originSceneName));
    },

    checkIfIdAlreadyContained(nodeArray, nodeSceneName){
        for (let node of nodeArray){
            if(this.hasRepeatedId(node)){
                cc.error(`${this.get(node._id).name} from scene ${this.get(node._id).originSceneName} `+ 
                    `and ${node.name} from scene ${nodeSceneName} have the same ID!`+
                    `\nTo solve this issue, duplicate one of these nodes and delete the original.`
                );
            }
        }
    },

    hasRepeatedId(node){
        return this.hasId(node._id) &&  !cc.isValid(this.get(node._id).node);
    },
});