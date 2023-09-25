const UserModel = require('./../models/user-model.js');
const bcrypt = require('bcrypt');
const uuid  = require('uuid');
const mailService = require('./mail-service.js');
const tokenService = require('./token-service.js');
const UserDto = require('./../dtos/user-dto.js');
const ApiError = require('./../exceptions/api-error.js')

class UserService {
  
   async registration(email, password){
      const condidate = await UserModel.findOne({email});

      if(condidate){ 
        throw ApiError.BedRequest(`email ${email} are exist`);
      }

      const hashPassword = await bcrypt.hash(password, 3);
      const activationLinlk = uuid.v4();
      const user = await UserModel.create({email, password: hashPassword, activationLinlk});
      await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLinlk}`);
      const userDto = new UserDto(user);
      const tokens = tokenService.generateTokens({...userDto});
      await tokenService.saveToken(userDto.id, tokens.refreshToken);
      return {
        ...tokens,
          userDto,
      }
      


   }


    async activate(activationLinlk){
       
      const user = await UserModel.findOne({ activationLink});
      if(!user){
        throw ApiError.BedRequest('Wrong activation Linlk');
      }

        user.isActivated = true;
        user.save();
  }
}

module.exports = new UserService();
 