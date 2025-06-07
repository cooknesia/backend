const { verifyGoogleToken } = require('../utils/googleVerify');
const { generateJwt } = require('../utils/jwt');
const { getUserByEmail, createUser } = require('../models/usersModel');

const loginWithGoogle = async (request, h) => {
  const { token } = request.payload;

  try {
    // Verifikasi token Google
    const payload = await verifyGoogleToken(token);

    const email = payload.email;
    const name = payload.name;
    const photo_url = payload.picture;

    let user = await getUserByEmail(email);
    if (!user) {
      user = await createUser({ email, name, photo_url });
    }

    // Generate token JWT
    const jwtToken = generateJwt({
      id: user.id,
      email: user.email,
      name: user.name,
      photo_url: user.photo_url,
    });

    const responsePayload = {
      status: 'success',
      message: 'Login successful',
      token: jwtToken,
      data: user,
    };
    return h.response(responsePayload).type('application/json').code(200);
  } catch (err) {
    console.error(err);
    const errorPayload = {
      status: 'error',
      message: 'Login failed',
    };
    return h.response(errorPayload).type('application/json').code(401);
  }
};

module.exports = { loginWithGoogle };