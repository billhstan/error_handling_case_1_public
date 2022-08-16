const express = require("express");
// load the agent
const cors = require('cors')
const routes = require('./src/routes/routes')
const app = express();
const bodyParser = require('body-parser');
const errorHandler = require('./src/middlewares/errorhandler');
const morgan = require('./src/middlewares/morgan');
const process = require('process');
const E = require('./src/errors');

//Server settings
const path = require('path');
app.use(cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
}));
  //Reference: https://medium.com/geekculture/build-and-deploy-a-web-application-with-react-and-node-js-express-bce2c3cfec32
  //Pick up React index.html file
  app.use(express.static(path.resolve(process.cwd(), 'client/build')));

//Request Parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();
app.use(morgan);
app.use(router);

routes(app, router)
    //Catch all requests that don't match any route
    app.get("*", (req, res) => {
      res.sendFile(
        path.resolve(process.cwd(), 'client/build/index.html')
      );
    });

app.use(errorHandler);

module.exports = app;