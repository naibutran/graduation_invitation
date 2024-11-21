const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 6969;
const SEAT_FILE_PATH = path.join(__dirname, 'seats.json');

// Utility function to read the seat map from a file
function readSeatMap() {
  try {
    if (fs.existsSync(SEAT_FILE_PATH)) {
      const data = fs.readFileSync(SEAT_FILE_PATH, 'utf-8');
      if (data.trim() === '') {
        // If the file is empty, return the default seat map
        return Array(10).fill(null).map(() => Array(10).fill(null));
      }
      return JSON.parse(data); // Try parsing the JSON file
    } else {
      // Return default seat map if the file doesn't exist
      return Array(10).fill(null).map(() => Array(10).fill(null));
    }
  } catch (err) {
    console.error('Error reading or parsing seat map file:', err);
    // Return default seat map in case of an error
    return Array(10).fill(null).map(() => Array(10).fill(null));
  }
}

// Utility function to save the seat map to a file
function saveSeatMap(seatMap) {
  try {
    fs.writeFileSync(SEAT_FILE_PATH, JSON.stringify(seatMap, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving seat map to file:', err);
  }
}

// Load the initial seat map from the file
let seatMap = readSeatMap();

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.json());

// API to get the list of seats
app.get('/api/seats', (req, res) => {
  seatMap = readSeatMap(); // Always fetch the current state of seatMap
  res.json(seatMap);
});

// API to mark attendance (reserve a seat)
app.post('/api/attend', (req, res) => {
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      if (!seatMap[row][col]) {
        seatMap[row][col] = req.body;
        saveSeatMap(seatMap); // Save the updated seat map
        return res.json({ success: true, row, col, type: 'occupied' });
      }
    }
  }
  res.json({ success: false, message: 'No seats available!' });
});

// API to mark decline (indicating a seat is not attended)
app.post('/api/decline', (req, res) => {
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      if (!seatMap[row][col]) {
        seatMap[row][col] = req.body;
        saveSeatMap(seatMap); // Save the updated seat map
        return res.json({ success: true, row, col, type: 'decline' });
      }
    }
  }
  res.json({ success: false, message: 'No seats available!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
