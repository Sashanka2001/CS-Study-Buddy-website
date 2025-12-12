const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./models");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/todos", require("./routes/todo.routes"));
app.use("/api/notes", require("./routes/note.routes"));
app.use("/api/schedule", require("./routes/schedule.routes"));

db.sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
