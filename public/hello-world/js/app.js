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
            id: 'skin-hello-world',
            data: {
                url: 'http://localhost:3001/hello-world/skin/style.css'
            }
        });

        // send default layout
        Remote.sendCommand({
            action: 'set',
            type: 'layout',
            id: 'layout-1',
            data: {
                name: 'Layout 1',
                orientation: 'landscape',
                cols: 5,
                rows: 7,
                elements: [

                // first row
                {
                    type: "Button",
                    id: "home",
                    action: "home",
                    label: "HOME"
                }, {
                    type: "Text",
                    id: "title",
                    content: "Hello World",
                    cssClass: "blue",
                    cols: 3
                }, {
                    type: "Button",
                    id: "close",
                    label: "X",
                    cssClass: "red"
                },

                // second row
                {
                    type: "HTML",
                    id: "content",
                    content: '<p>Hello World!</p><p><strong>Lorem Ipsum</strong> foo bar bat! foo bar bat! foo bar bat! foo bar bat! foo bar bat! foo bar bat! foo bar bat! foo bar bat!</p><p>Hello World!</p><p><strong>Lorem Ipsum</strong> foo bar bat! foo bar bat! foo bar bat! foo bar bat! foo bar bat! foo bar bat! foo bar bat! foo bar bat!</p><p>Hello World!</p><p><strong>Lorem Ipsum</strong> foo bar bat! foo bar bat! foo bar bat! foo bar bat! foo bar bat! foo bar bat! foo bar bat! foo bar bat!</p><p>Hello World!</p><p><strong>Lorem Ipsum</strong> foo bar bat! foo bar bat! foo bar bat! foo bar bat! foo bar bat! foo bar bat! foo bar bat! foo bar bat!</p>',
                    cols: 5,
                    rows: 5
                },

                // third row
                {
                    type: "Text",
                    id: "status",
                    content: "Status.... (<p>XSS Test</p><script>alert('foo');)",
                    cols: 5
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
