const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Ecocement' });
  // const query = req.query;
  // console.log(query);
});

module.exports = router;
