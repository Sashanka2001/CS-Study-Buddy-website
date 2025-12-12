const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.todo = require("./todo.model.js")(sequelize, Sequelize);
db.note = require("./note.model.js")(sequelize, Sequelize);
db.schedule = require("./schedule.model.js")(sequelize, Sequelize);
db.list = require("./list.model.js")(sequelize, Sequelize);

db.list.hasMany(db.todo, {
  foreignKey: "listId",
  as: "todos",
  onDelete: "CASCADE",
});
db.todo.belongsTo(db.list, { foreignKey: "listId", as: "list" });

module.exports = db;
