'use strict';
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// local strategy for username password login
passport.use(new Strategy(
    async (username, password, done) => {
        try {
            const user = await userModel.findOne({username: username});
            console.log('Local strategy', user); // result is binary row
            if (user === undefined) {
                return done(null, false, {message: 'Incorrect username.'});
            }
            if (!await bcrypt.compare(password, user.password)) {
                return done(null, false, {message: 'Incorrect password.'});
            }
            delete user.password;
            // console.log('deleted pwd', user);
            const strippedUser = {
                _id: user._id,
                email: user.email,
                decks: user.decks,
            };
            return done(null, strippedUser, {message: 'Logged In Successfully'});
        }
        catch (err) {
            return done(err);
        }
    }));

// TODO: JWT strategy for handling bearer token
passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_A_S,
    },
    (jwtPayload, done) => {
        console.log('payload', jwtPayload);
        //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
        const user = userModel.findById(jwtPayload.id);
        console.log('pl user', user);
        if (user) {
            delete user.password;
            return done(null, user);
        } else {
            return done(null, false);
        }
    },
));

module.exports = passport;
