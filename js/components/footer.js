let arrow = document.querySelector(".footer-arrow");
let input = document.querySelector(".footer-input");
let statusFeild = document.getElementById("footer-form-status");


if (!arrow || !input || !statusFeild) {
  setTimeout(() => {
     arrow = document.querySelector(".footer-arrow");
     input = document.querySelector(".footer-input");
     statusFeild = document.getElementById("footer-form-status");
    if (!arrow || !input || !statusFeild) {
      return
    }

    start()
  }, 500)
}else {
   start()
}
function start() {
  
  arrow.addEventListener("click", async () => {
    const email = input.value.trim();

    console.log('email', email);
    

    statusFeild.textContent = "Sending...";
    statusFeild.style.color = "#888";
    statusFeild.classList.add('active');

    // Validate email
    if (!email) {
      statusFeild.textContent = "Please enter a valid email.";
      statusFeild.style.color = "red";
      return;
    }



    try {
      // Gửi request tới server (thay URL bằng API thật)
      const response = await fetch("http://localhost:3001/api/mail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        statusFeild.textContent = "Thank you! Your email has been sent.";
        statusFeild.style.color = "green";
        input.value = "";
      } else {
        throw new Error("Server error");
      }
    } catch (error) {
      statusFeild.textContent = "Failed to send. Please try again.";
      statusFeild.style.color = "red";
    }
  });
}