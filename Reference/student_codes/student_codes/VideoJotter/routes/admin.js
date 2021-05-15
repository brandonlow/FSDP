const express = require('express');
const router = express.Router();

router.get('/index',(req,res)=> {
    const value = "Administrator page";
    res.render('admin',{admin:value})   
});

module.exports=router;


