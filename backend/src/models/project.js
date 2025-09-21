'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      // A project belongs to one user (the creator)
      Project.belongsTo(models.User, {
        foreignKey: 'creatorId',
        as: 'creator',
      });
      // A project can have many tasks
      Project.hasMany(models.Task, {
        foreignKey: 'project_id',
        as: 'tasks',
      });
    }
  }
  Project.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Project',
  });
  return Project;
};