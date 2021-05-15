const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const controller = require('../controllers/ctrlr');


router.post('/getStores', [
    body('district').notEmpty().withMessage("district can not be empty")
], controller.getStores);
router.post('/setStore', [
    body('type').notEmpty().withMessage("district can not be empty"),
    body('store_name').notEmpty().withMessage("district can not be empty"),
    body('store_location').notEmpty().withMessage("district can not be empty"),
    body('store_district').notEmpty().withMessage("district can not be empty"),
    body('store_link').notEmpty().withMessage("district can not be empty"),
    body('store_area').notEmpty().withMessage("district can not be empty"),
    body('store_state').notEmpty().withMessage("district can not be empty"),
    body('pickup').notEmpty().withMessage("district can not be empty"),
    body('operation_time').notEmpty().withMessage("district can not be empty"),
    body('homedelivery').notEmpty().withMessage("district can not be empty"),
    body('contact_number').notEmpty().withMessage("district can not be empty"),
], controller.setStore);

module.exports = router;