const arrow = document.querySelector(".footer-arrow");
const input = document.querySelector(".footer-input");
const status = document.getElementById("footer-form-status");
arrow.addEventListener("click", async () => {
  const email = input.value.trim();

  status.textContent = "Sending...";
  status.style.color = "#888";
  status.classList.add('active');

  // Validate email
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    status.textContent = "Please enter a valid email.";
    status.style.color = "red";
    return;
  }



  try {
    // Gửi request tới server (thay URL bằng API thật)
    const response = await fetch("https://your-backend.com/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      status.textContent = "Thank you! Your email has been sent.";
      status.style.color = "green";
      input.value = "";
    } else {
      throw new Error("Server error");
    }
  } catch (error) {
    status.textContent = "Failed to send. Please try again.";
    status.style.color = "red";
  }
});

