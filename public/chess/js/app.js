;(function(window) {
    "use strict";

    // ----- dependencies ------------------------------------------------------
    if (!window.Remote) {
        throw Error("requires remote.js!");
    }

    if (!window.Config) {
        throw Error("requires config.js");
    }

    // ----- application -------------------------------------------------------
    var Remote = window.Remote;
    var Config = window.Config;
    var App = window.App = {};

    /**
     * defines the default handler for remote commands.
     * @param {Object} cmd
     */
    App.handleCommand = function(cmd) {

        switch (cmd.type) {
            case 'layout':
            case 'skin':
                Remote.handleCommand(cmd);
                break;

            default:
                Remote.sendCommand(Config.skins['skin-1'], function() {
                    Remote.sendCommand(Config.layouts['layout-1']);
                });
                break;
        }
    };

    // ----- initialization ----------------------------------------------------
    // @TODO connect to right channel / room / namespace
    Remote.connection = io('http://localhost:3000');
    Remote.connection.on('connect', Remote.onConnect);
    Remote.connection.on('disconnect', Remote.onDisconnect);
    Remote.connection.on('cmd', App.handleCommand);

})(window);
