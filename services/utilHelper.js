'use strict';
const multer  = require('multer')
const path = require('path')
const util = {}

util.referralCode = (length, options={characterList: ''}) => {
    let code = ''
    let characterList = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    if (options.characterList) {
        characterList = options.characterList
    }
    for(var i=0; i < length; i++ ){  
        code += characterList.charAt(Math.floor(Math.random() * characterList.length))
    }
    return code;
}
util.COUNTRY_CODE = "234"
util.verifyPhoneNumber = (phone)=>{
    return /^([0]{1}|\+?[234]{3})([7-9]{1})([0|1]{1})([\d]{1})([\d]{7})$/g.test(String(phone))
}
util.sanitizePhoneNumber = (phone, { mode = "throwInvalid" } = {}) => {
    phone = String(phone)
    if (!util.verifyPhoneNumber(phone)) {
        if (mode === "throwInvalid") {
            return false
        }
        return phone
    }
    if (phone.startsWith("0") || phone.startsWith("+")) {
        phone = phone.substring(1)
    }
    if (phone.startsWith(util.COUNTRY_CODE)) {
        return phone
    }
    return `${util.COUNTRY_CODE}${phone}`
}
//req.checkBody('rest_logo', 'Restaurant Logo - Please upload an image Jpeg, Png or Gif').isImage(restLogo);
util.fileUploadHandler = (fileName) => {
    //console.log(upload.single('photo'))
    const upload = multer({ //multer settings
        storage: multer.diskStorage({ //multers disk storage settings
            destination: function (req, file, cb) {
                cb(null, './public/photo/')
            },
            filename: (req, file, cb) => {
                const randomPart = req.params.userId + '_' + util.referralCode(30,{characterList: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'})
                const extension = file.mimetype.split('/')[1];
                cb(null, randomPart + `.${extension}`)
            }
        }),
        fileFilter: (req, file, cb) => {
            let filetypes = /jpeg|jpg|png/;
            let mimetype = filetypes.test(file.mimetype);
            let extname = filetypes.test(path.extname(file.originalname).toLowerCase());
            if (mimetype && extname) {
                return cb(null, true);
            }
            cb(new Error('Invalid image type. Only images are allowed with extension .png, .jpg, .jpeg'))
        },
        
        limits:{
            fileSize: 1024*1024
        }
    }).single(fileName);
    upload(req, res, (err) => {
        // handle Multer error
        
        if (err && err.name && err.name === 'MulterError') {
            return Promise.reject(`file upload error. ${err.message}`);
            
        }
        // handle other errors
        if (err) {
            return Promise.reject('file upload error. something went wrong trying to upload the file');
            
        }
        req.body.file = req.file; 
        console.log(req.body)
        next();
        return true
    })
    /* return (req, res, next) =>{
        
        upload(req, res, (err) => {
            // handle Multer error
            
            if (err && err.name && err.name === 'MulterError') {
                return Promise.reject(`file upload error. ${err.message}`);
                
            }
            // handle other errors
            if (err) {
                return Promise.reject('file upload error. something went wrong trying to upload the file');
                
            }
            req.body.file = req.file; 
            console.log(req.body)
            next();
            return true
        })
            
    } */
}

    




module.exports = util