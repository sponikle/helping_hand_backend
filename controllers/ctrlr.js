/* eslint-disable no-unused-vars */
const { validationResult } = require("express-validator");
const randomstring = require("randomstring");

const Store = require('../models/stores');
const Help = require('../models/help');
const Service = require('../models/service');
const State = require('../models/state');
const Information = require('../models/information');
const Suggestions = require('../models/suggestion');

const { setState, setDistrict } = require('../helpers/index');

exports.getStates = async(req, res) => {
    try {
        State.find()
            .then((states) => {
                if (states.length == 0) {
                    return res.status(200).json({ message: "No states available" })
                }
                return res.status(200).json({ message: states })
            })
            .catch((err) => {
                return res.status(500).json({ message: "err", err: err });
            })
    } catch (e) {
        return res.status(500).json({ message: "err", err: e });
    }
}

exports.getDistricts = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({
            status: 0,
            message: "Incomplete Request Data",
            errors: errors.array(),
        });
    }
    try {
        State.find({ name: req.body.state }, (err, result) => {
            if (err) {
                return res.status(500).json({ message: "err", err: err });
            }
            console.log(result[0].districts);
            if (!result[0].districts) {
                return res.status(200).json({ message: "No district available" })
            }
            return res.status(200).json({ message: result[0].districts })

        })
    } catch (e) {
        return res.status(500).json({ message: "err", err: e });
    }
}


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
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({
            status: 0,
            message: "Incomplete Request Data",
            errors: errors.array(),
        });
    }
    try {
        let { _priority, address, description, district, name, number, request_type, state, token } = req.body;

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
                    message: "Help added",
                    token: token
                })
            }
        })

    } catch (e) {
        return res.status(500).json({
            error: e
        })
    }
}

exports.fetchMyHelps = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({
            status: 0,
            message: "Incomplete Request Data",
            errors: errors.array(),
        });
    }

    try {
        const token_list = req.body.token_list;
        let splittedtoken = await token_list.split(",");
        await splittedtoken.shift();
        console.log(splittedtoken);
        let promises = [];
        let helplist = [];
        splittedtoken.forEach(token => {

            promises.push(new Promise((resolve, reject) => Help.find({
                'token': token
            }, (err, result) => {
                if (result.length != 0) {
                    resolve(result[0])
                }
                resolve({})
            })));

        });

        Promise.all(promises)
            .then(results => {
                var newarray = results.filter((item) => Object.keys(item).length !== 0);
                console.log(results);
                return res.status(200).json({ message: newarray });
            }).catch(e => {
                return res.status(500).json({ message: "Error", error: e });

            });
    } catch (e) {
        return res.status(500).json({ message: "Error", error: e })
    }
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
        return res.status(200).json({ message: "Error", Error: e })

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
        return res.status(500).json({ message: "Error", error: e })
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
            error: e
        })
    }
}

exports.addInformation = (req, res) => {
    if (!req.body.infoType) {
        return res.status(401).json({
            message: "Can not procceed further, cat missing"
        })
    }
    console.log(req.body.infoType);
    try {
        const {
            infoType,
            storeName,
            storeType,
            storeNumber,
            storeArea,
            storeDistrict,
            storeLocation,
            storeTime,
            homedelivery,
            pickup,
            serviceType,
            offerredBy,
            offeredLocation,
            offeredDistrict,
            offeredState,
            offeredLink,
            offeredArea,
            chargable,
            serviceTime,
            contactPerson,
            contactNumber
        } = req.body;

        switch (req.body.infoType) {
            case ("Store"):
                console.log('Adding store information')

                // eslint-disable-next-line no-case-declarations
                const information = new Information({
                    infoType,
                    storeName,
                    storeType,
                    storeNumber,
                    storeArea,
                    storeDistrict,
                    storeLocation,
                    storeTime,
                    homedelivery,
                    pickup
                })

                information.save((err, result) => {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error',
                            error: err
                        })
                    }

                    if (result) {
                        return res.status(200).json({
                            message: "Information Added"
                        })
                    }
                })
                break;

            case ("Service"):
                console.log("Adding service information");
                // eslint-disable-next-line no-case-declarations
                const information2 = new Information({
                    infoType,
                    serviceType,
                    offerredBy,
                    offeredLocation,
                    offeredDistrict,
                    offeredState,
                    offeredLink,
                    offeredArea,
                    chargable,
                    serviceTime,
                    contactPerson,
                    contactNumber
                });

                information2.save((err, result) => {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error',
                            error: err
                        })
                    }

                    if (result) {
                        return res.status(200).json({
                            message: "Information Added"
                        })
                    }
                })
                break;
        }
    } catch (e) {
        return res.status(500).json({
            message: 'Error',
            error: e
        })
    }
}


exports.getInformationEntries = (req, res) => {
    const requestType = req.body.type;
    if (!requestType) {
        return res.status(401).json({
            message: 'Error',
            error: 'Entity Can not be processed'
        })
    }
    try {

        Information.find({ "infoType": requestType }, (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error',
                    error: err
                })
            }

            if (result) {
                return res.status(200).json({
                    message: result
                })
            }
        })

    } catch (e) {
        return res.status(500).json({
            message: 'Error',
            error: e
        })
    }
}

exports.addSuggestion = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({
            status: 0,
            message: "Incomplete Request Data",
            errors: errors.array(),
        });
    }
    try {
        const email = req.body.email;
        const name = req.body.name;
        const suggestion = req.body.suggestion;

        const sug = new Suggestions({
            email,
            name,
            suggestion
        });
        sug.save((error, result) => {
            if (error) {
                return res.status(500).json({
                    message: "Error",
                    error: error
                });
            }

            if (result) {
                return res.status(200).json({
                    message: "Success",
                });
            }
        })

    } catch (e) {
        return res.status(500).json({ message: "Error", error: e })
    }
}