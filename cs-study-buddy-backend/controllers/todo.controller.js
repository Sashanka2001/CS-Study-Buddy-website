const db = require("../models");
const Todo = db.todo;

exports.findAll = async (req, res) => {
  const where = {};
  if (req.query.listId) {
    where.listId = req.query.listId;
  }
  const data = await Todo.findAll({ where, order: [["createdAt", "ASC"]] });
  res.json(data);
};

exports.create = async (req, res) => {
  const { task, completed = false, listId = null } = req.body;
  if (!task || !task.trim()) {
    return res.status(400).json({ message: "Task text is required" });
  }
  const todo = await Todo.create({ task: task.trim(), completed, listId });
  res.json(todo);
};

exports.update = async (req, res) => {
  const { task, completed, listId } = req.body;
  const fieldsToUpdate = {};
  if (typeof task === "string") {
    fieldsToUpdate.task = task;
  }
  if (typeof completed === "boolean") {
    fieldsToUpdate.completed = completed;
  }
  if (typeof listId !== "undefined") {
    fieldsToUpdate.listId = listId;
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).json({ message: "No fields supplied" });
  }

  await Todo.update(fieldsToUpdate, { where: { id: req.params.id } });
  res.json({ message: "Updated" });
};

exports.delete = async (req, res) => {
  await Todo.destroy({ where: { id: req.params.id } });
  res.json({ message: "Deleted" });
};
