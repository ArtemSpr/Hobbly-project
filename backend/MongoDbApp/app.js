require('dotenv').config();
const mongoose = require('mongoose');

// Define User schema & model
const userSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, default: '' },
  token: { type: String, default: null },
  isEmailConfirmed: { type: Boolean, default: false },
  role: { type: String, default: 'user' },
});

const User = mongoose.model('User', userSchema);

async function main() {
  const connectionString = process.env.MONGODB_URI;
  if (!connectionString) {
    console.error('Missing MONGODB_URI in .env file');
    process.exit(1);
  }

  try {
    await mongoose.connect(connectionString);
    console.log('MongoDB connected');

    // Insert a new user
    const newUser = new User({ name: 'Leonardo', email: 'leo@example.com' });
    await newUser.save();
    console.log('Inserted user with ID:', newUser._id);

    // Fetch all users
    const users = await User.find({});
    console.log('Users in database:');
    users.forEach(user => {
      console.log(`${user._id} - ${user.name} - ${user.email}`);
    });

  } catch (error) {
    console.error('MongoDB connection error:', error);
  } finally {
    // Close connection cleanly
    await mongoose.disconnect();
  }
}

main();
