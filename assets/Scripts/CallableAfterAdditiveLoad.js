/**
 * Called after all scene group additive load.
 */
cc.Class({
    extends: require('AdditiveComponent'),

    properties: {
        eventCallback: [cc.Component.EventHandler],
    },

    afterAdditiveLoad () {
        for (let event of this.eventCallback)
            event.emit([event.customEventData]);
    },
});