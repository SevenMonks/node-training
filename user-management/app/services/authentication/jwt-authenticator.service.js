const jsonWebToken = require('jsonwebtoken'),
  passportJWT = require('passport-jwt'),
  extractJWT = passportJWT.ExtractJwt,
  jwtStrategy = passportJWT.Strategy,
  userModel = require('../../models/user/index.pgsql.model'),
  jwtOptions = {
    secretOrKey: process.env.JWT_SECRET_KEY,
    jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
    algorithms: process.env.JWT_ENCRYPTION
  };

const createAuthenticationStrategy = () => {
  return new jwtStrategy(
    jwtOptions,
    async (jwtPayload, done) => {
      const jwtSubject = jwtPayload.sub.toString().replace(/^\s\s*/, '').replace(/\s\s*$/, '');

      try {
        const user = await userModel.fetchUserById(+jwtSubject);

        if (0 === user.length) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  );
};

const createJwt = jwtPayload => {
  let token = jsonWebToken.sign(
    jwtPayload,
    process.env.JWT_SECRET_KEY,
    {
      algorithm: process.env.JWT_ENCRYPTION
    }
  );

  return token;
};

module.exports = {
  createAuthenticationStrategy,
  createJwt
};
