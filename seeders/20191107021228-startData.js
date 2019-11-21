'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userData = [
      {
        email: 'aaa@gmail.com',
        nickname: 'aaa',
        password: await bcrypt.hash('aaa', 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'bbb@gmail.com',
        nickname: 'bbb',
        password: await bcrypt.hash('bbb', 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'ccc@gmail.com',
        nickname: 'ccc',
        password: await bcrypt.hash('ccc', 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await queryInterface.bulkInsert('users', userData, {});

    const todoData = [
      {
        id: 1,
        todoContent: 'doit todo api 설계',
        doneContent: 'doit todo api 설계 완료',
        duration: 25,
        startLocalDate: '2019-11-06',
        isComplete: true,
        createdAt: '2019-11-06 13:00:00',
        updatedAt: '2019-11-06 13:25:00',
        userId: 1,
      },
      {
        id: 2,
        todoContent: 'doit todo api 작성',
        doneContent: 'doit todo api 작성 완료',
        duration: 25,
        startLocalDate: '2019-11-06',
        isComplete: true,
        createdAt: '2019-11-07 14:00:02',
        updatedAt: '2019-11-07 14:55:02',
        userId: 2,
      },
      {
        id: 3,
        todoContent: 'doit user api 작성',
        doneContent: 'doit user api 작성 완료',
        duration: 30,
        startLocalDate: '2019-11-06',
        isComplete: true,
        createdAt: '2019-11-07 11:00:02',
        updatedAt: '2019-11-07 11:35:02',
        userId: 3,
      },
      {
        id: 4,
        todoContent: 'doit api 문서 작성',
        duration: 45,
        startLocalDate: '2019-11-06',
        isComplete: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 3,
      },
      {
        id: 5,
        todoContent: 'doit1',
        doneContent: 'doit1',
        duration: 30,
        startLocalDate: '2019-11-21',
        isComplete: true,
        createdAt: '2019-11-21 16:00:02',
        updatedAt: '2019-11-21 16:35:02',
        userId: 3,
      },
      {
        id: 6,
        todoContent: 'doit2',
        doneContent: 'doit2',
        duration: 30,
        startLocalDate: '2019-11-21',
        isComplete: true,
        createdAt: '2019-11-21 17:00:02',
        updatedAt: '2019-11-21 17:35:02',
        userId: 3,
      },
      {
        id: 7,
        todoContent: 'doit3',
        doneContent: 'doit3',
        duration: 30,
        startLocalDate: '2019-11-21',
        isComplete: true,
        createdAt: '2019-11-21 20:00:02',
        updatedAt: '2019-11-21 20:35:02',
        userId: 3,
      },
      {
        id: 8,
        todoContent: 'doit4',
        doneContent: 'doit4',
        duration: 30,
        startLocalDate: '2019-11-21',
        isComplete: true,
        createdAt: '2019-11-21 23:00:02',
        updatedAt: '2019-11-21 23:35:02',
        userId: 3,
      },
      {
        id: 9,
        todoContent: 'doit5',
        doneContent: 'doit5',
        duration: 30,
        startLocalDate: '2019-11-21',
        isComplete: true,
        createdAt: '2019-11-22 01:00:02',
        updatedAt: '2019-11-22 01:35:02',
        userId: 3,
      },
      {
        id: 10,
        todoContent: 'doit6',
        doneContent: 'doit6',
        duration: 30,
        startLocalDate: '2019-11-21',
        isComplete: true,
        createdAt: '2019-11-22 04:00:02',
        updatedAt: '2019-11-22 04:35:02',
        userId: 3,
      },
    ];
    await queryInterface.bulkInsert('todos', todoData, {});

    const timelineData = [
      {
        startedAt: '2019-11-06 13:00:00',
        endedAt: '2019-11-06 13:25:00',
        createdAt: new Date(),
        updatedAt: new Date(),
        todoId: 1,
      },
      {
        startedAt: '2019-11-07 14:00:02',
        endedAt: '2019-11-07 14:10:02',
        createdAt: new Date(),
        updatedAt: new Date(),
        todoId: 2,
      },
      {
        startedAt: '2019-11-07 14:30:02',
        endedAt: '2019-11-07 14:40:02',
        createdAt: new Date(),
        updatedAt: new Date(),
        todoId: 2,
      },
      {
        startedAt: '2019-11-07 14:50:02',
        endedAt: '2019-11-07 14:55:02',
        createdAt: new Date(),
        updatedAt: new Date(),
        todoId: 2,
      },
      {
        startedAt: '2019-11-07 11:00:02',
        endedAt: '2019-11-07 11:20:02',
        createdAt: new Date(),
        updatedAt: new Date(),
        todoId: 3,
      },
      {
        startedAt: '2019-11-07 11:25:02',
        endedAt: '2019-11-07 11:35:02',
        createdAt: new Date(),
        updatedAt: new Date(),
        todoId: 3,
      },
      {
        startedAt: '2019-11-07 10:25:02',
        createdAt: new Date(),
        updatedAt: new Date(),
        todoId: 4,
      },

      {
        startedAt: '2019-11-07 10:25:02',
        createdAt: new Date(),
        updatedAt: new Date(),
        todoId: 5,
      },
      {
        startedAt: '2019-11-07 10:25:02',
        createdAt: new Date(),
        updatedAt: new Date(),
        todoId: 6,
      },
      {
        startedAt: '2019-11-07 10:25:02',
        createdAt: new Date(),
        updatedAt: new Date(),
        todoId: 7,
      },
      {
        startedAt: '2019-11-07 10:25:02',
        createdAt: new Date(),
        updatedAt: new Date(),
        todoId: 8,
      },
      {
        startedAt: '2019-11-07 10:25:02',
        createdAt: new Date(),
        updatedAt: new Date(),
        todoId: 9,
      },
      {
        startedAt: '2019-11-07 10:25:02',
        createdAt: new Date(),
        updatedAt: new Date(),
        todoId: 10,
      },
    ];
    await queryInterface.bulkInsert('timelines', timelineData, {});

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
