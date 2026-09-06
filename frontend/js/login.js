// =====================================================
// ZENFIT LOGIN / SIGNUP
// =====================================================

let usersDB = [];


// =====================================================
// LOAD USERS
// =====================================================

async function loadUsers() {
    try {

        const localUsers =
            JSON.parse(
                localStorage.getItem("zenfit_users") || "null"
            );

        if (localUsers && Array.isArray(localUsers)) {
            usersDB = localUsers;
            return;
        }


        // users.json is two levels above frontend/js/
        const response =
            await fetch("../../data/users.json");


        if (!response.ok) {
            throw new Error("Unable to load users");
        }


        const data =
            await response.json();


        usersDB =
            data.users || [];


        localStorage.setItem(
            "zenfit_users",
            JSON.stringify(usersDB)
        );


    } catch (error) {

        console.error(
            "Error loading users:",
            error
        );


        // Fallback demo users
        usersDB = [
            {
                id: 1,
                fullName: "Akshat Sharma",
                email: "akshat@zenfit.com",
                password: "akshat123"
            },
            {
                id: 2,
                fullName: "Demo User",
                email: "demo@zenfit.com",
                password: "demo1234"
            },
            {
                id: 3,
                fullName: "Demon",
                email: "demon@gmail.com",
                password: "demo1234"
            }
        ];
    }
}


// =====================================================
// ELEMENTS
// =====================================================

const loginView =
    document.getElementById("loginView");

const signupView =
    document.getElementById("signupView");

const showSignupBtn =
    document.getElementById("showSignup");

const showLoginBtn =
    document.getElementById("showLogin");

const loginForm =
    document.getElementById("loginForm");

const signupForm =
    document.getElementById("signupForm");


// =====================================================
// SHOW LOGIN
// =====================================================

function showLogin() {

    if (loginView) {
        loginView.style.display = "block";
    }

    if (signupView) {
        signupView.style.display = "none";
    }
}


// =====================================================
// SHOW SIGNUP
// =====================================================

function showSignup() {

    if (loginView) {
        loginView.style.display = "none";
    }

    if (signupView) {
        signupView.style.display = "block";
    }
}


// =====================================================
// TOGGLE BUTTONS
// =====================================================

if (showSignupBtn) {

    showSignupBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            showSignup();
        }
    );
}


if (showLoginBtn) {

    showLoginBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            showLogin();
        }
    );
}


// =====================================================
// PASSWORD VISIBILITY
// =====================================================

document
    .querySelectorAll(".toggle-password")
    .forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const input =
                    document.getElementById(
                        button.dataset.target
                    );

                if (!input) {
                    return;
                }


                if (input.type === "password") {

                    input.type = "text";

                    button.textContent = "🙈";

                } else {

                    input.type = "password";

                    button.textContent = "👁";
                }
            }
        );
    });


// =====================================================
// TOAST MESSAGE
// =====================================================

function showToast(message, type = "success") {

    let toast =
        document.getElementById("toast");


    if (!toast) {

        toast =
            document.createElement("div");

        toast.id = "toast";

        document.body.appendChild(toast);
    }


    toast.textContent = message;


    toast.className =
        `toast ${type}`;


    toast.classList.add("show");


    setTimeout(function () {

        toast.classList.remove("show");

    }, 3000);
}


// =====================================================
// LOGIN
// =====================================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const emailInput =
                document.getElementById("loginEmail");

            const passwordInput =
                document.getElementById("loginPassword");


            if (!emailInput || !passwordInput) {
                return;
            }


            const email =
                emailInput.value
                    .trim()
                    .toLowerCase();


            const password =
                passwordInput.value;


            if (!email || !password) {

                showToast(
                    "Please enter email and password",
                    "error"
                );

                return;
            }


            // Make sure users are loaded
            if (usersDB.length === 0) {
                await loadUsers();
            }


            const user =
                usersDB.find(function (item) {

                    return (
                        item.email &&
                        item.email.toLowerCase() === email
                    );
                });


            if (!user) {

                showToast(
                    "No account found with this email",
                    "error"
                );

                return;
            }


            if (user.password !== password) {

                showToast(
                    "Incorrect password",
                    "error"
                );

                return;
            }


            // Save logged-in user
            localStorage.setItem(
                "zenfit_user",
                JSON.stringify(user)
            );


            localStorage.setItem(
                "currentUserEmail",
                user.email
            );


            // Keep profile data available
            const existingProfile =
                JSON.parse(
                    localStorage.getItem(
                        "zenfitProfile"
                    ) || "null"
                );


            if (!existingProfile) {

                localStorage.setItem(
                    "zenfitProfile",
                    JSON.stringify({
                        name:
                            user.fullName ||
                            user.name ||
                            "User",

                        email:
                            user.email,

                        phone: "",
                        password:
                            user.password || "",

                        gender: "",
                        age: "",
                        height: "",
                        weight: "",
                        bodyFat: "",
                        goal: ""
                    })
                );
            }


            showToast(
                "Login successful! Redirecting...",
                "success"
            );


            // IMPORTANT:
            // dashboard.html is in the same folder
            // as login.html
            setTimeout(function () {

                window.location.href =
                    "dashboard.html";

            }, 1000);

        }
    );
}


// =====================================================
// SIGNUP
// =====================================================

if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const nameInput =
                document.getElementById("signupName");

            const emailInput =
                document.getElementById("signupEmail");

            const passwordInput =
                document.getElementById(
                    "signupPassword"
                );


            if (
                !nameInput ||
                !emailInput ||
                !passwordInput
            ) {
                return;
            }


            const fullName =
                nameInput.value.trim();


            const email =
                emailInput.value
                    .trim()
                    .toLowerCase();


            const password =
                passwordInput.value;


            if (
                !fullName ||
                !email ||
                !password
            ) {

                showToast(
                    "Please fill all fields",
                    "error"
                );

                return;
            }


            if (password.length < 6) {

                showToast(
                    "Password must be at least 6 characters",
                    "error"
                );

                return;
            }


            if (usersDB.length === 0) {
                await loadUsers();
            }


            const existingUser =
                usersDB.find(function (user) {

                    return (
                        user.email &&
                        user.email.toLowerCase() === email
                    );
                });


            if (existingUser) {

                showToast(
                    "Email already registered",
                    "error"
                );

                return;
            }


            const newUser = {

                id:
                    usersDB.length > 0
                        ? Math.max(
                            ...usersDB.map(
                                user =>
                                    user.id || 0
                            )
                        ) + 1
                        : 1,

                fullName,

                email,

                password,

                createdTime:
                    new Date().toISOString()
            };


            usersDB.push(newUser);


            localStorage.setItem(
                "zenfit_users",
                JSON.stringify(usersDB)
            );


            localStorage.setItem(
                "zenfit_user",
                JSON.stringify(newUser)
            );


            localStorage.setItem(
                "currentUserEmail",
                email
            );


            localStorage.setItem(
                "zenfitProfile",
                JSON.stringify({

                    name: fullName,

                    email,

                    phone: "",

                    password,

                    gender: "",

                    age: "",

                    height: "",

                    weight: "",

                    bodyFat: "",

                    goal: ""
                })
            );


            showToast(
                "Account created successfully!",
                "success"
            );


            setTimeout(function () {

                window.location.href =
                    "dashboard.html";

            }, 1000);

        }
    );
}


// =====================================================
// INPUT ANIMATION
// =====================================================

document
    .querySelectorAll("input")
    .forEach(function (input) {

        input.addEventListener(
            "focus",
            function () {

                input.parentElement?.classList.add(
                    "focused"
                );
            }
        );


        input.addEventListener(
            "blur",
            function () {

                if (!input.value) {

                    input.parentElement?.classList.remove(
                        "focused"
                    );
                }
            }
        );
    });


// =====================================================
// GOOGLE SIGN-IN PLACEHOLDER
// =====================================================

const googleBtn =
    document.querySelector(
        ".google-btn"
    );


if (googleBtn) {

    googleBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            showToast(
                "Google Sign-In is not configured yet.",
                "error"
            );
        }
    );
}


// =====================================================
// INITIALIZE
// =====================================================

loadUsers();