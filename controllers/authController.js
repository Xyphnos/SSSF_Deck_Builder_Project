'use strict';
const jwt = require('jsonwebtoken');
const passport = require('passport');

const login = (req, res) => {
    passport.authenticate('local', {session: false}, (err, user) => {
        if (err || !user) {
            console.log(req.body);
            return res.status(400).json({
                message: 'That aint right',
                user   : user
            });
        }
        req.login(user, {session: false}, (e) => {
            if (e) {
                res.send(e);
            }
            const token = jwt.sign(user, process.env.JWT_A_S);
            return res.json({user, token});
        });
    })(req, res);

};

const checkAuth = (req, res) => {
    passport.authenticate("jwt", { session: false }, (err, user) => {
        if(err || !user) {
            throw new Error("User not authenticated!");
        }
    })(req, res);
};


module.exports = {
    login,
    checkAuth,
};