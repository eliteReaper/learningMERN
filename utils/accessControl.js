const express = require('express');

const router = express.Router();

router.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001/login');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('withCredentials', 'true');
    next();
});

module.exports = router;
