'use strict';

const { sanitizePhoneNumber, referralCode } = require('../services/utilHelper')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken');
const models = require('../models');
const url = require('url')
const userService = require('../services/userService')

// The authentication controller.
const AuthController = {};

// Register a user.
AuthController.signUp = async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(422).json({ success: false, message: 'failed validation',
        code: 422, error: result.array()  });

    }
    models.sequelize.transaction((t) => {
        return models.User.create({
          name: req.body.name,
          phone: req.body.phone,
          email: req.body.email,
          gender: req.body.gender,
          location: req.body.location,
          jobRole: req.body.jobRole,
          password: req.body.password
        }, {transaction: t}).then( async (profile) => {
            
            const sk = req.body.skill.map(skill => {
              const skills = Object.assign({}, skill);
              skills.UserId = profile.dataValues.id
              return skills;
            })
            const te = req.body.technologyYouCanTeach.map(tech => {
              const techs = Object.assign({}, tech);
              techs.UserId = profile.dataValues.id
              return techs;
            })
            const skill = await models.Skill.bulkCreate(sk, {transaction: t});
            const tech = await models.TechnologyYouCanTeach.bulkCreate(te, {transaction: t});
            profile.skill = skill
            profile.technologyYouCanTeach = tech
            return profile
        });
    })
    .then(user =>{
        //fire a out a mail
        user.password = ""
        return res.status(201).json({ success: true, message: 'Account created',
                    code: 201, data: user, error: {} });
    })
    .catch(error => {
        console.log(error)
        return res.status(520).json({ success: false, message: 'unknown error',
        code: 520, data: {}, error: error  });
    })

}

//regular authentication
AuthController.authenticate = (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(422).json({ success: false, message: 'failed validation',
        code: 422, properties:{ email: req.body.email || null,
            password: req.body.password || null}, error: result.array()  });

    }
    models.User.findOne({where: {email: req.body.email}}).then((user)=>{
        console.log(req.body.password, user.dataValues.password)
        user._modelOptions.instanceMethods.comparePasswords(req.body.password, user.dataValues.password, (error, isMatch) =>{
            if(isMatch && !error) {
                const token = jwt.sign(
                    { email: user.dataValues.email,
                      phone: user.dataValues.phone,
                      firstName: user.dataValues.firstName,
                      lastName: user.dataValues.lastName,
                      id: user.dataValues.id,
                      role: user.dataValues.role},
                    process.env.APP_KEY,
                    { expiresIn: '43200h'}
                );
                res.setHeader('Authorization', `Bearer ${token}`)
                //user.dataValues.password = null
                return res.status(200).json({ success: true, message: 'success',
                        code: 200, properties:{ email: req.body.email || null,
                        password: req.body.password || null, token: token}, data:  user });

            } else {
                return res.status(401).json({ success: false, message: 'unauthorized',
                        code: 401, properties:{ email: req.body.email || null,
                        password: req.body.password || null}, error: error  });
            }
        })

    }).catch((error)=>{
        return res.status(520).json({ success: true, message: 'unknown error',
                    code: 520, properties:{ email: req.body.email || null,
                    password: req.body.password || null}, error: error  });
    })
}

// login
AuthController.login = (req, res)=>{
    const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(422).json({ success: false, message: 'bad request! phone number required',
            code: 422, properties:{phone: req.body.phone || null}, error: result.array()  });
        }
        const phone = sanitizePhoneNumber(req.body.phone)
         models.User.findOne({
             attributes:['phone', 'email'],
             where:{phone: phone}
            }).then(() =>{
                return res.status(200).json({ success: true, status: 200, message: `token sent to: +${phone}`, properties:{phone: req.body.phone || null} });
            }).catch((error)=>{
                console.log(error)
            return res.status(error.status || 520 ).json({ success: false, message: error.message + 'something went wrong', status: error.status || 520, properties:{phone: req.body.phone || null}  });
        })
}
//create new user
AuthController.create = (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(422).json({ success: false, message: 'bad request! phone number and email required or phone number already taken',
        code: 422, properties:{phone: req.body.phone || null, email: req.body.email || null, referrer: req.body.referrer || null}, error: result.array()  });

    }
    const phone = sanitizePhoneNumber(req.body.phone)
    models.User.create({
        email: req.body.email,
        phone: phone,
        referralCode: referralCode(5),
        referrer: (req.body.referrer) ? req.body.referrer : '',
        role: ""
    }).then(() =>{
        return res.status(201).json({ success: true, status: 200, message: `account created`,
        properties:{phone: req.body.phone || null, email: req.body.email || null, referrer: req.body.referrer} })
        //return sms.verify.services(twilio.SERVICE_ID).verifications.create({ to: `+${phone}`, channel: twilio.CHANNEL_SMS })
    })/*.then(() => {
        return res.status(200).json({ success: true, status: 200, message: `account created and token sent to: +${phone}`,
        properties:{phone: req.body.phone || null, email: req.body.email || null, referrer: req.body.referrer} })
    })*/.catch((error) => {

        return res.status(code).json({ success: false, message: error.message || 'something went wrong', code: error.status || 520, properties:{phone: req.body.phone || null, email: req.body.email || null, referrer: req.body.referrer || null}  })
    })
}

//user phone number verification and authorization
AuthController.verify = (req, res)=>{
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(422).json({ success: false, message: 'bad request! verification code and phone required',
        code: 422, properties:{phone: req.body.phone || null}, error: result.array()  });

    }
    const phone = sanitizePhoneNumber(req.body.phone)
    sms.verify.services(twilio.SERVICE_ID).verificationChecks.create({
        to: `+${phone}`, code: req.body.code
    }).then(()=>{
        return models.User.findOne({where:{phone: phone}})
    }).then((user) => {
        const token = jwt.sign(
            { email: user.dataValues.email,
              phone: user.dataValues.phone,
              firstName: user.dataValues.firstName,
              lastName: user.dataValues.lastName,
              id: user.dataValues.id,
              role: user.dataValues.role},
            process.env.APP_KEY,
            { expiresIn: '43200h'}
        )
        res.setHeader('Authorization', `Bearer ${token}`)
        //return res.status(401).json({ success: false , code: 401, message: 'user not found and authorized', properties:{phone: req.body.phone, code: req.body.code, token: null} })
        return res.status(200).json({ success: true , code: 200, message: 'signin approved', properties:{phone: req.body.phone, code: req.body.code }, token: token })
    }).catch((error)=>{
        const code = error.status || 520
        return res.status(code).json({ success: false , code: code, message: error.message || 'unauthorized', properties:{phone: req.body.phone, code: req.body.code }, token: null })
    })
}

AuthController.index = (req, res) => {
    const { userId } = url.parse(req.url,true).query;
    const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(422).json({ success: false, message: 'bad request! input validation failure',
            code: 422, properties:{userId: req.payload.id || userId}, error: result.array()  });
        }
    const user = req.payload.id || userId
    models.User.findByPk(user).then((user)=>{
        return res.status(200).json({success: true, message: 'success', code: 200, properties:{userId: req.payload.id || userId}, data: user})
    }).catch((error)=>{
        return res.status(503).json({success: true, message: 'something went wrong', code: 503, properties:{userId: req.payload.id || userId}, error: error})
    })
}
// run ajax check on user input
AuthController.check = (req, res)=>{
    const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(422).json({ success: false, message: 'phone number exist',
            code: 422, properties:{ phone: req.body.phone || null, email: req.body.email || null}, error: result.array()  });

        }else{
            return res.status(200).json({ success: true, message: 'no match found', status: 200, properties:{phone: req.body.phone || null, email: req.body.email || null}  })
        }

}

//Update users account
AuthController.update = (req, res)=>{
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(422).json({ success: false, message: 'input validation failure',
            code: 422, properties:{firstname: req.body.firstName || null, lastName: req.body.lastName || null,
             email: req.body.email || null,
            phone: req.body.phone || null}, error: result.array()  });
        }

    models.User.update({
        firstName: req.body.firstName || req.payload.firstName,
        lastName: req.body.lastName || req.payload.lastName, // update here
        email: req.body.email || req.payload.email,
        phone: req.body.phone || req.payload.phone
    },{
        where: { id: req.payload.id }

      }).then((data)=>{
        return res.status(200).json({ success: true, status: 200, message: `update successful`, properties:{firstname: req.body.firstName || null, lastName: req.body.lastName || null,
             email: req.bodyemail || null,
            phone: req.body.phone || null},
                data: data});
      }).catch((error)=>{
          //save error to database
          console.log(error)
        return res.status(520).json({ success: false, status: 520, message: `unknown error`, properties:{firstname: req.body.firstName || null, lastName: req.body.lastName || null,
             email: req.bodyemail || null,
            phone: req.body.phone || null}, error: error });
      })
    } catch (error) {
        console.log(error)
    }
}

AuthController.delete = (req, res)=>{
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(422).json({ success: false, message: 'input validation failure',
        code: 422, properties:{ params:{ userId : req.params.userId || null}}, error: result.array()  });
    }
    models.User.destroy({
        where: {
          id: req.params.userId || req.payload.id
        },
        force: true
      })
    .then((data) => {
        return res.status(200).json({ success: true, message: "success",
        code: 200, properties:{params: {userId: req.params.userId || null}},
        data: {content: data}});
    }).catch((error) => {
        return res.status(520).json({ success: false, message: "unknown error",
        code: 520, properties:{params: {userId: req.params.userId }},
        data: { error: error}  });
    })

}

module.exports = AuthController;
