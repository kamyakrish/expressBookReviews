const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    // Retrieve the token from the session
    const token = req.session.token;

    // If no token is found, return an error
    if (!token) {
        return res.status(403).json({ message: "Authentication required" });
    }

    // Verify the token
    jwt.verify(token, "fingerprint_customer", (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }

        // If token is valid, proceed to the next middleware or route
        req.user = user; // Optionally, store the user info from the token
        next();
    });
});

 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
