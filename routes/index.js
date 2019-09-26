const express = require('express');
const router = express.Router();

router.all("*", async (req, res, next) => {

    try {
       console.log(req, "allo")
        res.status(200).json({message:'ssss'})
    } catch (e) {
        throw e;
    };

    next();
});

module.exports = {
    router: router
} 
