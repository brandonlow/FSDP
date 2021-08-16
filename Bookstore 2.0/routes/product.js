const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');
const fs = require('fs');
const upload = require('../helpers/imageUpload');


router.post('/upload',(req, res) => {
    // Creates user id directory for upload if not exist
    if (!fs.existsSync('./public/uploads/' + req.user.id)){
    fs.mkdirSync('./public/uploads/' + req.user.id);
    }
    upload(req, res, (err) => {
    if (err) {
    res.json({file: '/img/no-image.jpg', err: err});
    } else {
    if (req.file === undefined) {
    res.json({file: '/img/no-image.jpg', err: err});
    } else {
    res.json({file: `/uploads/${req.user.id}/${req.file.filename}`});
    }
    }
    });
    })
    

module.exports = router;