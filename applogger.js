const fs = require('fs');
const serverOptions = require ('./server-options.json'); // read backend server configuration file

const log = function (...theArgs){ console.log((new Date()).toISOString()+' '+theArgs) }
const debug = function (...theArgs){ 
  if (serverOptions.DEBUG == true) {
    console.log((new Date()).toISOString()+' '+theArgs);
  }
}
const error = function (...theArgs){ console.error((new Date()).toISOString()+' '+theArgs) }

module.exports.log = log;
module.exports.debug = debug;
module.exports.error = error;