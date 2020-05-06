'use strict';

//required stuff
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').createServer(app);
const graphQlHttp = require('express-graphql');

//routes
const passport = require('./utils/pass');
const db = require('./database/db');
const schema = require('./schema/schema');
const searchRoute = require('./routes/searchRoute');
const authRoute = require('./routes/authRoute');
const profileRoute = require('./routes/profileRoute');
const modRoute = require('./routes/modRoute');
const singleRoute = require('./routes/singleRoute');

//app uses
app.use(cors());
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.json());
app.use('/public',express.static('public'));
app.use(express.urlencoded({ extended: true }));


//route uses
app.use('/cardSearch', searchRoute);
app.use('/auth', authRoute);
app.use('/profile', profileRoute);
app.use('/modify', modRoute);
app.use('/single', singleRoute);

app.use('/graphql', (req, res) => {
    graphQlHttp({
        schema,
        graphiql: true,
        context: {req, res}})
    (req, res);
});

http.listen(3000, () => {
    console.log('listening on port 3000');
});