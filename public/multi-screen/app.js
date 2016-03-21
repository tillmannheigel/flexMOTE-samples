// ----- flexMOTE config -------------------------------------------------------
/**
 * @public remote connection
 */
flexMOTE.connection = io('http://localhost:3000');

/**
 * onConnect event handler
 */
flexMOTE.connection.on('connect', function() {

    // register a channel
    flexMOTE.register({
        app: 'hello-world',
        room: '12345',
        secret: 'mysecret',
        version: '0.1.0',
        maxUsers: 4,
        timeout: -1, // 10 seconds
        stickySessions: false
    }, function(status, room) {

        // generate qrcode
        if ($('#qrcode').length) {
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
        }
    });
});

/**
 * onDisconnect event handler
 */
flexMOTE.connection.on('disconnect', function() {
    $('#qrcode').empty();
});

/**
 * onCommand event handler
 * @param {Object} cmd
 */
flexMOTE.connection.on('cmd', function(cmd) {

    switch (cmd.action) {
        case 'set':

            switch (cmd.type) {
                case 'button':
                    if (cmd.data.state == 'pressed' && cmd.id == 'play' && $('video').length) {
                        $('video')[0].play();
                        flexMOTE.sendCommand('*', {
                            action: 'set',
                            type: 'layout',
                            id: 'layout-2',
                            data: {
                                name: 'Layout 2',
                                cols: 1,
                                rows: 3,
                                elements: [{
                                    type: "Button",
                                    label: "[ ]",
                                    id: "stop",
                                }]
                            }
                        });
                    }

                    if (cmd.data.state == 'pressed' && cmd.id == 'stop' && $('video').length) {
                        $('video')[0].pause();
                        flexMOTE.sendCommand('*', {
                            action: 'set',
                            type: 'layout',
                            id: 'layout-1'
                        });
                    }
                    break;

                case 'user':
                    flexMOTE.sendCommand('*', {
                        action: 'set',
                        type: 'layout',
                        id: 'layout-1',
                        data: {
                            name: 'Layout 1',
                            cols: 1,
                            rows: 3,
                            elements: [{
                                type: "Button",
                                label: ">",
                                id: "play",
                            }]
                        }
                    });
                    break;
            }
    }

});
