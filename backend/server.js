const express = require("express");
const app = express();
const bcrypt = require("bcrypt");

app.use(express.json());

const users = [];

app.post("/api/auth/register/user", async (req, res) => {
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
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: hashedPassword,
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

app.post("/api/auth/register/org", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      // LogoValue,
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
      // !LogoValue ||
      !description ||
      !address ||
      !city ||
      !postalCode ||
      !idNumber ||
      !orgType
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    const newOrg = {
      name,
      email,
      password: hashedPassword,
      // LogoValue,
      description,
      address,
      city,
      postalCode,
      idNumber,
      orgType,
      role: "organizer",
    };

    users.push(newOrg);
    console.log("Organizer was registered");

    res.status(201).json({
      message: "Organizer registered successfully",
      user: { ...newOrg, password: undefined },
    });
  } catch (error) {
    console.error("Error with organizer registering " + error);
    res.status(500).json({
      error: "User not registered due to server error",
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const existingUser = users.find((user) => user.email === email);

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Server error during login" });
  }
});

// Forgot password (not ready yet)
app.post("/api/auth/forgotPassword", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }

  const existingUser = users.find((user) => user.email === email);

  if (!existingUser) {
    return res.status(404).json({ error: "User not found" });
  }
});

app.put("/api/user/changePassword", async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  if (!email || !oldPassword || !newPassword) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const existingUser = users.find((user) => user.email === email);

  if (!existingUser) {
    return res.status(404).json({ error: "User not found" });
  }

  existingUser.password = await bcrypt.hash(newPassword, 10);

  res.status(200).json({ message: "Password updated successfully" });
});

const PORT = 5234;
app.listen(PORT, () => {
  console.log(`Server work in port http://localhost:${PORT}`);
});
