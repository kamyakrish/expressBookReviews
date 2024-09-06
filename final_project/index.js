const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    let token;

    // Check if the token is in the Authorization header
    if (req.headers['authorization']) {
        token = req.headers['authorization'].split(' ')[1]; // Extract the token from "Bearer <token>"
    }

    // Fallback to token stored in the session (if necessary)
    if (!token && req.session.authorization) {
        token = req.session.authorization['accessToken'];
    }

    if (!token) {
        return res.status(403).json({ message: "User not logged in" });
    }

    // Verify the token
    jwt.verify(token, "access", (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }

        // If token is valid, proceed to the next middleware or route
        req.user = user;
        next();
    });
});

 
const PORT =5001;

app.use("/customer", customer_routes);
app.use("/", genl_routes);
app.listen(PORT,()=>console.log("Server is running"));