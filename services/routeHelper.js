'use strict';

const config = require('../package.json')
const jwt = require('jsonwebtoken');
const models = require('../models');

module.exports = (()=>{
    const helper = {}
        helper.verifyToken = (token)=>{
            return (req, res)=>{
                jwt.verify(token, process.env.APP_KEY, (err, payload) => {
                    if (err){
                        return  res.status(401).send({code: 401, message: 'unauthorized. The token is expired'})
                    } 
                   
                    req.payload = payload
                })
            }
              
        }
      helper.protect = async (req, res, next) => {
        if(!req.headers.authorization){
            
          return res.status(401).send({code: 401, message: 'unauthorized'})
        }
        let token = req.headers.authorization.split('Bearer ')[1]
        if(!token){
          return res.status(401).send({code: 401, message: 'unauthorized'})
        }
        try {
          helper.verifyToken(token)(req,res)
          const user = await models.User.findByPk(req.payload.id)
          req.user = user
        } catch (error) {
         
          
        }
        next()
      }
      
      helper.nothingHere = (req, res, next) => {
        return res.status(200).json({code: 200, message: `welcome to ${process.env.APP_NAME}. Here's api usuage guide: ${config.homepage}`})
      }

     
      
    return helper
})()




