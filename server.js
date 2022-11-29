const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const {
  getTotalUsers,
  signIn,
  register,
  getProfileById,
  incrementEntries,
  handleApiCall
} = require("./controllers");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/", getTotalUsers);
app.post("/signin", signIn);
app.post("/register", register);
app.post("/profile/:id", getProfileById);
app.put("/image", incrementEntries);
app.post("/imageUrl", handleApiCall);

app.listen(3000, () => {
  console.log(`Server is up and listening on port 3000`);
});
