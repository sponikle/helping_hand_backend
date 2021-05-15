const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const { PORT } = require('./config/index');

mongoose.connect('mongodb://127.0.0.1:27017/helpinghand', { useNewUrlParser: true, useUnifiedTopology: true })
    .then((success) => {
        console.log(
            'Database connected'
        );
    })

mongoose.connection.on("error", err => {
    console.log('Mongo Connection Error', err);
});
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ extended: true }));

const routes = require('./routes/router');
app.use('/v1/', routes);
app.get('/', (req, res) => {
    res.status(200).json({
        WebRoute: "Ok",
        MobileRoute: "Ok",
        AdminConfig: "Ok",
        Authorization: "Failed"
    })
})

const port = PORT || process.env.PORT;

app.listen(port, () => {
    console.log('App has been started', port)
})