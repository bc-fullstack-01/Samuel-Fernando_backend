/* eslint-disable no-underscore-dangle */
const createError = require('http-errors');
const express = require('express');

const router = express.Router();
const { Post, Connection } = require('../models');

router
  .route('/')
  .all((req, res, next) => Promise.resolve()
    .then(() => Connection.then())
    .then(() => {
    // console.log(`Request from : ${req.originalUrl}`);
    // console.log(`Request type : ${req.method}`);
    // console.log(`Request params : ${req.params}`);
      next();
    })
    .catch((err) => next(err)))

/**
 * @route GET /posts
 * @group Post - api
 * @returns {Array.<Post>} 200 - Array of posts
 * @returns {Error} default - unexpected error
 * @security JWT
 */
  .get((req, res, next) => Promise.resolve()
    .then(() => Post.find({ user: req.user._id }).populate('comments'))
    .then((data) => res.status(200).json(data))
    .catch((err) => next(err)))

/**
 * @route POST /posts
 * @param {Post.model} post.body.required
 * @group Post - api
 * @security JWT
 */
  .post((req, res, next) => Promise.resolve()
    .then(() => new Post({ ...req.body, user: req.user._id }).save())
    .then((data) => res.status(201).json(data))
    .catch((err) => next(err)));

router
  .param('id', (req, res, next, id) => Promise.resolve()
    .then(() => Connection.then())
    .then(() => {
    // console.log(`Request from : ${req.originalUrl}`);
    // console.log(`Request type : ${req.method}`);
    // console.log(`Request id : ${id}`);
      next();
    })
    .catch((err) => next(err)))
  .route('/:id')

/**
 * @route GET /posts/{id}
 * @param {string} id.path.required
 * @group Post - api
 * @returns {<Post>} 200 - Return a post
 * @returns {Error} 404 - Not found
 * @security JWT
 */
  .get((req, res, next) => Promise.resolve()
    .then(() => Post.findById(req.params.id).populate({
      path: 'comments',
    }))
    .then((data) => {
      if (data) {
        res.status(200).json(data);
      } else {
        next(createError(404));
      }
    })
    .catch((err) => next(err)))

/**
 * @route PUT /posts/{id}
 * @param {Post.model} post.body.required
 * @param {string} id.path.required
 * @group Post - api
 * @security JWT
 */
  .put((req, res, next) => Promise.resolve()
    .then(() => Post.findByIdAndUpdate(req.params.id, req.body.post, {
      runValidators: true,
    }))
    .then((data) => res.status(203).json(data))
    .catch((err) => next(err)))

/**
 * @route DELETE /posts/{id}
 * @param {string} id.path.required
 * @group Post - api
 * @security JWT
 */
  .delete((req, res, next) => Promise.resolve()
    .then(() => Post.deleteOne({ _id: req.params.id }))
    .then((data) => res.status(203).json(data))
    .catch((err) => next(err)));

module.exports = router;