require("dotenv").config();

const express = require("express");
const cors = require("cors");

const eventRoutes = require("./routes/events");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ErrorLens API is running");
});

app.use("/events", eventRoutes);
app.use("/auth", authRoutes);

const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;