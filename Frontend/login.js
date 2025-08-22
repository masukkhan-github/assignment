document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const API_URL="http://localhost:5000"
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    document.getElementById("message").innerText = data.message;

    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "profile.html"; // redirect after login
    }
  } catch (err) {
    document.getElementById("message").innerText = "Error: " + err.message;
  }
});
