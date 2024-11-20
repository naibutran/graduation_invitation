const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Danh sách ghế ngồi
let seatMap = Array(10).fill(null).map(() => Array(10).fill(null));

app.use(cors());
app.use(bodyParser.json());

// API lấy danh sách ghế ngồi
app.get('/api/seats', (req, res) => {
  res.json(seatMap);
});

// API ghi nhận tham dự
app.post('/api/attend', (req, res) => {
  const { name } = req.body;
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      if (!seatMap[row][col]) {
        seatMap[row][col] = name;
        return res.json({ success: true, row, col });
      }
    }
  }
  res.json({ success: false, message: "Hết chỗ ngồi!" });
});

app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
