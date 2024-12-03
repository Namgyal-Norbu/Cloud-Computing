document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const uploadForm = document.getElementById("uploadForm");
  const fileManagementSection = document.getElementById("file-management-section");
  const fileList = document.getElementById("fileList");

  loginBtn.addEventListener("click", () => {
    alert("Google Sign-In functionality to be implemented.");
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
    fileManagementSection.style.display = "block";
  });

  logoutBtn.addEventListener("click", () => {
    alert("Google Sign-Out functionality to be implemented.");
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
    fileManagementSection.style.display = "none";
  });

  uploadForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const file = document.getElementById("fileInput").files[0];
    const password = document.getElementById("passwordInput").value;

    if (file && password) {
      alert(`File ${file.name} will be encrypted with the password.`);
      const listItem = document.createElement("li");
      listItem.textContent = `${file.name} - Encrypted`;
      fileList.appendChild(listItem);
    }
  });
});
