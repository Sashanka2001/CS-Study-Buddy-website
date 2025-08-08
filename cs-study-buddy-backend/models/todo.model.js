module.exports = (sequelize, Sequelize) => {
  return sequelize.define("todo", {
    task: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
};
