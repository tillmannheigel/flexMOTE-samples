var counter = 0;

/**
 * @public remote connection
 */
Remote.connection = io('http://localhost:3000');

/**
 * onConnect event handler
 */
Remote.connection.on('connect', function() {

    // register a channel
    Remote.join(null, function(room) {

        // generate qrcode
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
    });
});

/**
 * onDisconnect event handler
 */
Remote.connection.on('disconnect', function() {
    $('#qrcode').empty();
});

/**
 * onCommand event handler
 * @param {Object} cmd
 */
Remote.connection.on('cmd', function(cmd) {

    switch (cmd.action) {
        case 'set':
            switch (cmd.type) {
                case 'button':
                    if (cmd.data.state == 'pressed') {
                        counter += (cmd.id == 'plus' ? 1 : -1);
                        $('#counter').html(counter);
                    }
            }
            break;

        default:
            Remote.sendCommand('*', {
                action: 'set',
                type: 'layout',
                id: 'layout-1',
                data: {
                    name: 'Layout 1',
                    cols: 1,
                    rows: 3,
                    elements: [{
                        type: "Button",
                        label: "+",
                        id: "plus",
                    }, {}, {
                        type: "Button",
                        label: "-",
                        id: "minus",
                    }]
                }
            });
            break;
    }

});
