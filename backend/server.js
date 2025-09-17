const express = require("express");
const app = express();

app.use(express.json());

const users = [];

app.post("/api/auth/register/user", (req, res) => {
  try {
    const { name, email, password } = req.body;
    const allowedNames = ["artem", "valentin", "leonardo", "souman"];

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email and password required" });
    }

    const exists = users.some((user) => user.email === email);
    if (exists) {
      return res.status(409).json({ error: "User already exists" });
    }

    const newUser = {
      name,
      email,
      password,
      role: allowedNames.includes(name.toLowerCase()) ? "admin" : "user",
    };

    users.push(newUser);

    console.log("User was registered:", newUser);

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error with user registering:", error);
    res.status(500).json({ error: "User not registered due to server error" });
  }
});

app.post("/api/auth/register/org", (req, res) => {
  try {
    const {
      name,
      email,
      password,
      logo,
      description,
      address,
      city,
      postalCode,
      idNumber,
      orgType,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !logo ||
      !description ||
      !address ||
      !city ||
      !postalCode ||
      !idNumber ||
      !orgType
    ) {
      return res.status(400).json({ error: "User infromation required " });
    }

    const newOrg = {
      name,
      email,
      password,
      logo,
      description,
      address,
      city,
      postalCode,
      idNumber,
      orgType,
      role: "organizator",
    };

    console.log("User was registered");

    res
      .status(201)
      .json({ message: "Organization registered successfully", user: newOrg });
  } catch (error) {
    console.error("Error with user registering " + error);
    res.status(500).json({
      error: "User not registered due to server error",
    });
  }
});

const PORT = 5234;
app.listen(PORT, () => {
  console.log(`Server work in port http://localhost:${PORT}`);
});
