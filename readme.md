## Firebase Authentication System
This project implements a user authentication system using Firebase Authentication and Firebase Realtime Database. The system allows users to:

    Sign up with email and password
    Log in with email and password
    Reset forgotten passwords
    Sign in using Google Authentication
    Continue as a guest
    Store user data securely in Firebase Realtime Database

## Features
    User Registration               :-      New users can sign up with email and password.
    User Login                      :-      Existing users can log in using their credentials.
    Password Reset                  :-      Users can reset forgotten passwords via email.
    Google Authentication           :-      Users can sign in with Google.
    Guest Mode                      :-      Users can continue as a guest.
    Real-time Database Integration  :-      Stores user credentials securely.
    Audio Feedback                  :-      Plays sounds on successful/failed actions.

## Technologies Used
    Frontend    :   HTML, CSS, JavaScript
    Firebase    :   Authentication, Realtime Database
    Libraries   :   Bootstrap (for UI enhancements)

## Project Structure
    |-- audios/                     # Sound effects for feedback
    |-- dashboard.css               # Styles for dashboard
    |-- dashboard.html              # User dashboard
    |-- dashboard.js                # Logic for dashboard interactions
    |-- FirebaseConfiguration.js    # Firebase authentication logic
    |-- index.html                  # Main landing page
    |-- recipesDetails.html         # Additional feature page
    |-- startPage.css               # Styling for initial pages
    |-- readme.md                   # Documentation

## Setup Instructions
    1. Clone this repository:
        git clone https://github.com/your-repo.git
        cd your-repo
    2. Open index.html in a browser or use Live Server extension.

## Firebase Configuration
    Replace the Firebase config in FirebaseConfiguration.js with your own Firebase project credentials:
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID",
        measurementId: "YOUR_MEASUREMENT_ID"
    };

## Usage Guide
    1. Sign Up: Enter name, email, and strong password → Click Sign Up.
    2. Login: Enter registered credentials → Click Sign In.
    3. Forgot Password: Click on Forgot Password? → Enter email → Check inbox.
    4. Google Sign-In: Click Continue with Google.
    5. Guest Access: Click Continue as Guest to browse the site without login.

## Future Enhancements
    Email Verification after Sign-Up
    Profile Management (update user info)
    UI Improvements with animations
    Dark Mode Support

## Contributing
    Want to improve this project? Feel free to contribute:
    1. Fork the repository
    2. Create a new branch: git checkout -b feature-branch
    3. Commit your changes: git commit -m 'Add new feature'
    4. Push to the branch: git push origin feature-branch
    5. Open a Pull Request 


Happy Coding!