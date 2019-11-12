'use strict';

var pkg = require('./package.json');
module.exports = require('@root/greenlock').create({
  // name & version for ACME client user agent
  packageAgent: pkg.name + '/' + pkg.version,

  // contact for security and critical bug notices
  maintainerEmail: 'bfsudong@gmail.com',

  // where to find .greenlockrc and set default paths
  packageRoot: __dirname,
});
