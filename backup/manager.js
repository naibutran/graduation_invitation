const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const internal_api = 'postgresql://user:OeRDbfrA0fyslIx62xNYe5iGduzasyUZ@dpg-ct00lhq3esus7384kc0g-a/db_ifov';
const external_api = 'postgresql://user:OeRDbfrA0fyslIx62xNYe5iGduzasyUZ@dpg-ct00lhq3esus7384kc0g-a.oregon-postgres.render.com/db_ifov';

// Cấu hình kết nối PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || external_api,
  ssl: {
    rejectUnauthorized: false, // Cần thiết cho Render
  },
});

async function get_full() {
  // Cấu hình kết nối PostgreSQL
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || external_api,
    ssl: {
      rejectUnauthorized: false, // Cần thiết cho Render
    },
  });

  try {
    const client = await pool.connect();  // Kết nối với cơ sở dữ liệu
    console.log('Connected to PostgreSQL!');
    
    // Truy vấn lấy tất cả dữ liệu từ bảng seats
    const res = await client.query('SELECT * FROM seats');
    console.log('Data from the database:', res.rows);
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
    connectionString: process.env.DATABASE_URL || external_api,
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
    connectionString: process.env.DATABASE_URL || external_api,
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

get_full();

