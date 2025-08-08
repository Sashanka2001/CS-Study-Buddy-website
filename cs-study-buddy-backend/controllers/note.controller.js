const db = require("../models");
const Note = db.note;

exports.findAll = async (req, res) => {
  const data = await Note.findAll();
  res.json(data);
};

exports.create = async (req, res) => {
  const note = await Note.create({ note: req.body.note });
  res.json(note);
};

exports.update = async (req, res) => {
  await Note.update({ note: req.body.note }, { where: { id: req.params.id } });
  res.json({ message: "Updated" });
};

exports.delete = async (req, res) => {
  await Note.destroy({ where: { id: req.params.id } });
  res.json({ message: "Deleted" });
};
