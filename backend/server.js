import express from "express";
import bcrypt from "bcrypt";
import path from "path";

import connectDB from "./mongo.js";

import User from "./models/user.js";
import Organizer from "./models/organizer.js";
import Event from "./models/event.js";

const app = express();
app.use(express.json());

connectDB();

const __dirname = path.resolve();

// ---------------- API ROUTES ---------------- //

// User registration
app.post("/api/auth/register/user", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const allowedNames = ["artem", "valentin", "leonardo", "souman"];

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email and password required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ error: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      passwordHash,
      role: allowedNames.includes(name.toLowerCase()) ? "admin" : "user",
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: { _id: newUser._id, newUser },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Organizer registration
app.post("/api/auth/register/org", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
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
      !description ||
      !address ||
      !city ||
      !postalCode ||
      !idNumber ||
      !orgType
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (typeof name !== "string" || name.length < 2) {
      return res
        .status(400)
        .json({ error: "Name must be at least 2 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    if (description.length > 1000) {
      return res.status(400).json({ error: "Description too long" });
    }

    if (typeof postalCode !== "string" || postalCode.length < 3) {
      return res.status(400).json({ error: "Invalid postal code" });
    }

    const existingOrg = await Organizer.findOne({ email });
    if (existingOrg) {
      return res.status(409).json({ error: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newOrg = new Organizer({
      name,
      email,
      passwordHash,
      description,
      address,
      city,
      postalCode,
      idNumber,
      orgType,
    });

    await newOrg.save();

    res.status(201).json({
      message: "Organizer registered successfully",
      user: { _id: newOrg._id, ...newOrg.toObject(), passwordHash: undefined },
    });
  } catch (error) {
    console.error("Error registering organizer:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const user =
      (await User.findOne({ email })) || (await Organizer.findOne({ email }));
    if (!user) return res.status(404).json({ error: "User not found" });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return res.status(401).json({ error: "Invalid password" });

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "organizer",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Change password
app.put("/api/user/changePassword", async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    if (!email || !oldPassword || !newPassword)
      return res.status(400).json({ error: "Missing required fields" });

    const user =
      (await User.findOne({ email })) || (await Organizer.findOne({ email }));
    if (!user) return res.status(404).json({ error: "User not found" });

    const isValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isValid)
      return res.status(401).json({ error: "Old password incorrect" });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({}, "-passwordHash");
    const organizers = await Organizer.find({}, "-passwordHash");
    const allUsers = [...users, ...organizers];

    res
      .status(allUsers.length ? 200 : 404)
      .json(allUsers.length ? allUsers : { message: "No users found" });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Create event
app.post("/api/events", async (req, res) => {
  try {
    const {
      date,
      startTime,
      endTime,
      companyName,
      phone,
      title,
      address,
      eventType,
      maxCapacity,
      email,
      description,
      // website,
      // ticketUrl,
      imageUrl,
      organizer,
    } = req.body;

    if (!companyName || !title || !date || !startTime || !organizer) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newEvent = new Event({
      companyName,
      title,
      description,
      date,
      startTime,
      endTime,
      email,
      phone,
      address,
      maxCapacity,
      eventType,
      // website,
      // ticketUrl,
      imageUrl,
      organizer,
    });

    await newEvent.save();
    res
      .status(201)
      .json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update event
app.put("/api/events/:id", async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedEvent)
      return res.status(404).json({ error: "Event not found" });
    res.json({ message: "Event updated successfully", event: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete event
app.delete("/api/events/:id", async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent)
      return res.status(404).json({ error: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Getting all events
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find().populate("organizer");
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- SERVE FRONTEND ---------------- //
const buildPath = path.join(__dirname, "public");
app.use(express.static(buildPath));

app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) return next();
  if (req.path.match(/\.[^/]+$/)) return next();

  res.sendFile(path.join(buildPath, "index.html"), (err) => {
    if (err) res.status(500).send("Error loading page");
  });
});

// ---------------- HEALTH CHECK ---------------- //
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// ---------------- START SERVER ---------------- //
const PORT = process.env.PORT || 5234;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
