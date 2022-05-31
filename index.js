const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const Stream = require("stream")
//const fs = require('fs')
const NetcatServer = require('netcat/server') 

const nc1 = new NetcatServer();
const nc2 = new NetcatServer();
const nc3 = new NetcatServer();
const stream1 = new Stream();
const stream2 = new Stream();
const stream3 = new Stream();

nc1.port(10001).k().serve(stream1).listen();
nc2.port(10002).k().serve(stream2).listen();
nc3.port(10003).k().serve(stream3).listen();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
// io.on('connection', (socket) => {
//     console.log('a user connected');
// });
io.on('connection', (socket) => {
    console.log('a user connected aa');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('deviceorientation', (msg) => {
        const data = msg.uid + "\t" + msg.body + "\n";
        stream1.emit("data", data)
        console.log("deviceorientation: ", msg.body);
        // fs.appendFile("./data/deviceorientation.tsv", data, (err) => {
        //     if (err) throw err;
        // });          
    });
    socket.on('acceleration', (msg) => {
        const data = msg.uid + "\t" + msg.body + "\n";
        stream2.emit("data", data)
        console.log("acceleration: ", msg.body);
        // fs.appendFile("./data/acceleration.tsv", data, (err) => {
        //     if (err) throw err;
        // });          
    });
    socket.on('accelerationIncludingGravity', (msg) => {
        const data = msg.uid + "\t" + msg.body + "\n";
        stream3.emit("data", data)
        console.log("accelerationIncludingGravity: ", msg.body);
        // fs.appendFile("./data/accelerationIncludingGravity.tsv", data, (err) => {
        //     if (err) throw err;
        // });          
    });    
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});