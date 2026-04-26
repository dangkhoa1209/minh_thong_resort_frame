loadComponent('../components/header/index.html', 'place-header', 'dark')
loadComponent('../components/footer/index.html', 'place-footer')


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // chặn reload    

  const name = document.getElementById("contact-form-name");
  const email = document.getElementById("contact-form-email");
  const description = document.getElementById("contact-form-description");

    const data = {
      name: name.value,
      email: email.value,
      description: description.value,
      source: "contact_page"
    };


    status.textContent = "Sending...";
    status.style.color = "#888";
   status.classList.add('active');
    
    console.log('data', data);
    

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/mail/send`, {
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
