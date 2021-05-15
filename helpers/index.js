const State = require('../models/state');
const _this = this;


exports.setDistrict = async(state, district) => {
    return new Promise((resolve, reject) => {
        try {
            const camcaseState = _this.camcase(state);
            const allState = State.findOne({ name: camcaseState }, (err, result) => {
                if (err) {
                    console.log(err)
                }
                if (result) {
                    console.log(result.districts)
                    const camcaseDis = _this.camcase(district);

                    let foundDis = result.districts.find(dis => dis.name === camcaseDis);
                    if (!foundDis) {
                        let listDistricts = result.districts
                        const distr = { name: camcaseDis }
                        listDistricts.push(distr)
                        State.findOneAndUpdate({ name: camcaseState }, { districts: listDistricts })
                            .then(() => {
                                resolve('District Updated')
                            })
                            .catch(() => {
                                reject("Error while updating district");
                            })
                    } else {
                        resolve('District is present')
                    }

                }
            })
        } catch (e) {
            reject(e)
        }
    });
}


exports.camcase = (name) => {
    return name[0].toUpperCase() + name.substring(1)
}

exports.setState = (state) => {
    return new Promise((resolve, reject) => {
        try {
            console.log(state)
            let camState = this.camcase(state)
            State.find({ name: camState }, (err, docs) => {
                if (err) {
                    console.log(err);
                    reject(err)
                }
                if (docs.length === 0) {
                    console.log('Adding state');
                    let addstate = new State({
                        name: camState
                    });
                    addstate.save((err, result) => {
                        if (err) {
                            console.log('1', err)
                            reject(err)
                        }
                        if (result) {
                            console.log('res', result)
                            resolve(result)
                        }
                    })
                } else {
                    let ooo = {
                        status: 302,
                        msg: 'State is present'
                    }
                    reject(ooo);
                }
            })
        } catch (e) {
            reject(e)
        }
    })
}