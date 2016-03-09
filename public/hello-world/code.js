// debug output
$('body').append('<p>Attempting to connect to flexMOTE server....</p>');

/**
 * sample layout, containing a "Hello World!"
 */
var layout = {
    action: 'set',
    type: 'layout',
    id: 'layout-1',
    data: {
        name: 'Layout 1',
        cols: 3,
        rows: 3,
        elements: [
        // first row
        {
            type: "Text",
            content: "Hello World!",
            cols: 3
        },
        // second row
        {
            cols: 3
        },
        // third row
        {

            cols: 3
        }]
    }
};

/**
 * @public remote connection
 */
Remote.connection = io('http://localhost:3000');

/**
 * onConnect event handler
 */
Remote.connection.on('connect', function() {
    $('body').append('<p>Connection established, register a channel....</p>');

    // register a channel
    Remote.register({
        app: 'hello-world',
        version: '0.1.0',
        maxUsers: -1,
        timeout: 5000,
        stickySessions: false
    }, function(room) {

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
        $('body').append('<p>Joined room: ' + room + '</p>');
        $('#qrcode').append(info);
    });
});

/**
 * onDisconnect event handler
 */
Remote.connection.on('disconnect', function() {
    $('body').append('<p>Disconnected from flexMOTE server. Trying to reconnect...</p>');
    $('#qrcode').empty();
});

/**
 * onCommand event handler
 * @param {Object} cmd
 */
Remote.connection.on('cmd', function(cmd) {
    $('body').append('<p>Command received:' + JSON.stringify(cmd));

    switch (cmd.action) {
        case 'set':
            switch (cmd.type) {
                case 'user':
                    if (cmd.data && cmd.data.connected) {
                        $('body').append('<p>User connected, send "Hello World!"....</p>');
                        Remote.sendCommand('*', layout);
                    }
                    break;
            }
            break;
    }
});
