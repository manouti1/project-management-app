'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('Projects', 'creatorId', {
        type: Sequelize.INTEGER,
        allowNull: true, // Temporarily allow nulls
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }, { transaction });

      const users = await queryInterface.sequelize.query('SELECT id from USERS', { transaction, type: queryInterface.sequelize.QueryTypes.SELECT });

      if (users.length > 0) {
        await queryInterface.sequelize.query(
          `UPDATE Projects SET creatorId = ${users[0].id}`,
          { transaction }
        );
      }

      await queryInterface.changeColumn('Projects', 'creatorId', {
        type: Sequelize.INTEGER,
        allowNull: false,
      }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('Projects', 'creatorId', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};