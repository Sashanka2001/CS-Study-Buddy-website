const router = require("express").Router();
const controller = require("../controllers/todo.controller");

router.get("/", controller.findAll);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;
