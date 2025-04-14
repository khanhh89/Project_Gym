window.editSchedule = editSchedule;
window.deleteSchedule = deleteSchedule;

let readBooking = [];
try {
  readBooking = JSON.parse(localStorage.getItem("bookings") || "[]");
  console.log("Bookings loaded from localStorage:", readBooking);
} catch (e) {
  console.error("Error parsing bookings from localStorage:", e);
}

let upDate = readBooking.map((booking) => ({
  ...booking,
  status: booking.status || "approved",
}));
console.log("upDate after mapping:", upDate);

function resultBookingData(bookings) {
  const result = {
    totalBookings: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    cancelledBookings: 0,
    classCounts: {
      gym: 0,
      yoga: 0,
      zumba: 0,
    },
  };

  bookings.forEach((booking) => {
    result.totalBookings++;
    const status = booking.status?.toLowerCase() || "approved";
    if (status === "pending") result.pendingBookings++;
    if (status === "approved") result.approvedBookings++;
    if (status === "cancelled") result.cancelledBookings++;

    const classType = booking.classType?.toLowerCase().trim();
    if (classType === "gym") result.classCounts.gym++;
    if (classType === "yoga") result.classCounts.yoga++;
    if (classType === "zumba") result.classCounts.zumba++;
  });

  return result;
}

function updateStats(bookingStats) {
  const elements = ["gymCount", "yogaCount", "zumbaCount"];
  elements.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent =
        bookingStats.classCounts[id.replace("Count", "").toLowerCase()];
    } else {
      console.warn(`Element #${id} not found`);
    }
  });
}

let chartInstance = null;
function displayChart(bookingStats) {
  const ctx = document.getElementById("scheduleChart");
  if (!ctx) {
    console.error("Canvas #scheduleChart not found");
    return;
  }
  if (chartInstance) {
    chartInstance.destroy();
  }
  chartInstance = new Chart(ctx.getContext("2d"), {
    type: "bar",
    data: {
      labels: ["Gym", "Yoga", "Zumba"],
      datasets: [
        {
          label: "Số lượng lịch đặt",
          data: [
            bookingStats.classCounts.gym,
            bookingStats.classCounts.yoga,
            bookingStats.classCounts.zumba,
          ],
          backgroundColor: [
            "rgba(54, 162, 235, 0.5)",
            "rgba(40, 167, 69, 0.5)",
            "rgba(153, 102, 255, 0.5)",
          ],
          borderColor: [
            "rgba(54, 162, 235, 1)",
            "rgba(40, 167, 69, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
    },
  });
}

function renderTable(data) {
  const tbody = document.querySelector("tbody");
  if (!tbody) {
    console.error("Table body not found");
    return;
  }
  tbody.innerHTML = "";
  data.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.classType || "Không xác định"}</td>
      <td>${item.date || ""}</td>
      <td>${item.time || ""}</td>
      <td>${item.fullName || ""}</td>
      <td>${item.email || ""}</td>
      <td>
        <button class="btn-edit" aria-label="Sửa lịch tập" onclick="window.editSchedule(${index})">Sửa</button>
        <button class="btn-delete" aria-label="Xóa lịch tập" onclick="window.deleteSchedule(${index})">Xóa</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

let currentEditIndex = null;

function editSchedule(index) {
    currentEditIndex = index;
    const booking = upDate[index];
    const modal = document.getElementById("editModal");
    if (!modal) {
      console.error("Modal #editModal not found");
      return;
    }

    const classTypeEl = document.getElementById("classType");
    const dateEl = document.getElementById("date");
    const timeEl = document.getElementById("time");

    if (!classTypeEl || !dateEl || !timeEl) {
      console.error("One or more form elements not found");
      return;
    }

    classTypeEl.value = booking.classType?.trim() || "";
    dateEl.value = booking.date || "";
    timeEl.value = booking.time || "";

    modal.style.display = "flex";
    console.log("Modal display set to flex");
  }


function deleteSchedule(index) {
  Swal.fire({
    title: "Bạn có chắc chắn?",
    text: "Hành động này sẽ xóa lịch tập!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  }).then((result) => {
    if (result.isConfirmed) {
      upDate.splice(index, 1);
      localStorage.setItem("bookings", JSON.stringify(upDate));
      updateUI();
      Swal.fire("Đã xóa!", "Lịch tập đã được xóa.", "success");
    }
  });
}

function normalizeDate(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.match(/(\d{1,4})[-\/](\d{1,2})[-\/](\d{1,4})/);
  if (!parts) return dateStr;
  let year, month, day;
  if (dateStr.includes("-")) {
    if (parts[1].length === 4) {
      year = parts[1];
      month = parts[2];
      day = parts[3];
    } else {
      year = parts[3];
      month = parts[2];
      day = parts[1];
    }
  } else if (dateStr.includes("/")) {
    if (parts[1].length === 4) {
      year = parts[1];
      month = parts[2];
      day = parts[3];
    } else {
      year = parts[3];
      month = parts[2];
      day = parts[1];
    }
  }
  month = month.padStart(2, "0");
  day = day.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function filterBookings() {
  const classTypeEl = document.getElementById("filterClassType");
  const emailEl = document.getElementById("emailInput");
  const dateEl = document.getElementById("dateInput");

  if (!classTypeEl || !emailEl || !dateEl) {
    console.error("One or more filter inputs not found");
    return;
  }
  const classType = classTypeEl.value.toLowerCase();
  const email = emailEl.value.toLowerCase().trim();
  const date = dateEl.value;
  let filteredBookings = [...upDate];
  if (classType !== "all") {
    filteredBookings = filteredBookings.filter(
      (booking) => booking.classType?.toLowerCase().trim() === classType
    );
  }
  if (email) {
    filteredBookings = filteredBookings.filter((booking) =>
      booking.email?.toLowerCase().includes(email)
    );
  }
  if (date) {
    filteredBookings = filteredBookings.filter((booking) => {
      const bookingDate = normalizeDate(booking.date);
      return bookingDate === date;
    });
  }

  renderTable(filteredBookings);
}

function closeEditForm() {
  const modal = document.getElementById("editModal");
  if (modal) {
    modal.style.display = "none";
    console.log("Modal closed via closeEditForm");
  }
}

function updateUI() {
  const bookingStats = resultBookingData(upDate);
  updateStats(bookingStats);
  displayChart(bookingStats);
  renderTable(upDate);
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");
  const editModal = document.getElementById("editModal");
  const editForm = document.getElementById("editForm");

  if (editModal) {
    editModal.style.display = "none";
    editModal.querySelector(".close")?.addEventListener("click", closeEditForm);
    editModal.querySelector(".cancel")?.addEventListener("click", closeEditForm);
    window.addEventListener("click", (e) => {
      if (e.target === editModal) {
        closeEditForm();
      }
    });
  } else {
    console.error("editModal not found during DOMContentLoaded");
  }

  if (editForm) {
    editForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = {
        classType: document.getElementById("classType").value.trim(),
        date: document.getElementById("date").value,
        time: document.getElementById("time").value,
      };

      if (!data.classType || !data.date || !data.time) {
        Swal.fire("Lỗi!", "Vui lòng điền đầy đủ thông tin", "error");
        return;
      }

      upDate[currentEditIndex] = { ...upDate[currentEditIndex], ...data };
      localStorage.setItem("bookings", JSON.stringify(upDate));
      updateUI();
      closeEditForm();
      Swal.fire("Đã lưu!", "Lịch tập đã được cập nhật.", "success");
    });
  } else {
    console.error("editForm not found during DOMContentLoaded");
  }

  const filterBtn = document.getElementById("filterBtn");
  if (filterBtn) {
    filterBtn.addEventListener("click", filterBookings);
  }

  updateUI();
});