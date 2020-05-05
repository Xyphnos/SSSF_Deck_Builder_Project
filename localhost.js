"use strict";

const httpPort = 3000;
const httpsPort = 8000;
const express = require("express");
const https = require("https");
const http = require("http");
const fs = require("fs");
const sslkey = fs.readFileSync('./cert/ssl-key.pem');
const sslcert = fs.readFileSync('./cert/ssl-cert.pem');
const options = {
    key: sslkey,
    cert: sslcert,
};
const app = express();


module.exports = (app, httpsPort, httpPort) => {
    https.createServer(options, app).listen(httpsPort);
    http.createServer((req, res) => {
        res.writeHead(301, { 'Location': `https://localhost:${httpsPort}${req.url}`});
        res.end();
    }).listen(httpPort);
};