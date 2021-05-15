const { validationResult } = require("express-validator");

const Store = require('../models/stores');

const { setState, setDistrict } = require('../helpers/index');

exports.getStores = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({
            status: 0,
            message: "Incomplete Request Data",
            errors: errors.array(),
        });
    }
    try {
        console.log(req.body);
        const district = req.body.district;
        const param = req.body.param;

        if (param) {
            await Store.find({ 'store_district': district, 'type': param })
                .then((stores) => {
                    if (stores.length == 0) {
                        return res.status(200).json({ message: "No stores available" })
                    }
                    return res.status(200).json({ stores })
                })
                .catch((err) => {
                    return res.status(500).json({ err: err })
                })
        } else {
            console.log('wwww')
            const stores = await Store.find({ 'store_district': district })
                .then((stores) => {
                    console.log(1)
                    if (stores.length == 0) {
                        return res.status(200).json({ message: "No stores available" })
                    }
                    return res.status(200).json({ stores })
                })
                .catch((err) => {
                    return res.status(500).json({ err: err })
                })
        }

    } catch (e) {
        return res.status(500).json({ err: e })
    }
}

exports.setStore = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({
            status: 0,
            message: "Incomplete Request Data",
            errors: errors.array(),
        });
    }
    try {
        const {
            type,
            store_name,
            store_location,
            store_district,
            store_link,
            store_area,
            store_state,
            pickup,
            operation_time,
            homedelivery,
            contact_number
        } = req.body;
        const store = await new Store({
            type,
            store_name,
            store_location,
            store_area,
            store_district,
            store_link,
            pickup,
            operation_time,
            homedelivery,
            contact_number,
            store_state
        });

        store.save((err, result) => {
            if (err) {
                return res.status(500).json({
                    error: err
                })
            }

            if (result) {
                console.log('Setting the state and dis');
                setState(store_state)
                    .then(() => {
                        setDistrict(store_state, store_district)
                            .then(() => {
                                console.log('success')
                            })
                            .catch((e) => {
                                console.log(e);
                                return res.status(500).json({ msg: "error while adding district", err: e })
                            })
                    })
                    .catch((err) => {
                        if (err == "State is present") {
                            setDistrict(store_state, store_district)
                                .then(() => {
                                    console.log('success')
                                })
                                .catch((e) => {
                                    console.log(e);
                                    return res.status(500).json({ msg: "error while adding district", err: e })
                                })
                        }
                        return res.status(500).json({ msg: "error while adding state", err: e })
                    })
                    // return res.status(200).json({
                    //     message: "Store Added Successfully"
                    // })
            }
        })
    } catch (e) {
        return res.status(500).json({
            message: "Store can not be added",
            err: e
        })
    }
}