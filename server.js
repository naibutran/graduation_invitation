const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3030;

// Danh sách ghế ngồi
let seatMap = Array(10).fill(null).map(() => Array(10).fill(null));

const path = require('path')
app.use('/static', express.static(path.join(__dirname, 'public')))

app.use(cors());
app.use(bodyParser.json());

// API lấy danh sách ghế ngồi
app.get('/api/seats', (req, res) => {
  res.json(seatMap);
});

// API ghi nhận tham dự
app.post('/api/attend', (req, res) => {
//   const { name } = req.body;
//   const { type } = req.body;
//   console.log(type);
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      if (!seatMap[row][col]) {
        seatMap[row][col] = req.body;
        return res.json({ success: true, row, col, type: "occupied" });
      }
    }
  }
  res.json({ success: false, message: "Hết chỗ ngồi!" });
});

// Cập nhật API cho "Will not attend" (chỉ thay đổi màu ghế)
app.post('/api/decline', (req, res) => {
    // const { name } = req.body;
    // const { type } = req.body;
    // console.log(type);
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        if (!seatMap[row][col]) {
            // console.log("riel");
          seatMap[row][col] = req.body;
          return res.json({ success: true, row, col, type: "decline" });
        }
      }
    }
    res.json({ success: false, message: "Hết chỗ ngồi!" });
  });

  app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
  });  