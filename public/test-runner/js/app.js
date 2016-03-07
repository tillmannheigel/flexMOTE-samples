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
     *
     */
    App.user = null;

    /**
     *
     */
    App.userTimeout = null;

    /**
     *
     */
    App.room = null;

    /**
     * defines the default handler for remote commands.
     * @param {Object} cmd
     */
    App.handleCommand = function(cmd) {
        Remote.DEBUG && console.log('app | handleCommand:', cmd.type);

        // valid commands for connected user
        if (App.user && App.user.id) {
            clearInterval(App.userTimeout);
            App.userTimeout = setInterval(App.onUserTimeout, 5000);
            switch (cmd.type) {
                case 'skin':
                case 'layout':
                case 'button':
                    Remote.handleCommand(cmd);
                    break;
            }
        }

        // handle users (app specific, in this case we only have one user)
        switch (cmd.type) {
            case 'user':
                switch (cmd.action) {
                    case 'leave':
                    case 'disconnect':
                        if (App.user && App.user.id == cmd.id) {
                            App.onUserTimeout();
                        }
                        break;

                    case 'join':
                        if (!App.user || App.user.id == cmd.id) {
                            App.user = cmd;
                            $('#user').html(cmd.id).show();
                            Remote.sendCommand(App.user.id, Config.skins['skin-1'], function() {
                                Remote.sendCommand(App.user.id, Config.layouts['layout-1']);
                            });
                            App.userTimeout = setInterval(App.onUserTimeout, 5000);
                        }
                        break;
                }
        }
    };

    App.onUserTimeout = function() {
        clearInterval(App.userTimeout);
        Remote.DEBUG && console.log('app | onUserTimeout');
        App.user = null;
        $('#user').empty().hide();
    };

    /**
     *
     */
    App.onConnect = function() {
        Remote.DEBUG && console.log('app | onConnect');
        $('body').append('<p>Attempting to connect to flexMOTE server....</p>');
        Remote.join(App.room, function(room) {
            App.room = room;
            var html = '<p>Connection established. Open RC ';
            html += '<a target="_blank" href="' + Config.server + '#' + room + '">';
            html += '#' + room + '</a></p>';
            $('body').append(html);

            $('#qrcode').empty();
            var qrcode = new QRCode("qrcode", {
                text: "http://localhost:3000/#" + room.toString(),
                width: 256,
                height: 256,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

            // some info texts...
            var info = '<p><a target="_blank" href="http://localhost:3000/#' + room + '">';
            info += 'localhost:3000<br/>#<strong>' + room + '</strong></p>';
            $('#qrcode').append(info);
            
            App.room = room;
        });
    };

    /**
     *
     */
    App.onDisconnect = function() {
        Remote.DEBUG && console.log('app | onDisconnect');
        $('body').append('<p>Disconnected from flexMOTE server. Trying to reconnect...</p>');
    };

    // ----- initialization ----------------------------------------------------
    // @TODO connect to right channel / room /namespace
    Remote.connection = io(Config.server);
    Remote.connection.on('connect', App.onConnect);
    Remote.connection.on('disconnect', App.onDisconnect);
    Remote.connection.on('cmd', App.handleCommand);

})(window);
