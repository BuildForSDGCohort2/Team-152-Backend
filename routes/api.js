'use strict'

const router = require('express').Router()
const models = require('../models');
const { sanitizePhoneNumber, fileUploadHandler } = require('../services/utilHelper')
const { check, body, param, checkSchema} = require('express-validator')
const AuthController = require('../controllers/authController')

const APIRoutes = function(passport) {

    router.post('/signup',[
      check('email').notEmpty().isEmail(),
      body('email').custom(value => {
        return models.User.findOne({where :{ email: value }}).then(user => {
        if (user) {
          return Promise.reject('E-mail already in use');
        }
      })
    }),
    body('phone').notEmpty().custom(value => {
      return sanitizePhoneNumber(value)
    }),
    check('name').notEmpty().isLength({ min: 3 }),
    check('gender').notEmpty().isLength({ min: 3 }).isString(),
    check('jobRole').notEmpty().isLength({ min: 3 }).isString(),
    check('location').notEmpty().isLength({ min: 3 }).isString(),
    check('password').notEmpty().isLength({ min : 8 }).isAlphanumeric(),
    body('passwordConfirmation').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      // Indicates the success of this synchronous custom validator
      return true;
    })], AuthController.signUp);

    //authenticate user
    router.post('/authenticate', [check('password').notEmpty(),check('email').notEmpty().isEmail(), body('email').custom((value)=> {
      return models.User.findOne({where :{ email: value }}).then(user => {
      if (!user) {
        return Promise.reject('E-mail does not exist');
      }
    })
  }), check('password').notEmpty()], AuthController.authenticate)

    router.post('/create', [
      check('email').notEmpty().isEmail().trim(),
      check('referrer').optional({ checkFalsy: true }).notEmpty().trim().isLength({ min: 5 }),
      body('phone').
      notEmpty().trim().custom(value => {
        return sanitizePhoneNumber(value)
      }),
      body('phone').trim().custom(value => {
        return models.User.findOne({where :{ phone: sanitizePhoneNumber(value) }}).then(user => {
        if (user) {
          return Promise.reject('phone number already taken');
        }
      })
    }), check('referrer').optional({ checkFalsy:true }).isLength({ min: 5 })], AuthController.create)


    //users login route
    router.post('/login', [body('phone').notEmpty().custom(value => {
      return sanitizePhoneNumber(value)
    }), body('phone').custom(value => {
      return models.User.findOne({where :{ phone: sanitizePhoneNumber(value) }}).then(user => {
      if (!user) {
        return Promise.reject('unknown user');
      }
    })
  })], AuthController.login)

    //verify token sent to user in attempt to login or register new user
    router.post('/verify', [check('code').notEmpty().isLength({ min: 4 }).isInt(), body('phone').notEmpty().custom(value => {
        return sanitizePhoneNumber(value)
      })], AuthController.verify)

    router.post('/check', [body('phone').notEmpty().custom(value => { return sanitizePhoneNumber(value)}), body('phone').custom(value => {
      return models.User.findOne({where :{ phone: sanitizePhoneNumber(value) }}).then(user => {
      if (user) {
        return Promise.reject('phone number already taken');
      }
    })
  })], AuthController.check)
    
    router.patch('/users/update',[check('firstName').optional({checkFalsy: true}).notEmpty().isString().isLength({min: 3}),
            check('lastName').optional({checkFalsy: true}).notEmpty().isString().isLength({min: 3}),
            body('phone').optional({ checkFalsy: true }).notEmpty().custom(value => { return sanitizePhoneNumber(value)}),
            check('email').optional({checkFalsy: true}).notEmpty().isEmail(),
            body('phone').optional({checkFalsy: true}).custom(value => {
              return models.User.findOne({where :{ phone: sanitizePhoneNumber(value) }}).then(user => {
              if (user) {
                return Promise.reject('phone number already taken');
              }
            })
          })], AuthController.update)

          return router
            

}

module.exports = APIRoutes
