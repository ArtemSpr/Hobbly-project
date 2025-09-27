import express from "express";
import bcrypt from "bcrypt";
import path from "path";

const app = express();
app.use(express.json());

const __dirname = path.resolve();
const users = [];

// ---------------- API ROUTES ---------------- //

// User registration
app.post("/api/auth/register/user", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const allowedNames = ["artem", "valentin", "leonardo", "souman"];

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password required" });
    }

    if (users.some((u) => u.email === email)) {
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
    console.log("User registered:", newUser);

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Organizer registration
app.post("/api/auth/register/org", async (req, res) => {
  try {
    const { name, email, password, description, address, city, postalCode, idNumber, orgType } = req.body;

    if (!name || !email || !password || !description || !address || !city || !postalCode || !idNumber || !orgType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (users.find((u) => u.email === email)) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newOrg = {
      name,
      email,
      password: hashedPassword,
      description,
      address,
      city,
      postalCode,
      idNumber,
      orgType,
      role: "organizer",
    };

    users.push(newOrg);
    console.log("Organizer registered");

    res.status(201).json({ message: "Organizer registered successfully", user: { ...newOrg, password: undefined } });
  } catch (error) {
    console.error("Error registering organizer:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  const user = users.find((u) => u.email === email);
  if (!user) return res.status(404).json({ error: "User not found" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ error: "Invalid password" });

  res.status(200).json({ message: "Login successful", user: { name: user.name, email: user.email, role: user.role } });
});

// Change password
app.put("/api/user/changePassword", async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  if (!email || !oldPassword || !newPassword) return res.status(400).json({ error: "Missing required fields" });

  const user = users.find((u) => u.email === email);
  if (!user) return res.status(404).json({ error: "User not found" });

  const isValid = await bcrypt.compare(oldPassword, user.password);
  if (!isValid) return res.status(401).json({ error: "Old password incorrect" });

  user.password = await bcrypt.hash(newPassword, 10);
  res.status(200).json({ message: "Password updated successfully" });
});

// Get all users
app.get("/api/users", (req, res) => {
  const safeUsers = users.map(({ password, ...rest }) => rest);
  res.status(safeUsers.length ? 200 : 404).json(safeUsers.length ? safeUsers : { message: "No users found" });
});

// ---------------- SERVE FRONTEND ---------------- //
const buildPath = path.join(__dirname, "public");
app.use(express.static(buildPath));

// Catch-all to serve index.html for React routing - FIXED
app.get('/*', (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// ---------------- START SERVER ---------------- //
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
