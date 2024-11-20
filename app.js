const apiUrl = "http://localhost:3000/api";

const seatMapContainer = document.getElementById("seatMap");

// Lấy danh sách ghế ngồi và hiển thị
async function loadSeatMap() {
  const response = await fetch(`${apiUrl}/seats`);
  const seatMap = await response.json();

  seatMapContainer.innerHTML = ""; // Xóa nội dung cũ
  seatMap.forEach((row, rowIndex) => {
    row.forEach((seat, colIndex) => {
      const seatDiv = document.createElement("div");
      seatDiv.textContent = seat || ""; // Hiển thị tên nếu đã đặt
      seatMapContainer.appendChild(seatDiv);
    });
  });
}

// Gửi tham dự
document.getElementById("attendButton").addEventListener("click", async () => {
  const name = prompt("Hãy nhập tên của bạn:");
  if (!name) return;

  const response = await fetch(`${apiUrl}/attend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  const result = await response.json();
  if (result.success) {
    alert(`Bạn đã đặt ghế thành công ở hàng ${result.row + 1}, cột ${result.col + 1}`);
    loadSeatMap();
  } else {
    alert(result.message);
  }
});

// Không tham dự
document.getElementById("declineButton").addEventListener("click", () => {
  alert("Rất tiếc vì bạn không thể tham dự.");
});

// Khởi động
loadSeatMap();
