const classList = [
    {
      id: 1,
      name: "Yoga",
      description: "Thư giãn và cân bằng tâm trí",
      image: "../../assets/img/YogaDay.png"
    },
    {
      id: 2,
      name: "Zumba",
      description: "Đốt cháy calories với những điệu nhảy sôi động",
      image: "../../assets/img/Zumba.png"
    },
    {
      id: 3,
      name: "Gym",
      description: "Tập luyện với các thiết bị hiện đại",
      image: "../../assets/img/Gym.png"
    }
  ];

  // Lưu dữ liệu vào localStorage nếu chưa có
  if (!localStorage.getItem("classList")) {
    localStorage.setItem("classList", JSON.stringify(classList));
  }

  // Hàm hiển thị danh sách lớp học
  function displayList() {
    const container = document.getElementById("classListContainer");
    const storedClassList = JSON.parse(localStorage.getItem("classList")) || [];

    // Sắp xếp theo tên A-Z
    const sortedList = storedClassList.sort((a, b) => a.name.localeCompare(b.name));

    // Tạo HTML hiển thị
    container.innerHTML = sortedList.map(classItem => `
      <div class="body--contact">
        <img src="${classItem.image}" alt="${classItem.name}" 
             onerror="this.src='https://via.placeholder.com/150'" />
        <h4>${classItem.name}</h4>
        <p>${classItem.description}</p>
        <button><a href="../../pages/booking/schedule.html">Đặt lịch</a></button>
      </div>
    `).join('');
  }

  // Gọi hàm khi trang load
  document.addEventListener("DOMContentLoaded", displayList);