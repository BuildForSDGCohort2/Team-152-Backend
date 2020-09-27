const models = require('../models');
const skill = require('../models/skill');
//const EmailService = require('./emailService')


  const UserService = () => {
    return {
      signUp : async (user) => {
        models.sequelize.transaction((t) => {
          return models.User.create({
            name: user.name,
            phone: user.phone,
            email: user.email,
            gender: user.gender,
            location: user.location,
            jobRole: user.jobRole,
            password: user.password
          }, {transaction: t}).then( async (profile) => {
              
              const sk = user.skill.map(skill => {
                const skills = Object.assign({}, skill);
                skills.UserId = profile.dataValues.id
                return skills;
              })
              const te = user.technologyYouCanTeach.map(tech => {
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
      }).then(data => Promise.resolve(data))
      
     
        //await EmailService.startSignupSequence(userRecord)
        
        
      }
    }
    
  }
  module.exports = UserService()