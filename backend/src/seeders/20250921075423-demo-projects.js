'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Projects', [
      {
        name: 'Project 1',
        description: 'This is the first project.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Project 2',
        description: 'This is the second project.',
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
