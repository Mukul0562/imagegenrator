// backend.js
const express = require('express');
const { GoogleGenAI, Modality } = require('@google/genai');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // Import the database connection
const leadroutes = require('./routes/leadRoutes'); // Import routes if you have any

// Load environment variables from .env file
dotenv.config();

const app = express();

const PORT = 5000;



// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors({
  origin: 'https://image-generation-wmtu.vercel.app', // Allow requests from the React frontend
  methods: ['GET', 'POST'], // Allow specific HTTP methods
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
})); // Enable CORS for all routes
// Initialize Google GenAI with API Key from environment variables

connectDB(); // Connect to MongoDB

app.use('/api/leads', leadroutes); // ✅ Now /api/leads is registered


const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY, // Using the API key from the .env file
});

app.post('/generate-image', async (req, res) => {
  const { prompt } = req.body;

  try {
    // Generate image based on the prompt
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-preview-image-generation',
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    // Get the image data from the response
    const imageData = response.candidates[0].content.parts.find(part => part.inlineData)?.inlineData.data;

    if (!imageData) {
      return res.status(500).json({ error: 'Image generation failed' });
    }

    // Send the image back as base64
    res.json({ image: imageData });
  } catch (error) {
    console.error('Error during image generation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the backend server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
