'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Tasks', [
      {
        title: 'Task 1 for Project 1',
        status: 'todo',
        due_date: new Date(),
        project_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Task 2 for Project 1',
        status: 'in_progress',
        due_date: new Date(),
        project_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Task 1 for Project 2',
        status: 'done',
        due_date: new Date(),
        project_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
