$('body').append('<p>Attempting to connect to flexMOTE server....</p>');

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
        var info = '<p><a href="http://localhost:3000/#' + room + '">';
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

    $('body').append('<p>User connected, send "Hello World!"....</p>');

    // no further checks, just send "Hello World!"
    Remote.sendCommand('*', {
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
    });
});
