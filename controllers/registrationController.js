const database = require('../database');
const bcrypt = require("bcrypt");
let saltRounds = 10;
const jwt = require("jsonwebtoken");

async function register(req, res) {
    try {
        const data = req.body;
        const require_field = ['full_name', 'email', 'user_name', 'password'];
        let missing_filed = [];

        for (field of require_field) {
            if (!data[field]) {
                missing_filed.push(field);
            }
        }
        if (missing_filed.length > 0) {
            return res.status(404).json({ message: "All field are required", missing_filed });
        }

        let salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        let check_query = `
        SELECT  email ,user_name
        FROM user
        WHERE email=? OR user_name=?
        `;

        database.query(check_query, [data.email, data.user_name], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "DataBase Error1", err });
            }
            if (result.length > 0) {
                return res.status(500).json({ message: "Please provide a unique email and username" });
            }
            else {
                let sql = `
                INSERT INTO user 
                (full_name,email,user_name,password,topics)
                VALUES(?,?,?,?,?)
                `;
                database.query(sql, [data.full_name, data.email, data.user_name, hashedPassword, data.topics], (err, result) => {
                    if (err) {
                        return res.status(505).json({ message: "DataBase Error2", err })
                    }
                    res.status(200).json({ message: 'DONE' });
                });
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", error: error })
    }
}
async function login(req, res) {
    try {
        const data = req.body;
        let require_field = ['email', 'password'];
        let missing_filed = [];
        for (field of require_field) {
            if (!data[field]) {
                missing_filed.push(field);
            }
        }
        if (missing_filed.length > 0) {
            return res.status(400).json({ message: `Provide All Fields: ${missing_filed.join(", ")}` })
        }

        let email_sql = `
        SELECT *
        FROM user
        WHERE email=?
        `;

        database.query(email_sql, [data.email], async (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Databaser error0", err });
            }
            if (result.length > 0) {
                let user = result[0];

                let isPasswrodValid = await bcrypt.compare(data.password, user.password);
                console.log(user.password);
                if (!isPasswrodValid) {
                    return res.status(401).json({ error: "Invalid credentials" });
                }

                const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
                    expiresIn: "1h",
                });
                const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, {
                    expiresIn: "7d",
                });
                res.status(200).json({ message: "Login successful", token, refreshToken });
            }
            else {
                return res.status(404).json({ message: "Incorrect Email OR Email does not exist" });
            }
        })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
}
async function getUserProfile(req, res) {
    try {
        const id = req.userId;
        let sql = `
        SELECT full_name,email,user_name,topics 
        FROM user
        WHERE id=?
         `;
        database.query(sql, [id], (err, result) => {
            if (err) {
                res.status(500).json({ message: "Databaser Error1", err });
            }
            if (result.length < 0) {
                res.status(404).json({ message: "User Not Found" });
            }
            else {
                const user = result[0];
                res.status(200).json(user);
            }
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
}

module.exports = {
    register,
    login,
    getUserProfile
}