document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const adminLoginForm = document.getElementById("adminLoginForm");

    // Function to handle login
    async function handleLogin(event, role) {
        event.preventDefault();

        const email = event.target.querySelector("#email").value;
        const password = event.target.querySelector("#password").value;

        if (!email || !password) {
            return alert(" Email and password are required!");
        }

        try {
            const response = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok && data.user) {
                alert(` Login Successful! Welcome, ${data.user.name}`);

                //  Store user in sessionStorage (or localStorage)
                sessionStorage.setItem("user", JSON.stringify(data.user));

                //  Redirect based on role
                window.location.href = data.user.role === "admin"
                    ? "admin-dashboard.html"
                    : "employee-dashboard.html";
            } else {
                throw new Error(data.error || "Login failed!");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert(error.message);
        }
    }

    //  Handle employee & admin login
    if (loginForm) loginForm.addEventListener("submit", (e) => handleLogin(e, "employee"));
    
    if (adminLoginForm) adminLoginForm.addEventListener("submit", (e) => handleLogin(e, "admin"));

    //  Handle user registration
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const role = "employee";

            if (!name || !email || !password || !role) {
                return alert(" All fields are required!");
            }

            try {
                const response = await fetch("http://localhost:5000/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password, role }),
                });

                const data = await response.json();

                if (response.ok) {
                    alert(" Registration Successful! Please Login.");
                    window.location.href = "index.html";
                } else {
                    alert(data.error || "Registration failed!");
                }
            } catch (error) {
                console.error("Registration error:", error);
                alert(" Server error, please try again.");
            }
        });
    }
});
