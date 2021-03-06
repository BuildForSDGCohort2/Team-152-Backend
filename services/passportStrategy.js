'use strict';

const { Strategy:JWTStrategy, ExtractJwt } = require('passport-jwt')

const models = require('../models')

// Hooks the JWT Strategy.
function hookJWTStrategy(passport) {
    var options = {};

    options.secretOrKey = process.env.APP_KEY;
    options.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
    options.ignoreExpiration = false;

    passport.use(new JWTStrategy(options, function(JWTPayload, callback) {
        models.User.findOne({ where: { phone: JWTPayload.email || JWTPayload.phone } })
            .then(function(user) {
                if(!user) {
                    callback(null, false);
                    return;
                }

                callback(null, user);
            });
    }));
}


module.exports = hookJWTStrategy;