const express = require('express');

const {
    postRegister,
    check,
    postSummary,
    getSummary,
    getUser,
    getProfile,
    updateProfile,
    forgotpassword,
    getReport,
    whatsApp,
    updateMsgCount,
    postUser,
    bulkupload,
    generateToken,
    updateUserToken,
    changepassword,
    deleteUser
} = require('../controller/crudController');

const router = express.Router();

router.post('/register',postRegister);
router.post('/check',check);
router.post('/summaries',postSummary);
router.post('/user',getUser);
router.post('/whatsapp',whatsApp);
router.post('/postuser',postUser);
router.post('/bulkupload',bulkupload);
router.post('/updateToken/:userId',updateUserToken);

router.get('/summary/:user',getSummary);
router.get('/profile/:user',getProfile);
router.get('/report/:fromdate/:todate/:user',getReport);
router.get('/generateToken',generateToken);

router.patch('/patchprofile/:user',updateProfile);
router.patch('/forgotpassword/:user',forgotpassword);
router.patch('/updateMsgCount/:user',updateMsgCount);
router.patch('/changepassword/:user',changepassword);
router.delete('/deleteUser',deleteUser);
module.exports = router;