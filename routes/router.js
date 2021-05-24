const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const controller = require('../controllers/ctrlr');

router.post('/getStates', controller.getStates);
router.post('/getDistricts', [
    body('state').notEmpty().withMessage("state can not be empty")
], controller.getDistricts);
router.post('/getStores', [
    body('district').notEmpty().withMessage("district can not be empty")
], controller.getStores);
router.post('/setStore', [
    body('type').notEmpty().withMessage("type can not be empty"),
    body('store_name').notEmpty().withMessage("store_name can not be empty"),
    body('store_location').notEmpty().withMessage("store_location can not be empty"),
    body('store_district').notEmpty().withMessage("store_district can not be empty"),
    body('store_area').notEmpty().withMessage("store_area can not be empty"),
    body('store_state').notEmpty().withMessage("store_state can not be empty"),
    body('pickup').notEmpty().withMessage("pickup can not be empty"),
    body('operation_time').notEmpty().withMessage("operation_time can not be empty"),
    body('homedelivery').notEmpty().withMessage("homedelivery can not be empty"),
    body('contact_number').notEmpty().withMessage("contact_number can not be empty"),
], controller.setStore);

router.post('/requestHelp', [
    body('_priority').notEmpty().withMessage("_priority can not be empty"),
    body('address').notEmpty().withMessage("address can not be empty"),
    body('description').notEmpty().withMessage("description can not be empty"),
    body('district').notEmpty().withMessage("district can not be empty"),
    body('name').notEmpty().withMessage("name can not be empty"),
    body('number').notEmpty().withMessage("number can not be empty"),
    body('request_type').notEmpty().withMessage("request_type can not be empty"),
    body('state').notEmpty().withMessage("state can not be empty")
], controller.requestHelp);

router.post('/fetchMyHelps', [
    body('token_list').notEmpty().withMessage("token_list can not be empty")
], controller.fetchMyHelps);
router.post('/fetchHelp', [
    body('param').notEmpty().withMessage("param can not be empty")
], controller.fetchHelps);

router.post('/fetchHelpById', [
    body('id').notEmpty().withMessage("Id can not be empty")
], controller.fetchHelpsById);

router.post('/addCommentToHelp', [
    body('id').notEmpty().withMessage("Id can not be empty"),
    body('comment').notEmpty().withMessage("Comment can not be empty")
], controller.addCommentToHelp);

router.post('/addService', [
    body('type').notEmpty().withMessage("type cannot be empty"),
    body('offered_by').notEmpty().withMessage("offered_by cannot be empty"),
    body('offered_location').notEmpty().withMessage("offered_location cannot be empty"),
    body('offered_district').notEmpty().withMessage("offered_district cannot be empty"),
    body('offered_state').notEmpty().withMessage("offered_state cannot be empty"),
    body('offered_area').notEmpty().withMessage("offered_area cannot be empty"),
    body('chargable').notEmpty().withMessage("chargable cannot be empty"),
    body('operation_time').notEmpty().withMessage("operation_time cannot be empty"),
    body('contact_number').notEmpty().withMessage("contact_number cannot be empty"),
    body('contact_person').notEmpty().withMessage("contact_person cannot be empty")
], controller.addService);

router.post('/fetchService', [
    body('param').notEmpty().withMessage("param can not be empty")
], controller.fetchService);

router.post('/addInformation', controller.addInformation);
router.post('/getInformationEntries', controller.getInformationEntries);
router.post('/addSuggestion', [
    body('name').notEmpty().withMessage('Name can not be empty'),
    body('email').notEmpty().withMessage('email can not be empty'),
    body('suggestion').notEmpty().withMessage('suggestion can not be empty')
], controller.addSuggestion);

module.exports = router;