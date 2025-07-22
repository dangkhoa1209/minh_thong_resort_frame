loadComponent('../components/header/index.html', 'place-header', 'dark')
loadComponent('../components/footer/index.html', 'place-footer')


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // chặn reload    

    // Lấy dữ liệu từ form
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    status.textContent = "Sending...";
    status.style.color = "#888";
   status.classList.add('active');
    console.log('status', status);
    

    try {
      // Gửi dữ liệu (thay URL bằng API backend của bạn)
      const response = await fetch("https://your-backend.com/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        status.textContent = "Thank you! Your message has been sent.";
        status.style.color = "green";
        form.reset();
      } else {
        throw new Error("Server error");
      }
    } catch (error) {
      status.textContent = "Failed to send. Please try again.";
      status.style.color = "red";
    }
  });
});
