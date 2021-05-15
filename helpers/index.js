const State = require('../models/state');
const _this = this;


exports.setDistrict = async(state, district) => {
    return new Promise((resolve, reject) => {
        try {
            const camcaseState = _this.camcase(state);
            const allState = State.findOne({ name: camcaseState });
            const camcaseDis = _this.camcase(district);
            const dist = allState.find(dis => district.name === camcaseDis)

            if (!dist) {
                const distr = { name: camcaseDis }
                allState.push(distr)
                State.findOneAndUpdate({ name: camcaseState }, { districts: allState })
                    .then(() => {
                        resolve('District Updated')
                    })
                    .catch(() => {
                        reject("Error while updating district");
                    })
            }
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
                if (docs.length != 0) {
                    console.log('Adding state');
                    let addstate = new State({
                        name: camState
                    });
                    addstate.save((err, result) => {
                        if (err) {
                            console.log('1', err)
                            reject(e)
                        }
                        if (result) {
                            console.log('res', result)
                            resolve(result)

                        }
                    })
                } else {
                    reject("State is present")
                }
            })
        } catch (e) {
            reject(e)
        }
    })
}