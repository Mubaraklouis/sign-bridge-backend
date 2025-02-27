const express = require("express");
const app = express();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  const message = "Hello World";
  res.send(message);
});

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
