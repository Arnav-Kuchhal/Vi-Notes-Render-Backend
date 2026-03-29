const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Session = require('./models/Session');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

// Save session endpoint
app.post('/api/session/save', async (req, res) => {
  console.log('Received save request body:', JSON.stringify(req.body, null, 2));
  try {
    const { content, keystrokes, stats } = req.body;
    if (!content) {
      console.warn('Save request missing content');
      return res.status(400).json({ error: 'Content is required' });
    }
    const newSession = new Session({
      content,
      keystrokes: keystrokes || [],
      stats: stats || { pasteCount: 0, backspaceCount: 0 }
    });
    await newSession.save();
    console.log('Session saved successfully:', newSession._id);
    res.status(201).json({ message: 'Session saved successfully', sessionId: newSession._id });
  } catch (err) {
    console.error('Error saving session:', err.message);
    res.status(500).json({ error: 'Failed to save session: ' + err.message });
  }
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vinotes';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
