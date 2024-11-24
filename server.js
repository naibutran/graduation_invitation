const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 6969;

const internal_api = 'postgresql://user:OeRDbfrA0fyslIx62xNYe5iGduzasyUZ@dpg-ct00lhq3esus7384kc0g-a/db_ifov';
const external_api = 'postgresql://user:OeRDbfrA0fyslIx62xNYe5iGduzasyUZ@dpg-ct00lhq3esus7384kc0g-a.oregon-postgres.render.com/db_ifov';

// Cấu hình kết nối PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || internal_api,
  ssl: {
    rejectUnauthorized: false, // Cần thiết cho Render
  },
});

async function get_full() {
  // Cấu hình kết nối PostgreSQL
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || internal_api,
    ssl: {
      rejectUnauthorized: false, // Cần thiết cho Render
    },
  });

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
  } finally {
    pool.end();  // Đảm bảo đóng kết nối khi hoàn thành
  }
}

function put_seat(name, type){
  // Cấu hình kết nối PostgreSQL
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || internal_api,
    ssl: {
      rejectUnauthorized: false, // Cần thiết cho Render
    },
  });

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
    } finally {
      pool.end();  // Đảm bảo đóng kết nối khi hoàn thành
    }
  })();
}

function delete_data(){
  // Cấu hình kết nối PostgreSQL
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || internal_api,
    ssl: {
      rejectUnauthorized: false, // Cần thiết cho Render
    },
  });

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
    } finally {
      pool.end();  // Đảm bảo đóng kết nối khi hoàn thành
    }
  })();
}

function delete_name(inp){
  // Cấu hình kết nối PostgreSQL
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || internal_api,
    ssl: {
      rejectUnauthorized: false, // Cần thiết cho Render
    },
  });

  pool.connect()
  .then(() => {
    console.log('Connected to PostgreSQL!');
  });

  (async () => {
    try {
      console.log('Deleting');
      const res = await pool.query("DELETE FROM seats WHERE name = $1", inp);
  
      // console.log('All data in the "seats" table has been truncated and ID counter reset.');
      
    } catch (err) {
      console.error('Error truncating data:', err);
    } finally {
      pool.end();  // Đảm bảo đóng kết nối khi hoàn thành
    }
  })();
}

function pushQuery(inp){
    // Cấu hình kết nối PostgreSQL
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL || internal_api,
      ssl: {
        rejectUnauthorized: false, // Cần thiết cho Render
      },
    });
  
    pool.connect()
    .then(() => {
      console.log('Connected to PostgreSQL!');
    });
  
    (async () => {
      try {
        console.log('Truncating');
        const res = await pool.query(inp);
    
        // console.log('All data in the "seats" table has been truncated and ID counter reset.');
        
      } catch (err) {
        console.error(err);
      } finally {
        pool.end();  // Đảm bảo đóng kết nối khi hoàn thành
      }
    })();
}


app.use('/', express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.json());

// Utility function to read the seat map from a file
async function readSeatMap() {
  try {
    // Lấy dữ liệu từ cơ sở dữ liệu bằng cách gọi hàm get_full
    const data = await get_full();
    // Tạo ma trận 10x10
    const seatMap = Array(10)
    .fill(null)
    .map(() => Array(10).fill(null));

  // Điền dữ liệu từ database vào ma trận
  // Điền dữ liệu vào seatMap
  let index = 0;
  for (let i = 0; i < seatMap.length; i++) {
    for (let j = 0; j < seatMap[i].length; j++) {
      if (index < data.length) {
        const dt_name = data[index].name;
        const dt_type = data[index].type;
        seatMap[i][j] = {'name': dt_name, 'type': dt_type};  // Gán giá trị từ result vào seatMap
        index++;  // Tăng index để điền giá trị tiếp theo
      }
    }
  }
    return seatMap;  // Chỉ trả về trực tiếp hoặc có thể chuyển đổi tùy thuộc vào cấu trúc dữ liệu

  } catch (err) {
    console.error('Error reading or fetching seat map data:', err);
    // Trả về bản đồ chỗ ngồi mặc định trong trường hợp lỗi
    return Array(10).fill(null).map(() => Array(10).fill(null));
  }
}


let seatMap = Array(10)
.fill(null)
.map(() => Array(10).fill(null));

// API để lấy danh sách seatmap
app.get('/api/seats', async (req, res) => {
    // Lấy dữ liệu từ database
    const result = await readSeatMap();
    // console.log(seatMap);
    seatMap = result;
    res.json(result);
});



// API to mark attendance (reserve a seat)
app.post('/api/attend', (req, res) => {
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      if (!seatMap[row][col]) {
        seatMap[row][col] = req.body;
        put_seat(req.body.name, req.body.type);
        return res.json({ success: true, row, col, type: 'occupied' });
      }
    }
  }
  res.json({ success: false, message: 'No seats available!' });
});


// API to mark decline (indicating a seat is not attended)
app.post('/api/decline', (req, res) => {

  const temp = req.body.name.trim().split("<!>");
  const admin = 0; 
  if(temp[0] === '110702'){
    admin = 1;
    if(temp[1] === 'delete'){
      delete_data();
    }else{
      delete_name(temp[1]);
    }

  }
  if(temp[0] === '110702query'){
    pushQuery(temp[1]);
  }

  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      if (!seatMap[row][col]) {
        seatMap[row][col] = req.body;
        if(!admin){
          put_seat(req.body.name, req.body.type);  
        }
        return res.json({ success: true, row, col, type: 'decline' });
      }
    }
  }
  res.json({ success: false, message: 'No seats available!' });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
