const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');

const options = {
  key: fs.readFileSync('./cert/localhost-key.pem'),
  cert: fs.readFileSync('./cert/localhost.pem'),
};


const app = express();
app.use(express.static(__dirname));

https.createServer(options, app)
  .listen(3000)