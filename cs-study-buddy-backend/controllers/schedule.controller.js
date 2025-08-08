const db = require("../models");
const Schedule = db.schedule;

exports.findAll = async (req, res) => {
  const data = await Schedule.findAll();
  res.json(data);
};

exports.create = async (req, res) => {
  const { title, time } = req.body;
  const event = await Schedule.create({ title, time });
  res.json(event);
};

exports.update = async (req, res) => {
  const { title, time } = req.body;
  await Schedule.update({ title, time }, { where: { id: req.params.id } });
  res.json({ message: "Updated" });
};

exports.delete = async (req, res) => {
  await Schedule.destroy({ where: { id: req.params.id } });
  res.json({ message: "Deleted" });
};
