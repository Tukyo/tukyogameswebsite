document.addEventListener("DOMContentLoaded", function () {
    const emailSpan = document.getElementById("email");

    console.log(emailSpan.textContent);

    emailSpan.addEventListener("click", function () {
        const email = "tko@tukyowave.com";
        navigator.clipboard.writeText(email).then(() => {
            console.log("Email copied to clipboard!");
            // Change font color to indicate copy success
            emailSpan.style.color = "lime";
            // Return font color to normal after 3 seconds
            setTimeout(() => {
                emailSpan.style.color = "#f3f315";
            }, 1000);
        }).catch(err => {
            console.error("Failed to copy email to clipboard", err);
        });
    });
});
