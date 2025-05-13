import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyCbu-hr7OqflWwwqVWhGRXrIe4fSbvEuYk",
    authDomain: "login-d3c9a.firebaseapp.com",
    projectId: "login-d3c9a",
    storageBucket: "login-d3c9a.appspot.com",
    messagingSenderId: "250223725753",
    appId: "1:250223725753:web:b1874f23cd3032ecd25f68",
    measurementId: "G-RPYPEEP50P"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

//  forgotPassword

document.getElementById("forgotPassword").addEventListener("click", function () {
    const email = document.getElementById("EmailId").value;
    const message = document.getElementById("message");

    if (!email) {
        message.innerText = "Please enter a valid email.";
        return;
    }
    sendPasswordResetEmail(auth, email)
        .then(() => {
            message.innerText = "Password reset email sent! Check your inbox.";
            message.style.color = "green";
        })
        .catch((error) => {
            message.innerText = error.message;
        });
});
// --------------------------------
//  SignUp
// --------------------------------

const submit = document.getElementById("signup");

submit.addEventListener("click", function (event) {
    event.preventDefault();

    const fullName = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const messageBox = document.getElementById("messageBox1");
    function playSound(type) {
        const filePath = type === "success" ? "audios/bubble-pop-2-293341.mp3" : "audios/bubble-pop-2-293341.mp3";
        const audio = new Audio(filePath);
        audio.play().catch(error => console.error("Audio play error:", error));
    }
    function showMessage(message, type) {
        messageBox.innerText = message;
        messageBox.className = type;
        messageBox.style.display = "block";
        playSound(type);
        setTimeout(() => {
            messageBox.style.display = "none";
        }, 3000);
    }

    const fullNamePattern = /^[A-Za-z\s]{8,16}$/;
    const emailPattern = /^[a-z\d]+@(gmail|yahoo|outlook)\.(com|in|org|co)$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[$%&#@]).{4,10}$/;

    if (!fullNamePattern.test(fullName)) {
        showMessage("Please enter a valid full name (8-16 letters only).", "error");
        return;
    }
    if (!emailPattern.test(email)) {
        showMessage("Invalid email format! Use Gmail, Yahoo, or Outlook.", "error");
        return;
    }
    if (!passwordPattern.test(password)) {
        showMessage("Weak password! Use 4+ chars, letters, numbers & symbols.", "error");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            set(ref(database, "users/" + user.uid), {
                email: email,
                password: password
            })
                .then(() => {
                    showMessage("Your account has been successfully created! 🎉", "success");
                    setTimeout(() => {
                        const signUpModalEl = document.getElementById("signupModal");
                        if (signUpModalEl) {
                            const signUpModal = bootstrap.Modal.getInstance(signUpModalEl);
                            if (signUpModal) signUpModal.hide();
                        }
                        const signInModalEl = document.getElementById("signInModal");
                        if (signInModalEl) {
                            const signInModal = new bootstrap.Modal(signInModalEl);
                            signInModal.show();
                        }
                    }, 1000);
                })
                .catch((dbError) => {
                    console.error("Database write error: ", dbError);
                    showMessage("Failed to save user data. Please check your database rules.", "error");
                });
        })
        .catch((error) => {
            console.error("Error: ", error.message);
            showMessage("Oops! " + error.message, "error");
        });
});

// -----------------------
// SignIn
// -----------------------

const loginButton = document.getElementById("SignIn");
const messageBox = document.getElementById("messageBox2");

function showMessage(message, type) {
    messageBox.textContent = message;
    messageBox.className = type;
    messageBox.style.display = "block";

    setTimeout(() => {
        messageBox.style.display = "none";
    }, 3000);
}

loginButton.addEventListener("click", function (event) {
    event.preventDefault();

    const email = document.getElementById("EmailId").value;
    const password = document.getElementById("passwordVerifycation").value;

    const emailPattern = /^[a-z\d]+@(gmail|yahoo|outlook)+\.(com|in|org|co)$/;

    if (!emailPattern.test(email)) {
        showMessage("Please enter a valid email address (e.g., user@gmail.com).", "error");
        return;
    }

    if (!password) {
        showMessage("Please enter your password.", "error");
        return;
    }
    const demoCredentials = {
        email: "user@gmail.com",
        password: "User@123"
    };
    if (email === demoCredentials.email && password === demoCredentials.password) {
        showMessage("Login successful with demo credentials!", "success");
        setTimeout(() => (window.location.href = "./dashboard.html"), 1500);
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showMessage("Login successful!", "success");
            setTimeout(() => (window.location.href = "./dashboard.html"), 1500);
        })
        .catch((error) => {
            const errorCode = error.code;

            if (errorCode === "auth/user-not-found") {
                showMessage("User not found. Please register first.", "error");
            } else if (errorCode === "auth/wrong-password") {
                showMessage("Password is incorrect. Please try again.", "error");
            } else {
                showMessage("An error occurred: " + error.message, "error");
            }
        });
});

// ----------------------------
// continue with Google
// ----------------------------

const handleGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        const result = await signInWithPopup(auth, provider);

        setTimeout(() => {
            window.location.href = "./dashboard.html";
        }, 1000);

    } catch (error) {
        console.error("Google Sign-In Error:", error.code, error.message);
        const errorDisplay = document.getElementById("error-message");
        if (errorDisplay) {
            errorDisplay.innerText = `Google Sign-In failed: ${error.message}`;
            errorDisplay.style.display = "block";
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const googleButton1 = document.querySelector("#googleConfigure1");
    const googleButton2 = document.querySelector("#googleConfigure2");

    console.log("Google buttons found:", googleButton1, googleButton2);

    if (googleButton1) googleButton1.addEventListener("click", () => handleGoogle());
    if (googleButton2) googleButton2.addEventListener("click", () => handleGoogle());
});


// -------------------
// Continue As Guest
// -------------------
document.querySelectorAll("#continueAsGuest1, #continueAsGuest2").forEach((button) => {
    button.addEventListener("click", () => {
        const toastContainer = document.querySelector(".toast-container");
        const guestToast = new bootstrap.Toast(document.getElementById("guestToast"));
        const sound = document.getElementById("toastSound");
        sessionStorage.setItem("userStatus", "guest");
        toastContainer.classList.add("show");
        guestToast.show();
        sound.play().catch(() => console.log("Autoplay blocked"));
        document.getElementById("guestToast").addEventListener("hidden.bs.toast", () => {
            setTimeout(() => {
                window.location.href = "./dashboard.html";
            }, 500);
        });
    });
});