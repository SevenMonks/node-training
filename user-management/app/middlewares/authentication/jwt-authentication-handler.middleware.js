const jsonWebToken = require('jsonwebtoken'),
  passport = require('passport'),
  config = require('../../../config/config'),
  userModel = require('../../models/user/index.pgsql.model'),
  jwtAuthenticationService = require('../../services/authentication/jwt-authenticator.service');

const retrieveJwtPayload = request => {
  const authHeaderContent = request.get('Authorization');

  if ((!authHeaderContent) || (-1 === authHeaderContent.indexOf(' '))) {
    return null;
  }

  const token = authHeaderContent.split(' ').pop();

  return (!token) ? null : jsonWebToken.decode(token);
};

const sendUnauthorizedResponse = (request, response) => {
  response.status(config.app.http_status_codes.http_401_unauthorized);
  response.json({
    status: 'error',
    type: config.app.rest_error_codes.authentication_error,
    data: {
      message: 'User authentication failed'
    }
  });
};

const reviveUser = async (request, response, next, jwtPayload) => {
  try {
    const user = await userModel.fetchUserById(+jwtPayload.sub);

    if (0 === user.length) {
      return sendUnauthorizedResponse(request, response);
    }

    const currentTime = Math.floor(Date.now() / 1000);

    const token = jwtAuthenticationService.createJwt({
      sub: user[0].id,
      username: user[0].username,
      userFirstName: user[0].first_name,
      userLastName: user[0].last_name,
      iss: process.env.JWT_ISSUER,
      aud: process.env.JWT_AUDIENCE,
      iat: currentTime,
      exp: (currentTime + parseInt(process.env.JWT_EXPIRATION)),
      refreshTill: (currentTime + parseInt(process.env.JWT_REFRESH_EXPIRATION))
    });

    request.user = user[0];
    response.locals.token = token;

    return next();
  } catch (error) {
    return sendUnauthorizedResponse(request, response);
  }
};

module.exports = (request, response, next) => {
  const jwtPayload = retrieveJwtPayload(request);

  if (!jwtPayload) {
    return sendUnauthorizedResponse(request, response);
  }

  passport.authenticate('jwt', async (error, user, info) => {
    if (user) {
      if (user[0].is_deleted) {
        return sendUnauthorizedResponse(request, response);
      }

      request.user = user[0];

      return next();
    } else if (info && "TokenExpiredError" === info.name) {
      const currentTime = Math.floor(Date.now() / 1000);

      if (parseInt(jwtPayload.refreshTill) < currentTime) {
        return sendUnauthorizedResponse(request, response);
      } else {
        return await reviveUser(request, response, next, jwtPayload);
      }
    } else {
      return sendUnauthorizedResponse(request, response);
    }
  })(request, response, next);
};
