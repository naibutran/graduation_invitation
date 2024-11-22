const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 6969;

// Cấu hình kết nối PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:OeRDbfrA0fyslIx62xNYe5iGduzasyUZ@dpg-ct00lhq3esus7384kc0g-a.oregon-postgres.render.com/db_ifov',
  ssl: {
    rejectUnauthorized: false, // Cần thiết cho Render
  },
});

// Khởi tạo bảng nếu chưa tồn tại
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS seats (
        id SERIAL PRIMARY KEY,
        row INT NOT NULL,
        col INT NOT NULL,
        name TEXT,
        type TEXT
      )
    `);
    console.log('Database initialized.');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
})();

// function get_full(){
//   pool.connect()
//     .then(() => {
//       console.log('Connected to PostgreSQL!');
      
//       // Truy vấn lấy tất cả dữ liệu từ bảng
//       return pool.query('SELECT * FROM seats');
//     })
//     .then(res => {
//       console.log('Data from the database:', res.rows);
//       return res.rows;
//       // pool.end(); // Đóng kết nối sau khi lấy xong dữ liệu
//     })
//     .catch(err => {
//       console.error('Error connecting to the database', err.stack);
//       // pool.end();
//     });
// }

async function get_full() {
  try {
    const client = await pool.connect();  // Kết nối với cơ sở dữ liệu
    console.log('Connected to PostgreSQL!');
    
    // Truy vấn lấy tất cả dữ liệu từ bảng seats
    const res = await client.query('SELECT * FROM seats');
    // console.log('Data from the database:', res.rows);
    // console.log(res.rows[0].name);
    console.log("Data is pulled");
    
    // Trả về kết quả là mảng dữ liệu từ bảng
    return res.rows;
  } catch (err) {
    console.error('Error connecting to the database', err.stack);
  }
}

function put_seat(name, type){
  (async () => {
    try {
      // Dữ liệu mẫu để chèn
      const row = 1;   // Ví dụ: hàng 1
      const col = 1;   // Ví dụ: cột 1
  
      // Chèn dữ liệu vào bảng seats
      const res = await pool.query(
        'INSERT INTO seats (row, col, name, type) VALUES ($1, $2, $3, $4) RETURNING id',
        [row, col, name, type]  // Truyền giá trị vào câu truy vấn
      );
  
      // In ra id của mẫu dữ liệu đã thêm
      console.log('New seat added with ID:', res.rows[0].id);
  
    } catch (err) {
      console.error('Error inserting data:', err);
    }
  })();
}

function delete_data(){
  pool.connect()
  .then(() => {
    console.log('Connected to PostgreSQL!');
  });

  (async () => {
    try {
      console.log('Truncating');
      const res = await pool.query('TRUNCATE seats RESTART IDENTITY');
  
      console.log('All data in the "seats" table has been truncated and ID counter reset.');
      
    } catch (err) {
      console.error('Error truncating data:', err);
    }
  })();
}

// put_seat('adu', 'decline');
// delete_data();
// put_seat('cc jz ba', 'decline');
// get_full();

// Gọi hàm và xử lý dữ liệu trả về (nếu cần)
// const data = await get_full();  // Gọi hàm lấy dữ liệu từ PostgreSQL
// console.log(typeof json(data));  // Trả về dữ liệu dưới dạng JSON


app.use(cors());
app.use(bodyParser.json());

// Utility function to read the seat map from a file
async function readSeatMap() {
  try {
    // Lấy dữ liệu từ cơ sở dữ liệu bằng cách gọi hàm get_full
    const data = await get_full();
    // Nếu có dữ liệu, trả về nó dưới dạng bản đồ chỗ ngồi
    // Ở đây bạn có thể xử lý hoặc chuyển đổi dữ liệu để phù hợp với bản đồ chỗ ngồi của bạn.
    // Giả sử dữ liệu trả về từ get_full() có cấu trúc phù hợp với bản đồ chỗ ngồi 2D:
    return data;  // Chỉ trả về trực tiếp hoặc có thể chuyển đổi tùy thuộc vào cấu trúc dữ liệu

  } catch (err) {
    console.error('Error reading or fetching seat map data:', err);
    // Trả về bản đồ chỗ ngồi mặc định trong trường hợp lỗi
    return Array(10).fill(null).map(() => Array(10).fill(null));
  }
}


// API để lấy danh sách seatmap
app.get('/api/seats', async (req, res) => {
  try {
    // Lấy dữ liệu từ database
    const result = await readSeatMap();

    // Tạo ma trận 10x10
    const seatMap = Array(10)
      .fill(null)
      .map(() => Array(10).fill(null));

    // Điền dữ liệu từ database vào ma trận
    // Điền dữ liệu vào seatMap
    let index = 0;
    for (let i = 0; i < seatMap.length; i++) {
      for (let j = 0; j < seatMap[i].length; j++) {
        if (index < result.length) {
          const dt_name = result[index].name;
          const dt_type = result[index].type;
          seatMap[i][j] = {dt_name, dt_type};  // Gán giá trị từ result vào seatMap
          index++;  // Tăng index để điền giá trị tiếp theo
        }
      }
    }
    console.log(seatMap);
    res.json(seatMap);
  } catch (err) {
    console.error('Error fetching seat map:', err);
    res.status(500).json({ error: 'Failed to fetch seat map' });
  }
});



// API to mark attendance (reserve a seat)
app.post('/api/attend', (req, res) => {
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      if (!seatMap[row][col]) {
        seatMap[row][col] = req.body;
        saveSeatMap(seatMap); // Save the updated seat map
        put_seat(req.body.name, req.body.type);
        return res.json({ success: true, row, col, type: 'occupied' });
      }
    }
  }
  res.json({ success: false, message: 'No seats available!' });
});


// API to mark decline (indicating a seat is not attended)
app.post('/api/attend', (req, res) => {
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      if (!seatMap[row][col]) {
        seatMap[row][col] = req.body;
        saveSeatMap(seatMap); // Save the updated seat map
        put_seat(req.body.name, req.body.type);
        return res.json({ success: true, row, col, type: 'decline' });
      }
    }
  }
  res.json({ success: false, message: 'No seats available!' });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});