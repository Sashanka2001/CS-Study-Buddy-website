const db = require("../models");
const List = db.list;
const Todo = db.todo;

exports.findAll = async (req, res) => {
  const lists = await List.findAll({
    order: [["createdAt", "ASC"]],
  });
  res.json(lists);
};

exports.create = async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ message: "List name is required" });
  }
  const list = await List.create({ name: name.trim() });
  res.json(list);
};

exports.update = async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ message: "List name is required" });
  }
  await List.update({ name: name.trim() }, { where: { id: req.params.id } });
  res.json({ message: "Updated" });
};

exports.delete = async (req, res) => {
  const list = await List.findByPk(req.params.id);
  if (!list) {
    return res.status(404).json({ message: "List not found" });
  }
  await list.destroy();
  res.json({ message: "Deleted" });
};
