'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const https = require('https');
const app = express();
const http = require('http').createServer(app);
const route1 = require('./routes/testroute');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/cardSearch', route1);

http.listen(3000, () => {
    console.log('listening on port 3000');
});