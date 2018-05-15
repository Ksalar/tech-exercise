const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/dist`));

// Fallback route for react router.
app.get('/*', (req, res) => res.sendFile(`${__dirname}/dist/index.html`) );

app.listen(3000, () => console.log(`Now listening on 3000`));