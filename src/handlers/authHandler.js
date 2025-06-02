const { verifyGoogleToken } = require('../utils/googleVerify');
const { generateJwt } = require('../utils/jwt');
const { getUserByEmail, createUser } = require('../models/usersModel');

const loginWithGoogle = async (request, h) => {
  const { idToken } = request.payload;

  if (!idToken) {
    return h
      .response({
        status: 'error',
        message: 'ID Token is required',
      })
      .code(400);
  }

  try {
    const payload = await verifyGoogleToken(idToken);

    const email = payload.email;
    const name = payload.name;
    const photo_url = payload.picture;

    let user = await getUserByEmail(email);
    if (!user) {
      user = await createUser({ email, name, photo_url });
    }

    let jwtToken;
    try {
      jwtToken = generateJwt({
        id: user.id,
        email: user.email,
        name: user.name,
        photo_url: user.photo_url,
      });
    } catch {
      return h.response({ status: 'error', message: 'Gagal membuat token' }).code(500);
    }

    const responsePayload = {
      status: 'success',
      message: 'Login successful',
      token: jwtToken,
    };
    return h.response(responsePayload).type('application/json').code(200);
  } catch {
    return h
      .response({ status: 'error', message: 'Login failed' })
      .type('application/json')
      .code(401);
  }
};

module.exports = { loginWithGoogle };
