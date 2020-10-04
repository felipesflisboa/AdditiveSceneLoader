const self = cc.Class({
    statics:{
        factory(node, originSceneName) {
            let ret = new self();
            ret.node = node;
            ret.name = node.name;
            ret.originSceneName = originSceneName;
            return ret;
        },
    },
});