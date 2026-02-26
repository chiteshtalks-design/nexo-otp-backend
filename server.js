const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

let otpStore = {}; // Temporary OTP storage

// Generate OTP
app.post("/send-otp", (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email required" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    otpStore[email] = {
        otp: otp,
        createdAt: Date.now()
    };

    console.log(`OTP for ${email} is: ${otp}`);

    res.json({ message: "OTP generated successfully" });
});

// Verify OTP
app.post("/verify-otp", (req, res) => {
    const { email, otp } = req.body;

    if (!otpStore[email]) {
        return res.status(400).json({ message: "OTP not found" });
    }

    if (otpStore[email].otp === otp) {
        delete otpStore[email];
        return res.json({ message: "Login successful" });
    } else {
        return res.status(400).json({ message: "Invalid OTP" });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
