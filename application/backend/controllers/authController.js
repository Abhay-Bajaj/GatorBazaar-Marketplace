const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

async function register(req, res) {
    const { fullname, username, email, password } = req.body;

    try {
        if(!fullname || !username || !email || !password) {
            return res.status(400).json({ error: "Missing fields" });
        }
    

        const existingUsername = await userModel.getUserByUsername(username);

        if(existingUsername) {
            return res.status(400).json({ error: "Username already in use" });
        }

        const existingEmail = await userModel.getUserByEmail(email);

        if(existingEmail) {
            return res.status(400).json({ error: "Email already in use"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userId = await userModel.createUser(fullname, username, email, hashedPassword);

        req.session.userId = userId;

        res.status(201).json({ message: "User registered", userId});

    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

async function login(req, res) {
    const {username, password} = req.body;

    try {
        if(!username || !password) {
            return res.status(400).json({ error: "Missing username or password"});
        }

        const user = await userModel.getUserByUsername(username);
        if(!user) {
            return res.status(401).json({ error: "Invalid username or password"});
        }

        if(user.is_suspended) {
            return res.status(403).json({ error: "Account suspended"});
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if(!validPassword) {
            return res.status(401).json({ error: "Invalid username or password"})
        }

        req.session.regenerate((err) => {
            if (err) {
                return res.status(500).json({ error: "Session error" });
            }

            req.session.userId = user.user_id;

            res.json({ message: "Logged in"});
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

module.exports = {
    register,
    login
}