var express = require('express');
const { GET_DB } = require('../helpers/mongodb.helper');
var router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const members = await GET_DB().collection('Members').find().toArray()
  console.log("🚀 ~ router.get ~ members:", members)
  res.json({members})
});

module.exports = router;
