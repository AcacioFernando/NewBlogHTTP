var express = require('express');
var router = express.Router();

/*  Banco de dados */
var mongoose = require('mongoose');
var db = require('../../db');
//var comments = mongoose.model('comments');
//var post = mongoose.model('posts');


/* GET home page. */
router.get('/', function(req, res) {
  console.log("Index teste");
  res.render('index', { title: 'Express' });
});

module.exports = router;
