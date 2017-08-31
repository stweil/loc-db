/**
 * Created by anlausch on 5/18/2017.
 */
'use strict';
const passport = require('./../util/passport.js');
const User = require('./../models/user.js');
const bcrypt = require('bcrypt');
const errorlog = require('./../util/logger.js').errorlog;
const accesslog = require('./../util/logger.js').accesslog;

// Generates hash using bCrypt
var createHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

function findOrCreateUser(username, password, callback){
    // find a user in Mongo with provided username
    User.findOne({'username':username},function(err, user) {
        // In case of any error return
        if (err){
            errorlog.error(err);
            return callback(err, null)
        }
        // already exists
        if (user) {
            errorlog.error('User already exists');
            return callback(new Error("User already exists."), null);
        } else {
            // if there is no user with that email
            // create the user
            var newUser = new User();
            // set the user's local credentials
            newUser.username = username;
            newUser.password = createHash(password);

            // save the user
            newUser.save(function(err) {
                if (err){
                    errorlog.error(err);
                    return callback(err, null);
                }
                accesslog.log('User Registration successful');
                delete newUser._doc.password;
                return callback(null, newUser);
            });
        }
    });
};

function signup(req, res){
    var username = req.swagger.params.user.value.username;
    var password = req.swagger.params.user.value.password;
    var response = res;

    // Delay the execution of findOrCreateUser and execute
    // the method in the next tick of the event loop
    process.nextTick(function(){
        findOrCreateUser(username, password, function(err, res){
            if(err){
                errorlog.error(err);
                return response.status(400).json(err);
            }
            response.json(res);
        });
    });
}

function addFeed(req, res){
    var feed = req.swagger.params.feed.value;
    var response = res;
    var user = req.user;
    user.feeds.push(feed);
    User.findOneAndUpdate({'username': user.username}, user, {new: true}, function(err, res){
        if(err){
            errorlog.error(err);
            return response.status(500).json({"message":"Something went wrong with inserting the feed"});
        }else{
            return response.status(200).json(res);
        }
    });
}

function login(req, res){
    delete req.user._doc.password;
    res.json(req.user);
}

function logout(req, res){
    req.logout();
    res.json("User logged out successfully.")
}

module.exports = {
    signup: signup,
    login: login,
    logout: logout,
    findOrCreateUser: findOrCreateUser,
    addFeed: addFeed
};