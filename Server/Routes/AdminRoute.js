import express from 'express'
import con from '../Utils/db.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'



const router = express.Router();



router.post('/adminlogin', (req, res) => {
    console.log(req.body);
    const sql = "SELECT * from admin Where email = ? and password = ?"
    con.query(sql, [req.body.email, req.body.password], (err, result) => {
        if (err) return res.json({ loginStatus: false, Error: "Query error" })

        if (result.length > 0) {
            const email = result[0].email;
            const token = jwt.sign({ role: "admin", emai: email }, "jwt_secret_key", { expiresIn: '1d' }
            );
            res.cookie('token', token)
            return res.json({ loginStatus: true });

        } else {
            return res.json({ loginStatus: false, Error: "Wrong Email or Password" });
        }
    });

});

router.get('/category', (req, res) => {
    const sql = "SELECT * FROM category";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})



router.post('/add_category', (req, res) => {
    const sql = "INSERT INTO category (`name`) VALUES (?)"
    con.query(sql, [req.body.category], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true })
    })
})

router.post('/add_employee', (req, res) => {
    const sql = `INSERT INTO employee 
    (name, email, password, address, salary, image, category_id) 
    VALUES (?)`;

//     // Hash password
//     bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
//         if (err) return res.json({ Status: false, Error: "Password hashing failed" });

//         // Retrieve other values from the request body
//         const { name, email, address, salary, image, category_id } = req.body;

//         const values = [
//             name,
//             email,
//             hash,
//             address,
//             salary,
//             image,
//             category_id
//         ];

//         // Execute the SQL query
//         con.query(sql, values, (err, result) => {
//             if (err) {
//                 console.error("Error executing query:", err);
//                 return res.json({ Status: false, Error: "Query execution failed" });
//             }
//             return res.json({ Status: true });
//         });
//     });
// });
    bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
        if (err) return res.json({ Status: false, Error: "Query Error1" })
        const values = [
            req.body.name,
            req.body.email,
            hash,
            req.body.address,
            req.body.salary,
            req.body.image,
            req.body.category_id
        ]
        con.query(sql, [values], (err, result) => {
            if (err) return res.json({ Status: false, Error: "Query Error2" })
            return res.json({ Status: true })
        })
    })
})

export { router as adminRouter }