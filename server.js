'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const https = require('https');
const app = express();
const http = require('http').createServer(app);

const db = require('./database/db');
const searchRoute = require('./routes/searchRoute');
const passport = require('./utils/pass');
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


app.use('/cardSearch', searchRoute);
app.use('/user', userRoute);
app.use('/auth', authRoute);

http.listen(3000, () => {
    console.log('listening on port 3000');
});