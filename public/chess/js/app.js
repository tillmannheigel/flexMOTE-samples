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

    // ----- initialization ----------------------------------------------------
    Remote.connection = io('http://remote.cloudfolio.com');
    Config.currentSkin = 'skin-1';

    // ----- event handler -----------------------------------------------------
    /**
     * onConnect
     */
    Remote.connection.on('connect', function() {

        // register a channel
        Remote.join(null, function(room) {

            // generate qrcode
            $('#qrcode').empty();
            var qrcode = new QRCode("qrcode", {
                text: "http://remote.cloudfolio.com/#" + room.toString(),
                width: 256,
                height: 256,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

            // some info texts...
            var info = '<p><a target="_blank" href="http://remote.cloudfolio.com/#' + room + '">';
            info += 'remote.cloudfolio.com<br/>#<strong>' + room + '</strong></p>';
            $('#qrcode').append(info);
        });
    });

    /**
     * onDisconnect
     */
    Remote.connection.on('disconnect', function() {
        $('#qrcode').empty();
    });

    /**
     * defines the default handler for remote commands.
     * @param {Object} cmd
     */
    Remote.connection.on('cmd', function(cmd) {
        switch (cmd.type) {
            //case '...':
            // break;

            default:
                Remote.sendCommand('*', Config.skins[Config.currentSkin], function() {
                    Remote.sendCommand('*', Config.layouts['layout-1']);
                });
                break;
        }
    });

    /**
     * @param {Object} event
     */
    $('#button-skin-1').on('click', function(event) {
        Config.currentSkin = 'skin-1';
        $('body').attr('id', 'skin-1');
        Remote.sendCommand('*', Config.skins[Config.currentSkin]);
    });

    /**
     * @param {Object} event
     */
    $('#button-skin-2').on('click', function(event) {
        Config.currentSkin = 'skin-2';
        $('body').attr('id', 'skin-2');
        Remote.sendCommand('*', Config.skins[Config.currentSkin]);
    });

})(window);
