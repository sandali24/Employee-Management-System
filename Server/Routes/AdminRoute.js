import express from 'express'
import con from '../Utils/db.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import multer from 'multer'
import path from 'path'




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



// image upload 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
})
// end imag eupload 

router.post('/add_employee',upload.single('image'), (req, res) => {
    const sql = `INSERT INTO employee 
    (name,email,password, address, salary,image, category_id) 
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

    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        const values = [
            req.body.name,
            req.body.email,
            hash,
            req.body.address,
            req.body.salary, 
            req.file.filename,
            req.body.category_id
        ]
        con.query(sql, [values], (err, result) => {
            if(err) return res.json({Status: false, Error: err})
            return res.json({Status: true})
        })
    })
})

export { router as adminRouter }