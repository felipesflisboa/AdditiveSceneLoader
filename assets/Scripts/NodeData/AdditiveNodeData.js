const self = cc.Class({
    statics:{
        factory(node, sortOrder, originSceneName) {
            let ret = new self();
            ret.node = node;
            ret.name = node.name;
            ret.sortOrder = sortOrder;
            ret.originSceneName = originSceneName;
            return ret;
        },
    },
});