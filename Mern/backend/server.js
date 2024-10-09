require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const authMiddleware = require('./middleware/auth');
const User = require('./models/User');

const app = express();
app.use(express.json());

const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000'  // Allow your frontend's URL
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

// User registration
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10)
    });

    await user.save();

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// User login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Protected route to generate questions
app.post('/api/generate-questions', authMiddleware, async (req, res) => {
  const { topic, file, question_type, number_questions } = req.body;

  try {
    // Make a request to FastAPI for question generation
    const response = await axios.post(`${process.env.FASTAPI_URL}/generate-questions`, {
      topic,
      file,
      question_type,
      number_questions
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating questions');
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0',() => console.log(`Server started on port ${PORT}`));
