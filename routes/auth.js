const express = require('express')
const passport = require('passport')
const config = require('../config/config')
const router = express.Router()

// after people log in, what do you want them to do
router.get('/login',
    function(req, res, next) {
        passport.authenticate('azuread-openidconnect',
            {
                response: res,
                resourceURL: config.resourceURL,
                customState: 'my_state',
                failureRedirect: '/'
            }
        )(req, res, next);
    },
    function(req, res) {
        console.log('Login was called in the Sample');
        res.redirect('/todos');
    }
);

router.get('/openid/return',
    function(req, res, next) {
        passport.authenticate('azuread-openidconnect',
            {
                response: res,
                failureRedirect: '/'
            }
        )(req, res, next);
    },
    function(req, res) {
        console.log('We received a return from AzureAD.');
        res.redirect('/todos');
    }
);

router.post('/openid/return',
    function(req, res, next) {
        passport.authenticate('azuread-openidconnect',
            {
                response: res,
                failureRedirect: '/'
            }
        )(req, res, next);
    },
    function(req, res) {
        console.log('We received a return from AzureAD.');
        res.redirect('/todos');
    }
);

router.get('/logout', function(req, res, next){
    req.session.destroy((err) => {
      req.logOut((err) => {
        if (err) {
          return next(err);
        }
      });
      res.redirect(config.destroySessionUrl);
    });
});

module.exports = router