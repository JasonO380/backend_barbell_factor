const express = require('express');

const router = express.Router();

const users = [
    {
        id:'1',
        athlete:'user1',
        email:'test@test.com',
        password:'pass1'
    },
    {
        id:'2',
        athlete:'user2',
        email:'test2@test.com',
        password:'pass2'
    }
]


router.get('/:uid', (req, res, next)=>{
    const userID = req.params.uid;
    const user = users.find(u =>{
        return u.id === userID
    })
    res.json({user: user});
});

module.exports = router;