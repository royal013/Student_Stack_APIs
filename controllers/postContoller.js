const database = require("../database");
const path = require('path');

async function newPost(req, res) {
    try {
        const data = req.body;
        const userId = req.userId;
        if (!data) {
            return res.status(400).json({ message: 'Data not found' });
        }
        const image_ext = ['jpg', 'png', 'jpeg', 'webp'];
        const extension = req.file.filename.split('.').pop();
        if (!image_ext.includes(extension)) {
            return res.status(403).json({ message: "File Not Allowed, Please enter image file" })
        }
        const fields = ['user_id', 'photo', 'description', 'feeling', 'location', 'tagged_friends', 'topics'];
        const missing_field = [];
        const current_field = [];
        const values = [userId, path.resolve(req.file.path)];
        for (const field of fields) {
            if (!data[field]) {
                missing_field.push(field);
            }
            else {
                current_field.push(field);
                values.push(data[field])
            }
        }
        if (missing_field.includes('description')) {
            return res.status(400).json({ message: "Description Field is Required" });
        }
        let sql = `
        INSERT INTO post (user_id,photo,${current_field.join(', ')})
        VALUES (?,?,${current_field.map(() => '?').join(', ')})
       `;

        database.query(sql, values, (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Database Error1", err });
            }
            else {
                res.status(200).json({ message: "Inserted" });
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
}

async function getAllPost(req, res) {
    try {
        const userId = req.userId;
        const sql = `
        SELECT topics 
        FROM user
        WHERE id=?
        `;
        database.query(sql, [userId], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Database Error1" }, err);
            }
            else {
                const topics = result[0].topics;
                const topics_array = topics.split(",");

                const query = 'SELECT * FROM post WHERE topics IN (?)';
                database.query(query, [topics_array], (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: "Database Error2" }, err);
                    }
                    else {
                        res.status(200).json(result);
                    }
                })
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error })
    }
}

module.exports = {
    newPost,
    getAllPost
}