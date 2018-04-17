const mongoose = require('mongoose');

const { exec } = mongoose.Query.prototype;

// REMINDER https://bit.ly/2qEmUkN
// Arrow function vs function declaration / expressions:
// Are they equivalent / exchangeable?
// Arrow functions and function declarations / expressions
// are not equivalent and cannot be replaced blindly.
// If the function you want to replace does not use this,
// arguments and is not called with new, then yes.
mongoose.Query.prototype.exec = async function execOverride(...args) {
  console.log('EXECUTING QUERY');
  const result = await exec.apply(this, args);
  return result;
};
