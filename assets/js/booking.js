const initialBookings = [
    {
      classType: "Gym",
      date: "2025-04-05",
      time: "22:00-23:59",
      fullName: "Đào Xuân Khánh",
      email: "khanh@gmail.com",
    },
    {
      classType: "Yoga",
      date: "2025-04-06",
      time: "07:00-09:00",
      fullName: "Kieo",
      email: "kieo@gmail.com",
    },
    {
      classType: "Zumba",
      date: "2025-04-07",
      time: "17:00-19:00",
      fullName: "Văn Nam",
      email: "nam@gmail.com",
    },
  ];
  
  let current_page = 1;
  const rows_per_page = 3;
  
  const list_element = document.getElementById("list");
  const pagination_element = document.getElementById("pagination");
  
  if (!localStorage.getItem("bookings")) {
    localStorage.setItem("bookings", JSON.stringify(initialBookings));
  }
  
  function DisplayList(items, wrapper, rows_per_page, page) {
    wrapper.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Lớp học</th>
                    <th>Ngày tập</th>
                    <th>Khung giờ</th>
                    <th>Họ Và Tên</th>
                    <th>Email</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    `;
  
    const tableBody = wrapper.querySelector("tbody");
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    
    // Lọc dữ liệu theo email người dùng hiện tại
    const bookingData = items.filter((booking) => booking.email === currentUser.email);
    
    page--;
    const start = rows_per_page * page;
    const end = start + rows_per_page;
    const paginatedItems = bookingData.slice(start, end);
    
    if (paginatedItems.length === 0) {
      tableBody.innerHTML =
        '<tr><td colspan="6">Chưa có lịch nào được đặt</td></tr>';
      return;
    }
    
    paginatedItems.forEach((booking, index) => {
      const realIndex = items.indexOf(booking);
      const row = document.createElement("tr");
      row.innerHTML = `
            <td>${booking.classType}</td>
            <td>${booking.date}</td>
            <td>${booking.time}</td>
            <td>${booking.fullName}</td>
            <td>${booking.email}</td>
            <td class="actions">
                <button class="btn-edit" data-index="${realIndex}">Sửa</button>
                <button class="btn-delete" data-index="${realIndex}">Xóa</button>
            </td>
        `;
      tableBody.appendChild(row);
    });
  
    attachEventListeners();
  }
  
  function SetupPagination(items, wrapper, rows_per_page) {
    wrapper.innerHTML = "";
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const bookingData = items.filter((booking) => booking.email === currentUser.email);
    const page_count = Math.ceil(bookingData.length / rows_per_page);
  
    const prevBtn = document.createElement("button");
    prevBtn.innerHTML = '<i class="fa-solid fa-left-long"></i>';
    prevBtn.addEventListener("click", () => {
      if (current_page > 1) {
        current_page--;
        updatePagination();
      }
    });
    wrapper.appendChild(prevBtn);
  
    for (let i = 1; i <= page_count; i++) {
      const btn = document.createElement("button");
      btn.innerHTML = i;
      btn.addEventListener("click", () => {
        current_page = i;
        updatePagination();
      });
      wrapper.appendChild(btn);
    }
  
    const nextBtn = document.createElement("button");
    nextBtn.innerHTML = '<i class="fa-solid fa-right-long"></i>';
    nextBtn.addEventListener("click", () => {
      if (current_page < page_count) {
        current_page++;
        updatePagination();
      }
    });
    wrapper.appendChild(nextBtn);
  
    updatePaginationButtons(page_count);
  }
  
  function updatePagination() {
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    // Lọc dữ liệu theo email người dùng hiện tại
    const bookingData = bookings.filter((booking) => booking.email === currentUser.email);
    
    DisplayList(bookings, list_element, rows_per_page, current_page);
    const page_count = Math.ceil(bookingData.length / rows_per_page);
    updatePaginationButtons(page_count);
  }
  
  function updatePaginationButtons(page_count) {
    const buttons = pagination_element.querySelectorAll("button");
  
    buttons.forEach((btn) => {
      btn.classList.remove("active");
      btn.disabled = false;
      if (btn.innerHTML === '<i class="fa-solid fa-left-long"></i>') {
        btn.disabled = current_page === 1;
      } else if (btn.innerHTML === '<i class="fa-solid fa-right-long"></i>') {
        btn.disabled = current_page === page_count || page_count === 0;
      } else if (parseInt(btn.innerHTML) === current_page) {
        btn.classList.add("active");
      }
    });
    const expectedButtons = page_count + 2;
    if (buttons.length !== expectedButtons) {
      SetupPagination(
        JSON.parse(localStorage.getItem("bookings") || "[]"),
        pagination_element,
        rows_per_page
      );
    }
  }
  
  function resetForm() {
    const form = document.querySelector("#bookingForm");
    if (form) form.reset();
    document.querySelector(".modal-title").textContent = "Đặt lịch mới";
  }
  
  function handleEdit(index) {
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    const booking = bookings[index];
    if (!booking) return;
  
    const dateParts = booking.date.split("-");
    const inputDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  
    document.getElementById("classType").value = booking.classType;
    document.getElementById("date").value = inputDate;
    document.getElementById("time").value = booking.time
      .replace(":00", "h")
      .replace("-", "-");
  
    const modal = document.querySelector(".modal-overlay");
    if (modal) {
      modal.style.display = "block";
      document.querySelector(".modal-title").textContent = "Sửa lịch tập";
      document.querySelector(".btn-save").dataset.editIndex = index;
    }
  }
  
  function handleDelete(index) {
    Swal.fire({
      title: "Bạn có chắc muốn xóa?",
      text: "Dữ liệu sẽ không thể khôi phục!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
        bookings.splice(index, 1);
        localStorage.setItem("bookings", JSON.stringify(bookings));
        updatePagination();
        Swal.fire("Đã xóa!", "Lịch học đã được xóa.", "success");
      }
    });
  }
  
  function attachEventListeners() {
    document.querySelectorAll(".btn-edit").forEach((button) => {
      button.onclick = () => handleEdit(parseInt(button.dataset.index));
    });
  
    document.querySelectorAll(".btn-delete").forEach((button) => {
      button.onclick = () => handleDelete(parseInt(button.dataset.index));
    });
  }
  
  window.onload = function () {
    const modal = document.querySelector(".modal-overlay");
    const saveButton = document.querySelector(".btn-save");
    const closeButton = document.querySelector(".modal-close");
    const newButton = document.querySelector(".btn-new");
  
    // Khởi tạo giao diện
    updatePagination();
  
    if (closeButton) {
      closeButton.onclick = () => {
        modal.style.display = "none";
        resetForm();
      };
    }
  
    if (modal) {
      modal.onclick = (event) => {
        if (event.target === modal) {
          modal.style.display = "none";
          resetForm();
        }
      };
    }
  
    if (saveButton) {
      saveButton.onclick = () => {
        const classType = document.getElementById("classType").value;
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
  
        const currentUser = JSON.parse(
          localStorage.getItem("currentUser") || "{}"
        );
        if (!currentUser.email) {
          Swal.fire("Lỗi", "Vui lòng đăng nhập!", "error");
          return;
        }
  
        if (!classType || !date || !time) {
          Swal.fire("Lỗi", "Vui lòng điền đầy đủ thông tin!", "error");
          return;
        }
  
        const dateParts = date.split("-");
        const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        const formattedTime = time.replace("h-", ":00-").replace("h", ":00");
  
        const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
        const editIndex = saveButton.dataset.editIndex;
  
        const isDuplicate = bookings.some((booking, i) => {
          return (
            booking.classType === classType &&
            booking.date === formattedDate &&
            booking.time === formattedTime &&
            i != editIndex
          );
        });
  
        if (isDuplicate) {
          Swal.fire(
            "Trùng lịch",
            "Lớp học bị trùng, vui lòng chọn lại!",
            "error"
          );
          return;
        }
  
        const newBooking = {
          classType,
          date: formattedDate,
          time: formattedTime,
          fullName: currentUser.fullName,
          email: currentUser.email,
        };
  
        if (editIndex !== undefined && editIndex !== "") {
          bookings[editIndex] = newBooking;
          delete saveButton.dataset.editIndex;
        } else {
          bookings.push(newBooking);
        }
  
        localStorage.setItem("bookings", JSON.stringify(bookings));
        updatePagination();
        modal.style.display = "none";
        resetForm();
        Swal.fire("Thành công!", "Lịch học đã được lưu.", "success");
      };
    }
  
    if (newButton) {
      newButton.onclick = () => {
        resetForm();
        if (saveButton) delete saveButton.dataset.editIndex;
        modal.style.display = "block";
      };
    }
  };