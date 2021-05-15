const { validationResult } = require("express-validator");
const randomstring = require("randomstring");

const Store = require('../models/stores');
const Help = require('../models/help');
const Service = require('../models/service');

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
                        console.log("Adding district while state is not present");
                        setDistrict(store_state, store_district)
                            .then(() => {
                                console.log('success')
                                return res.status(200).json({
                                    message: "Store Added Successfully"
                                })
                            })
                            .catch((e) => {
                                console.log(e);
                                return res.status(500).json({ msg: "error while adding district", err: e })
                            })
                    })
                    .catch((err) => {
                        if (err.status == 302) {
                            console.log('Adding district while state is present');
                            setDistrict(store_state, store_district)
                                .then(() => {
                                    console.log('success')
                                    return res.status(200).json({
                                        message: "Store Added Successfully"
                                    })
                                })
                                .catch((e) => {
                                    console.log(e);
                                    return res.status(500).json({ msg: "error while adding district", err: e })
                                })
                        } else {
                            return res.status(500).json({ msg: "error while adding state", err: err })
                        }
                    })

            }
        })
    } catch (e) {
        return res.status(500).json({
            message: "Store can not be added",
            err: e
        })
    }
}

exports.requestHelp = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({
            status: 0,
            message: "Incomplete Request Data",
            errors: errors.array(),
        });
    }
    return new Promise((resolve, reject) => {
        try {
            const { _priority, address, description, district, name, number, request_type, state, token } = req.body;

            if (!token) {
                token = randomstring.generate(15);
                console.log(token)
            }

            const help = new Help({
                _priority,
                address,
                description,
                district,
                name,
                number,
                request_type,
                state,
                token
            })
            help.save((err, result) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    })
                }
                if (result) {
                    return res.status(200).json({
                        message: "Help added"
                    })
                }
            })

        } catch (e) {
            return res.status(500).json({
                error: e
            })
        }
    })
}

exports.fetchHelps = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({
            status: 0,
            message: "Incomplete Request Data",
            errors: errors.array(),
        });
    }
    try {
        const param = req.body.param;
        const cat = req.body.cat;
        if (param != "All") {
            if (!cat) {
                return res.status(500).json({
                    error: "Category is needed"
                })
            }
        }
        switch (param) {
            case "All":
                Help.find({}, (error, result) => {
                    if (error) {
                        return res.status(500).json({
                            error: error
                        })
                    }
                    if (result) {
                        return res.status(200).json({
                            message: result
                        })
                    }
                });
                break;
            case "Catwise":
                Help.find({ 'type': cat }, (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    }
                    if (result) {
                        return res.status(200).json({
                            message: result
                        })
                    }
                })
                break;
            case "Prioritywise":
                Help.find({ '_priority': cat }, (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    }
                    if (result) {
                        return res.status(200).json({
                            message: result
                        })
                    }
                })
                break;
            case "Statewise":
                Help.find({ 'state': cat }, (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    }
                    if (result) {
                        return res.status(200).json({
                            message: result
                        })
                    }
                })
                break;
            case "Districtwise":
                Help.find({ 'district': cat }, (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    }
                    if (result) {
                        return res.status(200).json({
                            message: result
                        })
                    }
                })
                break;

        }
    } catch (e) {
        return res.status(500).json({
            error: e
        })
    }
}

exports.fetchHelpsById = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({
            status: 0,
            message: "Incomplete Request Data",
            errors: errors.array(),
        });
    }
    try {
        const id = req.body.id;
        Help.findById(id, (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: err
                })
            }

            if (result) {
                return res.status(200).json({
                    message: result
                })
            }
        });
    } catch (e) {

    }
}

exports.addCommentToHelp = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({
            status: 0,
            message: "Incomplete Request Data",
            errors: errors.array(),
        });
    }

    try {
        const id = req.body.id;
        const comment = req.body.comment;

        Help.findById(id, (error, result) => {
            if (error) {
                return res.status(500).json({
                    message: "Internal Server error"
                })
            }

            if (result) {
                let comments = result.comments;
                comments.push(comment)
                Help.findOneAndUpdate({ '_id': id }, { 'comments': comments }, (er, success) => {
                    if (er) {
                        return res.json(500).json({ error: error })
                    }
                    if (success) {
                        return res.status(200).json({ message: "Comment Added" })
                    }
                })
            }
        })
    } catch (e) {

    }
}

exports.addService = (req, res) => {
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
            offered_by,
            offered_location,
            offered_district,
            offered_state,
            offered_link,
            offered_area,
            chargable,
            operation_time,
            contact_number,
            contact_person
        } = req.body;

        const service = new Service({
            type,
            offered_by,
            offered_location,
            offered_district,
            offered_state,
            offered_link,
            offered_area,
            chargable,
            operation_time,
            contact_number,
            contact_person
        })

        service.save((err, result) => {
            if (err) {
                return res.status(500).json({
                    error: err
                })
            }
            if (result) {
                return res.status(200).json({
                    message: "Service added"
                })
            }
        })
    } catch (e) {
        return res.status(500).json({
            error: e
        })

    }
}

exports.fetchService = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({
            status: 0,
            message: "Incomplete Request Data",
            errors: errors.array(),
        });
    }
    try {
        const param = req.body.param;
        const cat = req.body.cat;
        if (param != "All") {
            if (!cat) {
                return res.status(500).json({
                    error: "Category is needed"
                })
            }
        }
        switch (param) {
            case "All":
                Service.find({}, (error, result) => {
                    if (error) {
                        return res.status(500).json({
                            error: error
                        })
                    }
                    if (result) {
                        return res.status(200).json({
                            message: result
                        })
                    }
                });
                break;
            case "Catwise":
                Service.find({ 'type': cat }, (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    }
                    if (result) {
                        return res.status(200).json({
                            message: result
                        })
                    }
                })
                break;
            case "Statewise":
                Service.find({ 'offered_state': cat }, (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    }
                    if (result) {
                        return res.status(200).json({
                            message: result
                        })
                    }
                })
                break;
            case "Districtwise":
                Service.find({ 'offered_district': cat }, (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    }
                    if (result) {
                        return res.status(200).json({
                            message: result
                        })
                    }
                })
                break;

        }
    } catch (e) {
        return res.status(500).json({
            error: err
        })
    }
}