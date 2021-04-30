const express = require('express');
const fs = require('fs');
const passportrouter = express.Router();
const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;
const serverOptions = require ('./server-options.json'); // read backend server configuration file

const samlStrategy = new SamlStrategy(
  {
    //path: `${serverOptions.APP_ROOT_URL}/saml/acs`, // URL path for Assertion Consumer Service for our App
    entryPoint: serverOptions.SAML_IDP_SSO_URL, // FQDN URL for IdP Single sign-on endpoint
    logoutUrl: serverOptions.SAML_IDP_SLO_URL, //FQDN URL for IdP Single log-out endpoint
    issuer: serverOptions.SAML_SP_ENTITYID_URL, // Our app name to report to IdP
    callbackUrl: serverOptions.SAML_SP_ACS_URL, // Our Application Assertion Consumer Service FQDN URL
    logoutCallbackUrl: serverOptions.SAML_SP_SLO_URL, // Our Application Logount endpoint FQDN URL for IdP initiated log-off
    privateKey: fs.readFileSync(serverOptions.SSL_PRIVATE_KEY, 'utf-8'), // SSL Private key of our App
    signingCert: fs.readFileSync(serverOptions.SSL_CERTIFICATE,'utf-8'), // SSL Public certificate of our App
    cert: fs.readFileSync(serverOptions.SAML_IDP_SSL_CERTIFICATE,'utf-8'), //IdP signing certificate that is provided by IdP
    signatureAlgorithm: 'sha256' // SAML requests signing algorithm. supported: sha1,sha256,sha512. must be manually configured in the IdP configuration.
  },
  function (profile, done) { // routine to change values in the user profile. we just keep everything.
    return done(null, profile);
  }
);
passport.use(samlStrategy);

passport.serializeUser(function (user, done) { // dummy function to serialize user. not useful for SAML
  done(null, user);
});

passport.deserializeUser(function (user, done) { // dummy function to deserialize user. not useful for SAML
  done(null, user);
});

passport.logoutSamlCallback = function(req, res){ // Callback function for IdP initiated logout
    req.logout(); // Passport logout session
    res.redirect(serverOptions.APP_ROOT_URL);
}

passport.logoutSaml = function(req, res) {
  if (typeof(req.user)=='undefined') { //if user has no session
    req.logout(); // Passport logout session again just in case
    req.session.destroy(); //delete local session
    res.clearCookie('connect.sid');
    res.redirect(serverOptions.APP_ROOT_URL); // redirect to root after logging out locally.
  }
  else {
    samlStrategy.logout(req, function(err, request){ // perform logout locally and at IdP side
      if(!err){
        req.logout(); // Passport logout local session first
        res.redirect(request);//redirect to the IdP Logout URL to perform IdP logout
      }
      else {
        res.redirect(serverOptions.APP_ROOT_URL); // redirect to root in case of error (already logged out)
      }
    });
  }
};

passportrouter.get(`${serverOptions.APP_ROOT_URL}/login`,
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  function(req, res) {
    res.redirect(serverOptions.APP_ROOT_URL);
  }
);

passportrouter.get(`${serverOptions.APP_ROOT_URL}/saml/logout`, // log out from IDP completely
  function(req, res) {
    if (req.user){
      if (req.user.nameID){
        console.log((new Date()).toISOString(),`User ${req.user.nameID} is logging out`);
      }
    }
    passport.logoutSaml(req,res); //run passport saml logout routine
  }
);

passportrouter.get(`${serverOptions.APP_ROOT_URL}/logout`, // regular logout function
  function(req, res) {
    if (req.user){
      if (req.user.nameID){
        console.log((new Date()).toISOString(),`User ${req.user.nameID} is logging out`);
      }
    }
    req.logout(); // Passport logout session
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.redirect(serverOptions.APP_ROOT_URL); //redirect to root url after logging out
  }
);

passportrouter.get(`${serverOptions.APP_ROOT_URL}/checksession`,(req, res) => {
  if (req.isAuthenticated()){
    var username = req.user.nameID;
    if (typeof req.user.firstName !== 'undefined' && typeof req.user.lastName !== 'undefined'){
      username=req.user.firstName+' '+req.user.lastName; //Ping ID defaults
    } else if (typeof req.user['http://schemas.microsoft.com/identity/claims/displayname'] !== 'undefined'){
      username=req.user['http://schemas.microsoft.com/identity/claims/displayname']; // Azure defaults
    }
    return res.status(200).type('application/json').send('{"message":"ok","username":"'+req.user.firstName+' '+req.user.lastName+'","email":"'+req.user.email+'"}').end;
  }
  else {
    return res.status(200).type('application/json').send('{"message":"Not authenticated"}').end;
  }
});

passportrouter.post(`${serverOptions.APP_ROOT_URL}/saml/acs`,
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  function(req, res) { //SAML ACS callback function
    console.log((new Date()).toISOString(),`User ${req.user.nameID} has logged in`);
    //console.log(req.user); // for debugging
    res.redirect(serverOptions.APP_ROOT_URL);
  }
);
passportrouter.get(`${serverOptions.APP_ROOT_URL}/saml/metadata.xml`, (req, res)=>{ // Generate SAML Service Provider xml metadata.
  res.status(200).type('application/xml').send(samlStrategy.generateServiceProviderMetadata(null,fs.readFileSync(serverOptions.SSL_CERTIFICATE,'utf-8'))).end;
});

passportrouter.post(`${serverOptions.APP_ROOT_URL}/saml/logout`, passport.logoutSamlCallback); // IDP initiated logout route

module.exports = {passport, passportrouter};