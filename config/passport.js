const OIDCStrategy = require('passport-azure-ad').OIDCStrategy // require strategy
const mongoose = require('mongoose') // access to mongoose in case we need it
const config = require('../config/config') // ask for config file to get secrets
const User = require('../models/User') // talk to db

module.exports = function (passport) {
    passport.use(
        new OIDCStrategy({
            identityMetadata: config.creds.identityMetadata,
            clientID: config.creds.clientID,
            responseType: config.creds.responseType,
            responseMode: config.creds.responseMode,
            redirectUrl: config.creds.redirectUrl,
            allowHttpForRedirectUrl: config.creds.allowHttpForRedirectUrl,
            clientSecret: config.creds.clientSecret,
            validateIssuer: config.creds.validateIssuer,
            isB2C: config.creds.isB2C,
            issuer: config.creds.issuer,
            passReqToCallback: config.creds.passReqToCallback,
            scope: config.creds.scope,
            loggingLevel: config.creds.loggingLevel,
            nonceLifetime: config.creds.nonceLifetime,
            nonceMaxAmount: config.creds.nonceMaxAmount,
            useCookieInsteadOfSession: config.creds.useCookieInsteadOfSession,
            cookieEncryptionKeys: config.creds.cookieEncryptionKeys,
            clockSkew: config.creds.clockSkew,
        },
        async (accessToken, refreshToken, profile, done) => { //create a new user
            console.log('auth: ', profile)
            const newUser = {
                microsoftId: profile.oid,
                displayName: profile.displayName,
            }

            try {
                let user = await User.findOne({ microsoftId: profile.oid }) // trying to see if there is a match in DB

                if (user) {
                    done(null, user)
                } else {
                    user = await User.create(newUser) // create a new user with user model
                    done(null, user)
                }
            } catch (err) {
                console.log(err)
            }
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
    })
}