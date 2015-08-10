var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

router.get('/show/:id', function(req,res,next) {
	var posts = db.get('posts');
    posts.findById(req.params.id, function(err, post) {
		res.render('show', {
			"post": post
		}); 
	});
});

router.get('/add', function(req, res, next) {
	res.render('addpost', {
		"title": "Add Post"
	}); 
});

router.post('/add', function(req, res, next) {
	// Get form values
	var title 	= req.body.title;
	var body 	= req.body.body;
	var author 	= req.body.author;
	var date 	= new Date();

	if(req.files.mainimage) {
		var mainImageOriginalName 	= req.files.mainimage.originalname;
		var mainImageName 			= req.files.mainimage.name;
		var mainImageMime			= req.files.mainimage.mimetype;
		var mainImagePath			= req.files.mainimage.path;
		var mainImageExt			= req.files.mainimage.extension;
		var mainImageSize			= req.files.mainimage.size;
	} else {
		var mainImageName = 'noimage.png';
	}

	// Form validation
	req.checkBody('title', 'Title field is required').notEmpty();
	req.checkBody('body', 'Body field is required');

	// Check errors
	var errors = req.validationErrors();

	if(errors) {
		res.render('addpost', {
			"errors": errors,
			"title": title,
			"body": body
		});
	} else {
		var posts = db.get('posts');

		// Submit to db
		posts.insert({
			'title': title,
			'body': body,
			'date': date,
			'mainimage': mainImageName
		}, function(err, post) {
			if(err) {
				res.send('There was an issue submitting the post');
			} else {
				req.flash('success', 'Post Submitted');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});

module.exports = router;