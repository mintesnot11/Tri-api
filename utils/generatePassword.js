// Generate password
const generator = require("generate-password");

module.exports = () => {
  const password = generator.generate({
    length: 8,
    numbers: true,
    symbols: true,
  });
  return password;
};
