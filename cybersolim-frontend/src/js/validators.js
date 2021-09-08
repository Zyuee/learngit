/**
 * 自定义验证规则
 * 整个项目只需引入一次就可以了
 * @author houzhiwei
 * @see http://vee-validate.logaretm.com/validation.html
 * @see https://github.com/logaretm/vee-validate/issues/430
 * @date 2018/4/3
 */
import axios from "axios";

const passwordChecker = {
  getMessage( value, args ) {
    // console.log(args);
    return 'requires 3 ~ 12 characters/numbers, spaces are not allowed'; //'密码必须为 3 ~ 12 位字符或数字，不容许空格';
  },
  validate ( value, args )  {
    // console.log(args);
    return /^[A-Za-z0-9-=~!@#$%^*_+:?]{3,12}$/.test(value); // Returns a Boolean.
  }
};

/**
 * Using an external API and the error message is generated there (not default messages defined in the rule):
 * return an Object instead of a Boolean this object should always contain a valid property and an optional data property,
 * the data property will be passed to the message generator function as the third parameter,
 * then you should use the passed data property to modify the output message.
 * The same thing applies to promises as you resolve the promise with an object containing those properties.
 */

/**
 * @see https://github.com/logaretm/vee-validate/issues/59
 * @see http://vee-validate.logaretm.com/rules.html
 * @type {{messages: {en: ((p1:*, p2:*)), cn: ((p1:*, p2:*))}, validate: ((value, args))}}
 */
const emailChecker = {
  getMessage( field, args ){
    return 'This e-mail address has been registered!'// '此电子邮箱地址已被注册！';
  },
  validate ( value, args ){
    if (!value)
      return false;
    return axios.get('/rest/check/email', { params: { email: value } }).then(res => {
      return {
        valid: res.data // api will return 'true' if the e-mail address has not been used, otherwise 'false'
      };
    }).catch(error => {
      // console.log('Err', error);
      return {
        valid: false
      };
    });
  }
}

const projectNameChecker = {
  getMessage ( field, args ){
    return 'This name has been used! Please choose another one.'// '此名称已被使用，请选择其他名称！';
  },
  validate ( value, args ){
    if (!value)
      return false;
    return axios.get('/project/check/' + value).then(res => {
//      console.log(res);
      return {
        valid: res.data // api will return 'true' if the name has not been used, otherwise 'false'
      };
    }).catch(error => {
      return {
        valid: false
      };
    });
  }
}

//all custom rules
const rules = {
  passwordChecker, emailChecker, projectNameChecker
}

/**
 * Export an 'install' function for custom vee-validate rules.
 * It will installed globally for all components, only need to import them once per project or entry file.
 * @usage
 * import { Validator } from 'vee-validate';
 * import installRules from './myrules';
 * installRules(Validator);
 * @param Validator
 */
export default ( Validator ) =>
{
  Object.keys(rules).forEach(rule =>
  {
    Validator.extend(rule, rules[rule]);//  add the rule.
  })
}
