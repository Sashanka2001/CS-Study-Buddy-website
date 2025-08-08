const db = require("../models");
const Todo = db.todo;

exports.findAll = async (req, res) => {
  const data = await Todo.findAll();
  res.json(data);
};

exports.create = async (req, res) => {
  const task = await Todo.create({ task: req.body.task });
  res.json(task);
};

exports.update = async (req, res) => {
  await Todo.update({ task: req.body.task }, { where: { id: req.params.id } });
  res.json({ message: "Updated" });
};

exports.delete = async (req, res) => {
  await Todo.destroy({ where: { id: req.params.id } });
  res.json({ message: "Deleted" });
};
