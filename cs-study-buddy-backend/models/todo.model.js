module.exports = (sequelize, Sequelize) => {
  return sequelize.define("todo", {
    task: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    completed: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    listId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  });
};
