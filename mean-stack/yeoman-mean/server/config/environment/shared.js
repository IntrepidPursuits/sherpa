'use strict';
/*eslint no-process-env:0*/

module.exports.default = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 9000,
    // List of user roles
  userRoles: ['guest', 'user', 'admin']
};
