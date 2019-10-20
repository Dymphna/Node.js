const fs = require('fs');


module.exports = {
    addVendorPage: (req, res) => {
        res.render('add-users.ejs', {
            title: "Welcome to Vendors | Add a new vendors "
            ,message: ''
        });
    },
    addVendor: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded");
        }

        let message = '';
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let username = req.body.username;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = username + '.' + fileExtension;

        let usernameQuery = `SELECT * FROM vendors WHERE user_name = ?`;

        db.query(usernameQuery, [username], (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('add-users.ejs', {
                    message,
                    title: "Welcome to Vendors | Add a new vendor"
                });
            } else {
                // check the filetype before uploading it
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif' ){
                    // upload the file to the /public/assets/img diretory
                    uploadedFile.mv(`public/assets/img/${image_name}`, (err) => {
                        if (err){
                            console.error(err);
                            return res.status(500).send(err);
                        }
                        //send the vendors details to the dqtabase
                        let query = `INSERT INTO vendors (first_name, last_name, image, user_name) VALUES (?,?,?,?)`;
                        db.query(query, [first_name, last_name, image_name, username], (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/');
                        });
                    });
                }else{
                    message = "Invalid File format. Only 'gif', 'jpeg', and 'png' images are allowed.";
                    res.render('add-users.ejs', {
                        message,
                        title: "Welcome to Vendors | Add a new vendor"
                    });
                }
            }
        });
    },
    editVendorPage: (req, res) => {
        let vendorId = req.params.id;
        let query = "SELECT * FROM vendors WHERE id = '" + vendorId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-users.ejs', {
                title: "Edit  User"
                ,vendor: result[0]
                ,message: ''
            });
        });
    },
    editVendor: (req, res) => {
        let vendorId = req.params.id;
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        
        let query = "UPDATE `vendors` SET `first_name` = '" + first_name + "', `last_name` = '"  + last_name  + "' WHERE `vendors`.`id` = '" + vendorId + "'";
        db.query(query,(err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    },
    deleteVendor: (req, res) => {
        let vendorId = req.params.id;
        let getImageQuery = 'SELECT image from `vendors` WHERE id = "' + vendorId + '"';
        let deleteUserQuery = 'DELETE FROM vendors WHERE id = "' + vendorId + '"';

        db.query(getImageQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            let image = result[0].image;

            fs.unlink(`public/assets/img/${image}`, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                db.query(deleteUserQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/');
                });
            });
        });
    }
};

