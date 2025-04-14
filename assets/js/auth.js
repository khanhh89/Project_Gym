function initializeAdminAccount() {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  users = users.filter((user) => user.email !== "khanh1@gmail.com");
  const adminExists = users.some((user) => user.email === "khanh1@gmail.com");
  if (!adminExists) {
    const adminAccount = {
      fullName: "AD",
      email: "khanh1@gmail.com",
      password: "11111111",
      role: "admin",
    };
    users.push(adminAccount);
    localStorage.setItem("users", JSON.stringify(users));
  }
}

function fValid() {
  let fullName = document.getElementById("name").value.trim();
  let mail = document.getElementById("mail").value.trim();
  let inputPass = document.getElementById("pass").value.trim();
  let checkPass = document.getElementById("checkpass").value.trim();

  let isValid = true;

  if (fullName === "") {
    document.getElementById("errName").innerHTML = "Vui lòng nhập họ và tên.";
    document.getElementById("name").focus();
    isValid = false;
  } else if (fullName.length < 2) {
    document.getElementById("errName").innerHTML =
      "Họ và tên phải có ít nhất 2 ký tự.";
    document.getElementById("name").focus();
    isValid = false;
  } else {
    document.getElementById("errName").innerHTML = "";
  }

  if (mail === "") {
    document.getElementById("errMail").innerHTML = "Vui lòng nhập email.";
    isValid = false;
  } else if (!mail.includes("@") || !mail.includes(".")) {
    document.getElementById("errMail").innerHTML =
      "Email không đúng định dạng (ví dụ: user@domain.com).";
    document.getElementById("mail").focus();
    isValid = false;
  } else {
    document.getElementById("errMail").innerHTML = "";
  }

  if (inputPass === "") {
    document.getElementById("errPass").innerHTML = "Vui lòng nhập mật khẩu.";
    isValid = false;
  } else if (inputPass.length < 8) {
    document.getElementById("errPass").innerHTML =
      "Mật khẩu phải có ít nhất 8 ký tự.";
    document.getElementById("pass").focus();
    isValid = false;
  } else if (!/[A-Z]/.test(inputPass) || !/[0-9]/.test(inputPass)) {
    document.getElementById("errPass").innerHTML =
      "Mật khẩu phải chứa ít nhất 1 chữ cái in hoa và 1 số.";
    document.getElementById("pass").focus();
    isValid = false;
  } else {
    document.getElementById("errPass").innerHTML = "";
  }

  if (checkPass === "") {
    document.getElementById("errPassCheck").innerHTML =
      "Vui lòng nhập lại mật khẩu.";
    isValid = false;
  } else if (checkPass !== inputPass) {
    document.getElementById("errPassCheck").innerHTML =
      "Mật khẩu xác nhận không khớp với mật khẩu đã nhập.";
    document.getElementById("checkpass").focus();
    isValid = false;
  } else {
    document.getElementById("errPassCheck").innerHTML = "";
  }

  if (!isValid) return;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.some((u) => u.email === mail)) {
    document.getElementById("errMail").innerHTML =
      "Email này đã được đăng ký. Vui lòng sử dụng email khác.";
    document.getElementById("mail").focus();
    return;
  }

  let user = {
    fullName: fullName,
    email: mail,
    password: inputPass,
    role: "user",
  };
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));

  Swal.fire({
    title: "Đăng ký thành công!",
    text: "Tài khoản của bạn đã được tạo. Vui lòng đăng nhập để tiếp tục.",
    icon: "success",
    confirmButtonText: "Đi đến đăng nhập",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "../auth/login.html";
    }
  });
}

function fValidLogin() {
  let mail = document.getElementById("mail").value.trim();
  let inputPass = document.getElementById("pass").value.trim();

  let isValid = true;

  if (mail === "") {
    document.getElementById("errEmail").innerHTML = "Vui lòng nhập email.";
    document.getElementById("mail").focus();
    isValid = false;
  } else if (!mail.includes("@") || !mail.includes(".")) {
    document.getElementById("errEmail").innerHTML =
      "Email không đúng định dạng (ví dụ: user@domain.com).";
    document.getElementById("mail").focus();
    isValid = false;
  } else {
    document.getElementById("errEmail").innerHTML = "";
  }

  if (inputPass === "") {
    document.getElementById("errPass").innerHTML = "Vui lòng nhập mật khẩu.";
    document.getElementById("pass").focus();
    isValid = false;
  } else {
    document.getElementById("errPass").innerHTML = "";
  }

  if (!isValid) return;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let user = users.find((u) => u.email === mail && u.password === inputPass);
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    Swal.fire({
      title: "Đăng nhập thành công!",
      text: `Chào mừng ${user.fullName} quay trở lại hệ thống.`,
      icon: "success",
      confirmButtonText: "Vào trang chính",
    }).then(() => {
      window.location.href = "../../pages/admin/dashboard.html";
    });
  } else {
    Swal.fire({
      title: "Đăng nhập thất bại",
      text: "Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.",
      icon: "error",
      confirmButtonText: "Thử lại",
    });
  }
}

function updateAuthLinks() {
  const authItem = document.getElementById("auth-item");
  if (!authItem) return;

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser) {
    authItem.innerHTML = '<a href="#" onclick="logout()">Đăng xuất</a>';
  } else {
    authItem.innerHTML = '<a href="../../pages/auth/login.html">Đăng nhập</a>';
  }
}

function logout() {
  Swal.fire({
    title: "Đăng xuất",
    text: "Bạn có chắc chắn muốn đăng xuất?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Đăng xuất",
    cancelButtonText: "Hủy"
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("currentUser");
      Swal.fire({
        title: "Đăng xuất thành công!",
        text: "Bạn đã đăng xuất khỏi hệ thống.",
        icon: "success",
        confirmButtonText: "OK"
      }).then(() => {
        window.location.reload();
      });
    }
  });
}

function updateAdminMenu() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const adminMenuItem = document.querySelector(".admin-login");

  if (currentUser && currentUser.role === "admin") {
    if (adminMenuItem) {
      adminMenuItem.style.display = "block";
    }
  } else {
    if (adminMenuItem) {
      adminMenuItem.style.display = "none";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateAuthLinks();
  updateAdminMenu();
});