;(function(window) {
    "use strict";

    // ----- dependencies ------------------------------------------------------
    if (!window.flexMOTE) {
        throw Error("requires flexMOTE.js!");
    }

    if (!window.Config) {
        throw Error("requires config.js");
    }

    var flexMOTE = window.flexMOTE;
    var Config = window.Config;

    // ----- application -------------------------------------------------------
    /**
     *
     */
    var app = window.app = {};

    /**
     *
     */
    app.user = null;

    /**
     *
     */
    app.userTimeout = null;

    /**
     *
     */
    app.room = null;

    /**
     * defines the default handler for remote commands.
     * @param {Object} cmd
     */
    app.onCommand = function(cmd) {
        console.log('app | onCommand:', cmd.type);

        // valid commands for connected user
        if (app.user && app.user.id) {
            clearInterval(app.userTimeout);
            app.userTimeout = setInterval(app.onUserTimeout, 5000);
            switch (cmd.type) {
                case 'skin':
                case 'layout':
                case 'button':
                    flexMOTE.onCommand(cmd);
                    break;
            }
        }

        // handle users (app specific, in this case we only have one user)
        switch (cmd.type) {
            case 'user':
                switch (cmd.action) {
                    case 'set':
                        if (!cmd.data && app.user && app.user.id == cmd.id) {
                            app.onUserTimeout();
                        }

                        if (cmd.data && (!app.user || app.user.id == cmd.id)) {
                            app.user = cmd;
                            $('#user').html(cmd.id).show();
                            flexMOTE.sendCommand(app.user.id, Config.skins['skin-1'], function() {
                                flexMOTE.sendCommand(app.user.id, Config.layouts['layout-1']);
                            });
                            app.userTimeout = setInterval(app.onUserTimeout, 5000);
                        }
                        break;
                }
        }
    };

    /**
     *
     */
    app.onUserTimeout = function() {
        clearInterval(app.userTimeout);
        console.log('app | onUserTimeout');
        app.user = null;
        $('#user').empty().hide();
    };

    /**
     *
     */
    app.onConnect = function() {
        console.log('app | onConnect');

        $('body').append('<p>Attempting to connect to flexMOTE server....</p>');

        flexMOTE.register({
            app: 'test-runner',
            version: '0.1.0',
            maxUsers: 1,
            timeout: 5 * 1000, // 5 seconds
            stickySessions: true
        }, function(status, room) {

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

            app.room = room;
        });
    };

    /**
     *
     */
    app.onDisconnect = function() {
        console.log('app | onDisconnect');
        $('body').append('<p>Disconnected from flexMOTE server. Trying to reconnect...</p>');
    };

    // ----- initialization ----------------------------------------------------
    flexMOTE.connection = io(Config.server);
    flexMOTE.connection.on('connect', app.onConnect);
    flexMOTE.connection.on('disconnect', app.onDisconnect);
    flexMOTE.connection.on('cmd', app.onCommand);

})(window);
