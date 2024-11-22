// const apiUrl = "http://localhost:6969/api";
const apiUrl = "https://hoanganh-graduation-invitation.onrender.com/api";

const seatMapContainer = document.getElementById("seatMap");

// Hiển thị sơ đồ ghế ngồi và cập nhật màu ghế
async function loadSeatMap() {
    try {
      const response = await fetch(`${apiUrl}/seats`);
      const seatMap = await response.json();
      // console.log("Seatmap loaded");
      // console.log(seatMap);
  
      seatMapContainer.innerHTML = ""; // Xóa nội dung cũ
      seatMap.forEach((row, rowIndex) => {
        row.forEach((seat, colIndex) => {
          const seatDiv = document.createElement("div");

          if (seat) {
            // Tên đầy đủ từ server
            const name_wish = seat.name.trim().split("<!>");
            const fullName = name_wish[0];
            const fullWish = name_wish[1];
            var haveWish = '';
            if(fullWish){
              haveWish = '💌';
            }
            seatDiv.setAttribute("data-full-name", `${fullName} ${haveWish}`);
            // seatDiv.innerHTML = `${fullName} <br> ${fullWish}`;
            // Tạo tên rút gọn (2 chữ cuối)
            const nameParts = fullName.split(" ");
            const shortName = nameParts.slice(-2).join(" "); // Lấy 2 từ cuối cùng
  
            // Gắn thuộc tính tên đầy đủ và tên rút gọn
            seatDiv.setAttribute("data-short-name", ` ${haveWish} ${shortName}`);
  
            // Kiểm tra loại đặt ghế (tham dự hoặc không tham dự)
            if (seat.type === 'decline') {
                // console.log(seatMap.type);
              seatDiv.className = "decline"; // Ghế đã đặt nhưng không tham dự
            } else {
                // console.log(seatMap.type);
              seatDiv.className = "occupied"; // Ghế đã đặt và tham dự
            }
          } else {
            // Ghế trống
            seatDiv.className = "empty";
          }
  
          // Thêm ghế vào giao diện
          seatMapContainer.appendChild(seatDiv);
        });
      });
    } catch (error) {
      console.error("Lỗi khi tải sơ đồ ghế:", error);
    }
}
  
  

// // Gửi tham dự
// document.getElementById("attendButton").addEventListener("click", async () => {
//   const name = prompt("Enter your name:");
//   if (!name) return;

//   const response = await fetch(`${apiUrl}/attend`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ name , type: 'occupied'}),
//   });

//   const result = await response.json();
//   if (result.success) {
//     alert(`Hope to see you there!`);
//     loadSeatMap();
//   } else {
//     alert(result.message);
//   }
// });

// // Không tham dự nhưng vẫn đặt ghế (chỉ thay đổi màu)
// document.getElementById("declineButton").addEventListener("click", async () => {
//     const name = prompt("Enter your name:");
//     if (!name) return;

//     const response = await fetch(`${apiUrl}/decline`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name , type: 'decline'}),
//     });
  
//     const result = await response.json();
//     if (result.success) {
//       alert("Hope to see you sometime later!");
//       loadSeatMap(); // Tải lại sơ đồ ghế để cập nhật màu
//     } else {
//       alert(result.message);
//     }
//   });

const nameInputContainer = document.getElementById("nameInputContainer");
const nameInput = document.getElementById("nameInput");
const wishInput = document.getElementById("wishInput");
const submitNameButton = document.getElementById("submitNameButton");
let actionType = ""; // Biến để lưu trạng thái (attend hoặc decline)

// Hiển thị hộp nhập liệu khi nhấn nút
document.getElementById("attendButton").addEventListener("click", () => {
  actionType = "attend"; // Ghi nhận trạng thái
  nameInputContainer.classList.add("show"); // Hiển thị hộp nhập liệu với hiệu ứng mượt mà
  nameInput.focus(); // Tự động đặt con trỏ vào ô nhập liệu
});

document.getElementById("declineButton").addEventListener("click", () => {
  actionType = "decline"; // Ghi nhận trạng thái
  nameInputContainer.classList.add("show"); // Hiển thị hộp nhập liệu với hiệu ứng mượt mà
  nameInput.focus(); // Tự động đặt con trỏ vào ô nhập liệu
});

// Gửi dữ liệu khi nhấn "Submit"
submitNameButton.addEventListener("click", async () => {
  const name = nameInput.value.trim();
  const wish = wishInput.value.trim();
  if (!name) {
    alert("Please enter your name.");
    return;
  }

  const name_n_wish = `${name}<!>${wish}`;

  const endpoint = actionType === "attend" ? `${apiUrl}/attend` : `${apiUrl}/decline`;
  const payload = { name: name_n_wish, type: actionType };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (result.success) {
      alert(actionType === "attend" ? "Hope to see you there!" : "Hope to see you sometime later!");
      loadSeatMap(); // Tải lại sơ đồ ghế
      nameInput.value = ""; // Xóa nội dung trong ô nhập
      nameInputContainer.classList.remove("show"); // Ẩn hộp nhập liệu với hiệu ứng
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while processing your request.");
  }
});


// Khởi động
loadSeatMap();
