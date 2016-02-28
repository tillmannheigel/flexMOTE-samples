;(function(window) {
    "use strict";

    // ----- dependencies ------------------------------------------------------
    if (!window.Remote) {
        throw Error("requires remote.js!");
    }

    var Remote = window.Remote;

    // ----- overrides ---------------------------------------------------------
    /**
     * override handleCommand
     * @param {Object} cmd
     */
    Remote.handleCommand = function(cmd) {

        // send skin
        Remote.sendCommand({
            action: 'set',
            type: 'skin',
            id: 'skin-chess',
            data: {
                url: 'http://localhost:3001/chess/skin/style.css'
            }
        });

        // send default layout
        Remote.sendCommand({
            action: 'set',
            type: 'layout',
            id: '3',
            data: {
                name: 'Chess',
                orientation: 'landscape',
                cols: 8,
                rows: 8,
                elements: [{
                    type: "Button",
                    "label": "T"
                }, {
                    type: "Button",
                    "label": "L"
                }, {
                    type: "Button",
                    "label": "S"
                }, {
                    type: "Button",
                    "label": "K"
                }, {
                    type: "Button",
                    "label": "D"
                }, {
                    type: "Button",
                    "label": "S"
                }, {
                    type: "Button",
                    "label": "L"
                }, {
                    type: "Button",
                    "label": "T"
                }, {
                    type: "Button",
                    "label": "B"
                }, {
                    type: "Button",
                    "label": "B"
                }, {
                    type: "Button",
                    "label": "B"
                }, {
                    type: "Button",
                    "label": "B"
                }, {
                    type: "Button",
                    "label": "B"
                }, {
                    type: "Button",
                    "label": "B"
                }, {
                    type: "Button",
                    "label": "B"
                }, {
                    type: "Button",
                    "label": "B"
                }, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {
                    type: "Button",
                    "label": "B"
                }, {
                    type: "Button",
                    "label": "B"
                }, {
                    type: "Button",
                    "label": "B"
                }, {
                    type: "Button",
                    "label": "B"
                }, {
                    type: "Button",
                    "label": "B"
                }, {
                    type: "Button",
                    "label": "B"
                }, {
                    type: "Button",
                    "label": "B"
                }, {
                    type: "Button",
                    "label": "B"
                }, {
                    type: "Button",
                    "label": "T"
                }, {
                    type: "Button",
                    "label": "L"
                }, {
                    type: "Button",
                    "label": "S"
                }, {
                    type: "Button",
                    "label": "D"
                }, {
                    type: "Button",
                    "label": "K"
                }, {
                    type: "Button",
                    "label": "S"
                }, {
                    type: "Button",
                    "label": "L"
                }, {
                    type: "Button",
                    "label": "T"
                }]
            }
        });
    };

    // ----- initialization  ---------------------------------------------------
    // @TODO connect to right channel / room / namespace
    Remote.connection = io('http://localhost:3000');
    Remote.connection.on('connect', Remote.onConnect);
    Remote.connection.on('disconnect', Remote.onDisconnect);
    Remote.connection.on('cmd', Remote.handleCommand);

})(window);
