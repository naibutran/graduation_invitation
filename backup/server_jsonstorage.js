const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require("axios");
const router = express.Router();
var https = require('https');
const http = require('http');
var requestify = require('requestify');
import postgres from 'postgres'

const sql = postgres({ /* options */ }) // will use psql environment variables

export default sql

const app = express();
const port = process.env.PORT || 6969;
const SEAT_FILE_PATH = path.join(__dirname, 'seats.json');
const baseURL = 'https://api.jsonstorage.net/v1/json/a8ff864b-8651-45b6-8b64-f995cc89b3a6/cb384d1b-0c97-4e40-8428-c84e517b6f2c';
const hostURL = 'api.jsonstorage.net';
const pathURL = '/v1/json/a8ff864b-8651-45b6-8b64-f995cc89b3a6/cb384d1b-0c97-4e40-8428-c84e517b6f2c';
const apiKey = 'b319d76f-46ab-4da8-860e-8977305c28ff';
const path_api = '/v1/json/a8ff864b-8651-45b6-8b64-f995cc89b3a6/cb384d1b-0c97-4e40-8428-c84e517b6f2c?apiKey=%b319d76f-46ab-4da8-860e-8977305c28ff%';

// function getjson(){
//   const promise = axios.get(baseURL)
//   const dataPromise = promise.then((response) => response.data)
//   console.log(dataPromise );
//   // return JSON.parse(data)
// }

// async function getjson() {
//   const response = await axios.get(baseURL)
//   console.log(response.data);
//   return response.data
// }

// // getjson();

// function putjson(data){
//   axios.put(`${baseURL}?apiKey=${apiKey}`, data);
//   console.log("put");
// }

// const test = readSeatMap();
// putjson(test);

function getjson(){
  requestify.get(baseURL)
          .then(function(response) {
          response.getBody();
          return JSON.parse(response.body);
  }
);
}



// function putjson(json_file){
//   requestify.put('https://api.jsonstorage.net/v1/json/a8ff864b-8651-45b6-8b64-f995cc89b3a6/cb384d1b-0c97-4e40-8428-c84e517b6f2c?apiKey=%b319d76f-46ab-4da8-860e-8977305c28ff%', json_file).then(function(response) {
//     // Get the response body
//     response.getBody();
//     console.log("put");
//     console.log(response.getBody());
// });
// }

function putjson(data_json){
  // Define the options object
  const options = {
    method: 'PUT',
    hostname: hostURL,
    path: path_api,
    headers: {
      'Content-Type': 'application/json',
    }
  };

  // Define the body
  const body = JSON.stringify(data_json);

  // Create the request
  const req = http.request(options, (res) => {
    // Handle the response
    console.log(`Status code: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    let data = '';
    console.log('1');
    res.on('data', (chunk) => {
      // Concatenate the data chunks
      data += chunk;
    });
    console.log('2');
    console.log(data);
    res.on('end', () => {
      // Parse the data as JSON
      // console.log(data);
      data = JSON.parse(data);
      console.log(`Data: ${JSON.stringify(data)}`);
    });
  });
  console.log('3');
  // Handle the error
  req.on('error', (err) => {
    console.error(`Error: ${err.message}`);
  });
  console.log('4');
  // Write the body to the request
  req.write(body);

  // End the request
  req.end();
}

const test_json = readSeatMap();
// console.log(JSON.stringify(test_json));

putjson(test_json);

// Utility function to read the seat map from a file
function readSeatMap() {
  try {
    if (fs.existsSync(SEAT_FILE_PATH)) {
      const data = fs.readFileSync(SEAT_FILE_PATH, 'utf-8');
      if (data.trim() === '') {
        // If the file is empty, return the default seat map
        return Array(10).fill(null).map(() => Array(10).fill(null));
      }
      // console.log(JSON.parse(data));
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
