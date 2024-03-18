// Implement authentication logic that check for JWT token with passport in the request header
// If token is valid, set the user object in the request object and call next()
// If token is invalid, return 401 status code
//
//

const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/member');
const { Strategy, ExtractJwt } = require('passport-jwt');
const config = require('../config');

const JWT_SECRET = config.secretKey;

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
    };

const jwtStrategy = new Strategy(jwtOptions, async (payload, done) => {
    console.log({payload})
    const user = await User.findById(payload._id);
    if (user) {
        done(null, user);
    } else {
        done(null, false);
    }
}
);

passport.use(jwtStrategy);

const authenticate = passport.authenticate('jwt', { session: false });
exports.getToken = (user) => {
    return jwt.sign(user, JWT_SECRET, { expiresIn: 3600 });
}
module.exports = authenticate;



