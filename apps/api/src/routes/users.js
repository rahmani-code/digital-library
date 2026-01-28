const { error } = require("node:console");
const express = require("express");
const fs = require("node:fs");
const router = express.Router();
const users = require("../data/users.json");

const filePath = "./data/library.json";

const readData = () => {
  const data = fs.readFileSync(filePath, "utf-8");
  console.log(data); // Check the structure of the data
  return JSON.parse(data); // Ensure this returns the correct structure
};
const writeData = (data) =>
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

// All users
router.get("/", (req, res) => {
  const data = readData();
  res.json(data.users || []);
});

// new user
router.post("/", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required." });
  }

  const data = readData();
  data.users = data.users || [];
  const newUser = {
    id:
      data.users.length > 0 ? Math.max(...data.users.map((u) => u.id)) + 1 : 1,
    name,
    email,
    password,
  };
  data.users.push(newUser);

  writeData(data);
  res.status(201).json(newUser);
});

// update user information

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const data = readData();
  const user = data.users.find((u) => u.id === Number.parseInt(id));

  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  if (name) user.name = name;
  if (email) user.email = email;

  writeData(data);
  res.json(user);
});

// delete useer

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const data = readData();
  const filteredUsers = data.users.filter((u) => u.id !== Number.parseInt(id));

  if (data.users.length === filteredUsers.length) {
    return res.status(404).json({ error: "User not found" });
  }

  data.users = filteredUsers;
  writeData(data);
  res.status(204).send();
});

// user login
router.post("/login", (req, res) => {
  const { name, password } = req.body;
  const data = readData(); // Read the data from the JSON file
  const user = data.users.find(
    (u) => u.name === name && u.password === password
  ); // Access users from data

  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({ error: "Invalid username or password" });
  }
});

module.exports = router;
