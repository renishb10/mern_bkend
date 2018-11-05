const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load Models
const Post = require('../../models/Post');

//Validation
const validatePostInput = require('../../validators/post');

// @route   GET api/posts
// @desc    Gets all post
// @access  Public
router.get('/', (req, res) => res.json({msg: 'Posts works!'}));

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    //Validate request
    const { errors, isValid } = validatePostInput(req.body);
    if(!isValid) {
        return res.status(400).json(errors);
    }

    //Create Post
    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    newPost.save().then(post => res.json(post));
});

module.exports = router;