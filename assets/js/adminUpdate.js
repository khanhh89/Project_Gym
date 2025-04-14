document.addEventListener("DOMContentLoaded", function () {
    let bookStore = JSON.parse(localStorage.getItem("classList") || "[]");

    // Save to localStorage
    function saveToLocalStorage() {
        localStorage.setItem("classList", JSON.stringify(bookStore));
    }

    // Render table
    function renderStore() {
        const tbody = document.querySelector("table tbody");
        if (!tbody) {
            console.error("Table body not found!");
            return;
        }

        tbody.innerHTML = "";
        bookStore.forEach((item, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.description}</td>
                <td><img src="${item.image}" alt="${item.name}" style="width: 80px; height: auto; border-radius: 8px;"></td>
                <td>
                    <button class="edit-btn" data-index="${index}">Sửa</button>
                    <button class="delete-btn" data-index="${index}">Xóa</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", handleEdit);
        });

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", handleDelete);
        });
    }

    // Handle delete
    async function handleDelete(event) {
        const index = event.target.dataset.index;
        const result = await Swal.fire({
            title: "Bạn có chắc chắn?",
            text: "Bạn muốn xóa mục này?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy"
        });

        if (result.isConfirmed) {
            bookStore.splice(index, 1);
            saveToLocalStorage();
            renderStore();
            Swal.fire({
                title: "Đã xóa!",
                text: "Mục đã được xóa thành công.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });
        }
    }

    // Handle edit
    function handleEdit(event) {
        const index = event.target.dataset.index;
        const item = bookStore[index];

        // Xóa modal cũ nếu có
        const oldModal = document.querySelector(".edit-modal");
        if (oldModal) oldModal.remove();

        // Tạo modal chỉnh sửa
        const editModal = document.createElement("div");
        editModal.className = "edit-modal";
        editModal.innerHTML = `
            <div class="modal-content">
                <h3>Chỉnh sửa mục</h3>
                <label>Tên:</label>
                <input type="text" id="edit-name" value="${item.name}">
                <label>Mô tả:</label>
                <textarea id="edit-description">${item.description}</textarea>
                <label>URL hình ảnh:</label>
                <input type="text" id="edit-image" value="${item.image}">
                <div class="modal-buttons">
                    <button id="save-edit">Lưu</button>
                    <button id="cancel-edit">Hủy</button>
                </div>
            </div>
        `;
        document.body.appendChild(editModal);

        // Hiển thị modal chỉnh sửa
        editModal.style.display = "flex";

        // Save edit
        document.getElementById("save-edit").addEventListener("click", () => {
            const updatedItem = {
                name: document.getElementById("edit-name").value.trim(),
                description: document.getElementById("edit-description").value.trim(),
                image: document.getElementById("edit-image").value.trim()
            };

            if (!updatedItem.name || !updatedItem.description || !updatedItem.image) {
                Swal.fire({
                    title: "Lỗi",
                    text: "Vui lòng điền đầy đủ thông tin!",
                    icon: "error",
                    confirmButtonText: "OK"
                });
                return;
            }

            bookStore[index] = updatedItem;
            saveToLocalStorage();
            renderStore();
            document.body.removeChild(editModal);
            Swal.fire({
                title: "Thành công!",
                text: "Cập nhật mục thành công.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });
        });

        // Cancel edit
        document.getElementById("cancel-edit").addEventListener("click", () => {
            document.body.removeChild(editModal);
        });
    }

    // Modal thêm dịch vụ
    const modal = document.getElementById("addModal");
    const openBtn = document.querySelector(".add-service");
    const closeBtn = document.querySelector(".close");
    const cancelBtn = document.querySelector(".cancel");
    const form = document.getElementById("addForm");

    openBtn?.addEventListener("click", () => modal.style.display = "flex");
    closeBtn?.addEventListener("click", () => modal.style.display = "none");
    cancelBtn?.addEventListener("click", () => modal.style.display = "none");

    form?.addEventListener("submit", function (e) {
        e.preventDefault();

        const newService = {
            name: document.getElementById("newName").value.trim(),
            description: document.getElementById("newDescription").value.trim(),
            image: document.getElementById("newImage").value.trim()
        };

        if (!newService.name || !newService.description || !newService.image) {
            Swal.fire({
                title: "Lỗi",
                text: "Vui lòng nhập đầy đủ thông tin!",
                icon: "error",
                confirmButtonText: "OK"
            });
            return;
        }

        bookStore.push(newService);
        saveToLocalStorage();
        renderStore();
        modal.style.display = "none";
        form.reset();
        Swal.fire({
            title: "Thành công!",
            text: "Thêm dịch vụ thành công.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
        });
    });

    // Render lần đầu
    renderStore();
});
