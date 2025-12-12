module.exports = (sequelize, Sequelize) => {
  return sequelize.define("schedule", {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    time: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    date: {
      type: Sequelize.DATEONLY,
      allowNull: true,
    },
  });
};
