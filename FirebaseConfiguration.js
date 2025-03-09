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
 
 // --------------------------------
 //  SignUp
 // --------------------------------
 
 
 const submit = document.getElementById("signup");
 
 submit.addEventListener("click", function (event) {
     event.preventDefault();
 
     const fullName = document.getElementById("fullname").value;
     const email = document.getElementById("email").value;
     const password = document.getElementById("password").value;
 
     const fullNamePattern = /^[A-Za-z\s]{8,16}$/; // Fixed regex (previously incorrect)
     const emailPattern = /^[a-z\d]+@(gmail|yahoo|outlook)\.(com|in|org|co)$/;
     const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[$%&#@]).{8,16}$/;
 
     if (!fullNamePattern.test(fullName)) {
         alert("Full Name must be between 8 to 16 characters.");
         return;
     }
     if (!emailPattern.test(email)) {
         alert("Invalid email format! Please use a valid email (e.g., user@gmail.com).");
         return;
     }
     if (!passwordPattern.test(password)) {
         alert(
             "Invalid password format! Password must contain at least:\n" +
             "- 1 lowercase letter\n" +
             "- 1 uppercase letter\n" +
             "- 1 digit\n" +
             "- 1 special character ($, %, &, #, @)\n" +
             "- Length between 8-16 characters."
         );
         return;
     }
 
     createUserWithEmailAndPassword(auth, email, password) // Fixed incorrect parameter (fullName removed)
         .then((userCredential) => {
             const user = userCredential.user;
 
             set(ref(database, "users/" + user.uid), {
                 email: email,
                 password: password
             })
                 .then(() => {
                     console.log("User data successfully written to database!");
                     alert("Account created successfully!");
 
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
                         // window.location.href = "./dashboard.html"; // Redirect after delay
                     }, 1000); // 1-second delay to ensure alert is seen
                 })
                 .catch((dbError) => {
                     console.error("Database write error: ", dbError);
                     alert("Failed to save user data. Please check your database rules.");
                 });
         })
         .catch((error) => {
             console.error("Error: ", error.message);
             alert("Error: " + error.message);
         });
 });
 
 // -----------------------
 // SignIn
 // -----------------------
 
 // Define demo credentials
 
 const demoCredentials = {
     email: "demo@gmail.com",
     password: "Demo@123",
 };
 
 const loginButton = document.getElementById("SignIn");
 loginButton.addEventListener("click", function (event) {
     event.preventDefault();
 
     const email = document.getElementById("EmailId").value;
     const password = document.getElementById("passwordVerifycation").value;
 
     const emailPattern = /^[a-z\d]+@(gmail|yahoo|outlook)+\.(com|in|org|co)$/;
 
     if (!emailPattern.test(email)) {
         alert("Please enter a valid email address (e.g., user@gmail.com).");
         return;
     }
 
     if (!password) {
         alert("Please enter your password.");
         return;
     }
 
     if (email === demoCredentials.email && password === demoCredentials.password) {
         alert("Login successful with demo credentials!");
         window.location.href = "./dashboard.html";
         return;
     }
 
     signInWithEmailAndPassword(auth, email, password)
         .then((userCredential) => {
             alert("Login successful!");
             window.location.href = "./dashboard.html";
         })
         .catch((error) => {
             const errorCode = error.code;
 
             if (errorCode === "auth/user-not-found") {
                 alert("User not found. Please register first.");
             } else if (errorCode === "auth/wrong-password") {
                 alert("Password is incorrect. Please try again.");
             } else {
                 alert("An error occurred: " + error.message);
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
         alert(`Google Sign-In failed:\nError Code: ${error.code}\nMessage: ${error.message}`);
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
             }, 1000);
         });
     });
 });