/**
 * Called after all scene group load.
 */
cc.Class({
    extends: require('GroupComponent'),

    properties: {
        eventCallback: [cc.Component.EventHandler],
    },

    afterGroupLoad () {
        for (let event of this.eventCallback)
            event.emit([event.customEventData]);
    },
});