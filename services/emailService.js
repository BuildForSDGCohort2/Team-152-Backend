const models = require('../models');
const EmailService = require('ema')

  module.exports.EmailService = {

    async Signup(user) {
      const userRecord = await UserModel.create(user);
      const email = await models.User.create({
        name: user.name,
        phone: user.phone,
        email: user.email,
        gender: user.gender,
        location: user.location,
        jobRole: user.jobRole,
        password: user.password,
        skill: [
          user.skills
        ],
        teachnologyYouCanTeach: [
          user.teachnologyYouCanTeach
        ],
        
      }, {
        include: [{
          association: [User.Skill, User.TeachnologyYouCanTeach]
          
        }]
      });
      const companyRecord = await CompanyModel.create(userRecord); // needs userRecord to have the database id 
      const salaryRecord = await SalaryModel.create(userRecord, companyRecord); // depends on user and company to be created
      await EmailService.startSignupSequence(userRecord)
      return { user: userRecord, company: companyRecord };
    },
    async startSignupSequence(email){}
  }