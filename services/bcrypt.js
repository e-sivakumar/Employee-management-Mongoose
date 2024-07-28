const bcrypt = require("bcrypt");
require("dotenv").config();

async function createHash(password) {
  
  const saltRounds = 10;

  return new Promise(async (resolve, reject) => {
    const salt = await bcrypt.genSalt(saltRounds);
    const has = await bcrypt.hash(password, salt);
    if (has) {
      resolve(has);
    } else {
      reject();
    }
  });
}

async function validatePassword(password, hash){
    return await bcrypt.compare(password, hash)
}

module.exports = { createHash, validatePassword };
