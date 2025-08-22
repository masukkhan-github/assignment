const token = localStorage.getItem("token");
if (!token) {
  alert("You must login first");
  window.location.href = "login.html";
}

// Fetch profile
async function loadProfile() {
  try {
    const API_URL="http://localhost:5000"
    const res = await fetch(`${API_URL}/profile`, {
      headers: { "Authorization": "Bearer " + token }
    });
    const data = await res.json();

    if (data.email) {
      document.getElementById("profile").innerText = `Name: ${data.name}, Email: ${data.email}`;
    } else {
      document.getElementById("profile").innerText = data.message;
    }
  } catch (err) {
    document.getElementById("profile").innerText = "Error: " + err.message;
  }
}
loadProfile();

// Update profile
document.getElementById("updateForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const password = document.getElementById("password").value;

  try {
    const API_URL="http://localhost:5000"
    const res = await fetch(`${API_URL}/profile`,  {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ name, password })
    });

    const data = await res.json();
    document.getElementById("message").innerText = data.message;
    loadProfile();
  } catch (err) {
    document.getElementById("message").innerText = "Error: " + err.message;
  }
});

// Delete account
document.getElementById("deleteBtn").addEventListener("click", async () => {
  try {
    const API_URL="http://localhost:5000"
    const res = await fetch(`${API_URL}/profile`,  {
      method: "DELETE",
      headers: { "Authorization": "Bearer " + token }
    });

    const data = await res.json();
    document.getElementById("message").innerText = data.message;

    if (data.message === "User deleted successfully") {
      localStorage.removeItem("token");
      window.location.href = "signup.html";
    }
  } catch (err) {
    document.getElementById("message").innerText = "Error: " + err.message;
  }
});
