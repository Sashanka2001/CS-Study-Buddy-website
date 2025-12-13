module.exports = (sequelize, Sequelize) => {
  return sequelize.define("list", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
};
