import AES from "crypto-js/aes";
import Base64 from "crypto-js/enc-base64";
import ECB from "crypto-js/mode-ecb";
// 同java中的PKCS5
import Pkcs7 from "crypto-js/pad-pkcs7";
/**
 * Created by houzhiwei on 2017/4/18.
 * Encrypt password use Crypto-JS 3.1.2
 * @see https://www.npmjs.com/package/crypto-js
 */
/**
 * mode 支持 CBC、CFB、CTR、ECB、OFB, 默认 CBC
 * padding 支持 Pkcs7、AnsiX923、Iso10126、NoPadding、ZeroPadding, 默认 Pkcs7, 即 Pkcs5
 * 但需要引入components包下对应的js文
 */
// Including all libraries
// import CryptoJS from 'crypto-js'
// import Core from 'crypto-js/core'
import sha256 from "crypto-js/sha256";

// console.log(ECB);
// console.log(Pkcs7);
// let CBC = Core.CBC;

/**
 * 使用AES算法加密,默认的Cbc模式
 * 先使用Sha256加密再处理
 * @param {String} keyStr base64 编码的AES加密key
 * @param {String} pwd 需要加密的密码
 * @param {String} iv 初试向量 initial vector, key 和 iv 可以一致
 * @returns {String} 加密之后的密码
 */
function AesEncrypt( keyStr, pwd, iv ) {
  var key = Base64.parse(keyStr);
  var _iv = Base64.parse(iv);
  pwd = Sha256Encrypt(pwd);
  var encrypted = AES.encrypt(pwd, key, {
    iv: _iv,
    // mode: CBC, //default
    padding: Pkcs7
  });
  // 加密之后的不是一个string对象，需要toString
  var encryptedPwd = encrypted.toString();
  return encryptedPwd;
};

/**
 * 使用AES算法加密,ECB模式
 * 先使用Sha256加密再处理
 * 要与后台shiro的AES解密方法组合，需要使用此方法
 * @param {String} keyStr base64 编码的AES加密key
 * @param {String} pwd 需要加密的密码
 * @returns {String} 加密之后的密码
 */
function AesEcbEncrypt( keyStr, pwd ) {
  var key = Base64.parse(keyStr);
  pwd = Sha256Encrypt(pwd);
  var encrypted = AES.encrypt(pwd, key, {
    mode: ECB,
    padding: Pkcs7
  });
  var encryptedPwd = encrypted.toString();
  return encryptedPwd;
};

/**
 * sha256散列
 * @param keyStr
 * @param pwd
 * @return string
 */
function Sha256Encrypt( pwd ) {
  const hashDigest = sha256(pwd);
  return Base64.stringify(hashDigest);
}

export default {
  AesEncrypt,
  AesEcbEncrypt,
  Sha256Encrypt
};
