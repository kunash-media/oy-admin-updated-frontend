const API_BASE_URL = "http://localhost:8080/api/staff";
let allStaffData = [];

const dummyStaffData = [{
        staffId: "STF001",
        staffName: "John Smith",
        emailAddress: "john.smith@company.com",
        contact: "+91-9876543210",
        joiningDate: "2023-01-15",
        role: "Admin",
        status: "ACTIVE",
        staffImageUrl: "https://via.placeholder.com/40/4CAF50/FFFFFF?text=JS",
    },

];

function showLoading() {
    document.getElementById("loadingIndicator").style.display = "block";
}

function hideLoading() {
    document.getElementById("loadingIndicator").style.display = "none";
}

async function fetchAllStaff() {
    try {
        showLoading();

        // Call the actual GET API
        const response = await fetch(`${API_BASE_URL}`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch staff data");
        }

        const staffData = await response.json();
        allStaffData = staffData;
        populateStaffTable(staffData);

    } catch (error) {
        console.error("Error fetching staff:", error);
        // Fallback to dummy data if API fails
        allStaffData = dummyStaffData;
        populateStaffTable(dummyStaffData);
        alert("Error loading staff data. Showing dummy data.");
    } finally {
        hideLoading();
    }
}

function populateStaffTable(staffData) {
    const tbody = document.getElementById("staffTableBody");
    tbody.innerHTML = "";

    staffData.forEach((staff) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                <td><input type="checkbox"></td>
                <td>${staff.staffId}</td>
                <td><img src="${
                  staff.staffImageUrl || "https://via.placeholder.com/40"
                }" class="staff-image" alt="Staff Image" style="width: 40px; height: 40px; border-radius: 50%;"></td>
                <td>${staff.staffName}</td>
                <td>${staff.emailAddress}</td>
                <td>${staff.contact}</td>
                <td>${staff.joiningDate}</td>
                <td>${staff.role}</td>
                <td><span class="badge ${
                  staff.status === "ACTIVE" ? "bg-success" : "bg-secondary"
                }">${staff.status}</span></td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-warning" onclick="enableRowEditing(this.closest('tr'), '${
                      staff.staffId
                    }')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteStaff('${
                      staff.staffId
                    }')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
        tbody.appendChild(row);
    });
}

async function createStaff(formData) {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/create`, {
            method: "POST",
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create staff member");
        }

        const result = await response.json();
        alert("Staff member created successfully!");
        await fetchAllStaff();
        return result;
    } catch (error) {
        console.error("Error creating staff:", error);
        alert(`Error: ${error.message}`);
        throw error;
    } finally {
        hideLoading();
    }
}

async function updateStaff(staffId, formData) {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/${staffId}`, {
            method: "PUT",
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update staff member");
        }

        const result = await response.json();
        alert("Staff member updated successfully!");
        await fetchAllStaff();
        return result;
    } catch (error) {
        console.error("Error updating staff:", error);
        alert(`Error: ${error.message}`);
        throw error;
    } finally {
        hideLoading();
    }
}

async function deleteStaff(staffId) {
    if (!confirm("Are you sure you want to delete this staff member?")) {
        return;
    }

    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/${staffId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Failed to delete staff member");
        }

        alert("Staff member deleted successfully!");
        await fetchAllStaff();
    } catch (error) {
        console.error("Error deleting staff:", error);
        alert("Error deleting staff member. Please try again.");
    } finally {
        hideLoading();
    }
}

function enableRowEditing(row, staffId) {
    const cells = row.cells;

    for (let i = 1; i < cells.length - 1; i++) {
        if (i === 2 || i === 1) continue;

        const cell = cells[i];
        const cellContent = cell.innerHTML;

        if (i === 8) {
            const isActive = cellContent.includes("bg-success");
            cell.innerHTML = `
                    <select class="form-select form-select-sm">
                        <option value="ACTIVE" ${
                          isActive ? "selected" : ""
                        }>ACTIVE</option>
                        <option value="INACTIVE" ${
                          !isActive ? "selected" : ""
                        }>INACTIVE</option>
                    </select>
                `;
        } else if (i === 7) {
            const currentRole = cell.textContent.trim();
            cell.innerHTML = `
                    <select class="form-select form-select-sm">
                        <option value="Admin" ${
                          currentRole === "Admin" ? "selected" : ""
                        }>Admin</option>
                        <option value="Cashier" ${
                          currentRole === "Cashier" ? "selected" : ""
                        }>Cashier</option>
                        <option value="Accountant" ${
                          currentRole === "Accountant" ? "selected" : ""
                        }>Accountant</option>
                    </select>
                `;
        } else {
            cell.contentEditable = true;
            cell.style.backgroundColor = "#fff8e1";
        }
    }

    const actionCell = cells[cells.length - 1];
    actionCell.innerHTML = `
            <button class="btn btn-sm btn-success" onclick="saveRowChanges(this.closest('tr'), '${staffId}')">
                <i class="fas fa-save"></i> Save
            </button>
            <button class="btn btn-sm btn-secondary" onclick="cancelRowEditing(this.closest('tr'))">
                <i class="fas fa-times"></i> Cancel
            </button>
        `;
}

async function saveRowChanges(row, staffId) {
    const cells = row.cells;

    const formData = new FormData();
    const staffData = {};

    staffData.staffName = cells[3].textContent.trim();
    staffData.emailAddress = cells[4].textContent.trim();
    staffData.contact = cells[5].textContent.trim();
    staffData.joiningDate = cells[6].textContent.trim();
    staffData.role = cells[7].querySelector("select") ?
        cells[7].querySelector("select").value :
        cells[7].textContent.trim();
    staffData.status = cells[8].querySelector("select") ?
        cells[8].querySelector("select").value :
        "ACTIVE";

    const staffBlob = new Blob([JSON.stringify(staffData)], {
        type: 'application/json'
    });
    formData.append("staff", staffBlob);

    try {
        await updateStaff(staffId, formData);
    } catch (error) {
        cancelRowEditing(row);
    }
}

function cancelRowEditing(row) {
    fetchAllStaff();
}

function filterTable() {
    const searchInput = document
        .getElementById("searchInput")
        .value.toLowerCase();
    const roleFilter = document.getElementById("roleFilter").value;

    let filteredData = allStaffData.filter((staff) => {
        const matchesSearch =
            searchInput === "" ||
            staff.staffName.toLowerCase().includes(searchInput) ||
            staff.emailAddress.toLowerCase().includes(searchInput) ||
            staff.contact.toLowerCase().includes(searchInput);

        const matchesRole =
            roleFilter === "Staff Role" ||
            roleFilter === null ||
            staff.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    populateStaffTable(filteredData);
}

function resetTable() {
    document.getElementById("searchInput").value = "";
    document.getElementById("roleFilter").selectedIndex = 0;
    populateStaffTable(allStaffData);
}

document.addEventListener("DOMContentLoaded", function() {
    fetchAllStaff();

    document
        .getElementById("menuIcon")
        .addEventListener("click", function() {
            const leftNav = document.getElementById("leftNav");
            leftNav.style.display =
                leftNav.style.display === "block" ? "none" : "block";
        });

    document
        .getElementById("profileIcon")
        .addEventListener("click", function(e) {
            e.stopPropagation();
            const menu = document.getElementById("profileMenu");
            menu.style.display =
                menu.style.display === "block" ? "none" : "block";
        });

    document.addEventListener("click", function() {
        document.getElementById("profileMenu").style.display = "none";
    });

    document
        .getElementById("onlineStoreToggle")
        .addEventListener("click", function() {
            const sub = document.getElementById("onlineStoreSub");
            sub.style.display =
                sub.style.display === "block" ? "none" : "block";
        });

    document
        .getElementById("catalogToggle")
        .addEventListener("click", function() {
            const sub = document.getElementById("catalogSub");
            sub.style.display =
                sub.style.display === "block" ? "none" : "block";
        });

    document
        .getElementById("customersToggle")
        .addEventListener("click", function() {
            const sub = document.getElementById("customersSub");
            sub.style.display =
                sub.style.display === "block" ? "none" : "block";
        });

    document.getElementById("saveStaffBtn").addEventListener("click", async function() {
        const staffName = document.getElementById("staffName").value;
        const staffEmail = document.getElementById("staffEmail").value;
        const staffContact = document.getElementById("staffContact").value;
        const joiningDate = document.getElementById("joiningDate").value;
        const staffRole = document.getElementById("staffRole").value;
        const staffStatus = document.querySelector('input[name="staffStatus"]:checked').value;
        const staffImageInput = document.getElementById("staffImage");

        if (!staffName || !staffEmail || !staffContact || !joiningDate || !staffRole || !staffStatus) {
            alert("Please fill in all required fields");
            return;
        }

        const formData = new FormData();

        const staffData = {
            staffName: staffName,
            emailAddress: staffEmail,
            contact: staffContact,
            joiningDate: joiningDate,
            role: staffRole,
            status: staffStatus.toUpperCase(),
        };

        formData.append("staff", JSON.stringify(staffData));

        if (staffImageInput.files && staffImageInput.files[0]) {
            formData.append("staffImage", staffImageInput.files[0]);
        }

        try {
            await createStaff(formData);

            document.getElementById("staffForm").reset();

            const modal = bootstrap.Modal.getInstance(
                document.getElementById("addStaffModal")
            );
            modal.hide();
        } catch (error) {}
    });

    async function saveRowChanges(row, staffId) {
        const cells = row.cells;

        const formData = new FormData();
        const staffData = {};

        staffData.staffName = cells[3].textContent.trim();
        staffData.emailAddress = cells[4].textContent.trim();
        staffData.contact = cells[5].textContent.trim();
        staffData.joiningDate = cells[6].textContent.trim();
        staffData.role = cells[7].querySelector("select") ?
            cells[7].querySelector("select").value :
            cells[7].textContent.trim();
        staffData.status = cells[8].querySelector("select") ?
            cells[8].querySelector("select").value :
            "ACTIVE";

        formData.append("staff", JSON.stringify(staffData));

        try {
            await updateStaff(staffId, formData);
        } catch (error) {
            cancelRowEditing(row);
        }
    }
});