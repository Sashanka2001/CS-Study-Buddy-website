module.exports = (sequelize, Sequelize) => {
  return sequelize.define("note", {
    note: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  });
};
