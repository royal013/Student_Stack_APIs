const express = require('express');
const app = express();
const registrationRoutes = require('./routes/routes');
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', registrationRoutes);

app.listen(port, () => {
    console.log(`PORT: ${port}`);
})
