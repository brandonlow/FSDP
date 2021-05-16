const express = require('express');
const { route } = require('./main');
const router = express.Router();


router.get('/showprofilesuccess',(req,res)=>{
	res.render('/user/profile')
});
router.post('/register', (req, res) => {
    let errors = []
    let success_msg = "";
    // Do exercise 3 here
    let password=req.body.password;
    console.log(password);
    let password2=req.body.password2;
    console.log(password2);
    if ( password.length < 4 ){
        errors.push({text:"password must be at least 4 characters"});
    }
    if (password!==password2){
        errors.push({text:"password do not match"});
    }
    if(errors.length > 0 ){
        res.render('user/register',{
            errors:errors
        });
        

    }else{
        success_msg=req.body.email+"registered successfully";
        res.render('user/login',{success_msg:success_msg});

    }


});


module.exports = router;
