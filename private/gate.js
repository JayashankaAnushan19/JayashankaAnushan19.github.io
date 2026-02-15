function checkPassword() {
  const input = document.getElementById("password").value;

  // Change this password 👇
  const PASSWORD = "robo2026";

  if (input === PASSWORD) {
    window.location.href = "./vault.html";
  } else {
    document.getElementById("error").innerText = "Wrong password 👀";
  }
}
