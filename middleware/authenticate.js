const tokenGeneration = require("./generateToken");
const bcrypt = require("bcrypt");

async function checkPassword(password, user) {
  try {
    const result = await bcrypt.compare(password, user.password);

    console.log("Decrypt result: ", result);
    if (result) {
      // logs the user in
      // generateAccessToken
      const token = tokenGeneration.generateAccessToken({
        email: user.email,
      });
      return token;
    } else {
      return null;
    }
  } catch (e) {
    console.log("An Error");
  }
}

module.exports = { checkPassword };
