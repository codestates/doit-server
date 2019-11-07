'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userData = [
      {
        email: 'aaa@gmail.com',
        nick: 'aaa',
        password: await bcrypt.hash('aaa', 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'bbb@gmail.com',
        nick: 'bbb',
        password: await bcrypt.hash('bbb', 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'ccc@gmail.com',
        nick: 'ccc',
        password: await bcrypt.hash('ccc', 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await queryInterface.bulkInsert('users', userData, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  },
};
