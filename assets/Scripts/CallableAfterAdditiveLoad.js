/**
 * Called after all group additive load ends.
 */
cc.Class({
    extends: cc.Component,

    properties: {
        eventCallback: [cc.Component.EventHandler],
    },

    afterAdditiveLoad () {
        for (let event of this.eventCallback)
            event.emit([event.customEventData]);
    },
});