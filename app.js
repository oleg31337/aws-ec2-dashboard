const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const express = require('express');
const session = require('express-session');
const fileStore = require('session-file-store')(session); // express session file based store

const serverOptions = require ('./server-options.json'); // read backend server configuration file
const appOptions = require ('./app-options.json'); // read frontend dashboard configuration file

var auth=require('./auth.js'); //import Passport SAML login/logout functions and routes
var awsbackend = require('./awsbackend.js'); //import AWS ec2 dashboard functions and routes


const https_options = {
  key: fs.readFileSync(serverOptions.SSL_PRIVATE_KEY),
  cert: fs.readFileSync(serverOptions.SSL_CERTIFICATE),
  minVersion: 'TLSv1.2' // only support TLS v1.2 protocol for better security
};

const app = express(); // initialize Express

const fileStoreOptions = {
  ttl: 3600*24 // 1 day
};

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(session({ // initialize Express session using file store
  store: new fileStore(fileStoreOptions),
  secret: 'somewhat very secure string',
  resave: false,
  saveUninitialized: false,
  cookie:{
    secure: true,
    unset: 'destroy',
    maxAge: 3600*24*1000 //1 day
  }
}));

app.use(auth.passport.initialize()); //initialize Passport
app.use(auth.passport.session());  //initialize Passport session
app.use(auth.passportrouter);      // use passport router from passport.js

/* app.get(serverOptions.APP_ROOT_URL, (req, res, next) => {
  res.send('\
    <h1>express test</h1>\
    <a href="/awsdashboard/secure">go to secure page</a></br>\
    <a href="/awsdashboard/login">go to login page</a></br>\
    <a href="/awsdashboard/logout">go to logout page</a></br>\
    <a href="/awsdashboard/saml/metadata.xml">generate metadata</a></br>\
  ')
}); */

app.get('/', (req, res, next) => {
  res.redirect(serverOptions.APP_ROOT_URL);
});

/* app.get(`${serverOptions.APP_ROOT_URL}/secure`, (req, res, next) => {
  if (req.isAuthenticated()){
    res.send('<h1>You are authenticated to view secure page!</h1><h4>'+JSON.stringify(req.user.nameID,null,2)+'</h4><a href="/">Go back</a>');
  }
  else {
    res.status(403);
    res.send('<h1>Not authenticated!</h1><a href="/">Go back</a>');
  }
}); */

app.use(serverOptions.APP_ROOT_URL, awsbackend.awsrouter); // add awsbackend router to the express

app.use(serverOptions.APP_ROOT_URL, express.static(path.join(__dirname, 'public'))); // supply local public content (html,css, scripts, etc.)

app.use((err, req, res, next) => { //global error handler
  console.error(err.stack)
  return res.status(500).send('Server error. Please contact Administrator.')
})

function appInit() { // main function that starts everything
  defaultaccount = Object.keys(appOptions.Accounts)[0]; // get the first available account in the list
  defaultregion = appOptions.Accounts[Object.keys(appOptions.Accounts)[0]].Regions[0].region; // get the first region in the list in the default account
  console.log('Default account:'+defaultaccount);
  console.log('Default region:'+defaultregion);
  if (fs.existsSync('./public/scripts/instancetypes.js')) { // check if instancetypes file exists
    var instancetypesMtime = fs.statSync('./public/scripts/instancetypes.js').mtime; // get the modification time of the instancetypes file.
    var nowDate = new Date();
    if (nowDate-instancetypesMtime > 86400000){ // only update instance types file if it is older than 24 hours
      awsbackend.GenerateInstanceTypesFile(defaultaccount,'us-east-1'); // get the updated list of available instance types for us-east-1 and save it as js for the frontend use
    }
  }
  else { //if instancetypes file doesn't exist, generate it.
    awsbackend.GenerateInstanceTypesFile(defaultaccount,'us-east-1'); // get the updated list of available instance types for us-east-1 and save it as js for the frontend use
  }
  if (serverOptions.UseHTTPS === true){ // read server properties and chose between http and https services
    console.log ('Starting HTTPS server');
    const serverHTTPS = https.createServer(https_options,app).listen(serverOptions.HTTPSport, (err)=> {if (!err) {console.log("Server is listening on port "+serverOptions.HTTPSport)} else {console.log("Error starting server on port "+serverOptions.HTTPSport+" "+err);};});
  }
  else {
    console.log ('Starting HTTP server');
    const serverHTTP = http.createServer(app).listen(serverOptions.HTTPport, (err)=> {if (!err) {console.log("Server is listening on port "+serverOptions.HTTPport)} else {console.log("Error starting server on port "+serverOptions.HTTPport+" "+err);};});
  }
}

appInit(); //Finally initialize the app
