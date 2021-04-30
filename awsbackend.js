const express = require('express');
const awsrouter = express.Router();
const AWS = require('aws-sdk');
const fs = require('fs');
var serverOptions = require ('./server-options.json'); // read backend server configuration file
var appOptions = require ('./app-options.json'); // read frontend dashboard configuration file

function get_tags(tags,name) { // auxilary function to extract tags by key name from stupid AWS array of tags
  for (var j=0;j<tags.length;j++){
      if (tags[j].Key==name){
          return tags[j].Value;
      }
  }
  return "";
}

function AWSPaginator (awsclient,awscommand,params={},retdata,callback,array=[],token=undefined){ // function that will paginate aws data retrieval if there are lots of results
  if (typeof token !== 'undefined' && token !== null && token !== ''){
    params.NextToken=token; // if token was passed to this function that means this is not the first iteration so we set next token parameters
  }
  awsclient[awscommand](params, function (err,data) { // call actual ec2 client command
    if (err) {
      console.log((new Date()).toISOString(),err, err.stack); // print error in the console
      callback(err,undefined); // call our callback function returning error
      return;
    }
      array = array.concat(data[retdata]); //add the existing array with returned data
      if (typeof data.NextToken !== 'undefined' && data.NextToken !== null && data.NextToken !== ''){
        AWSPaginator (awsclient,awscommand,params,retdata,callback,array,data.NextToken); // if nexttoken exists in returned data call itself and pass received array and token
        return; //return immediately as we don't want to callback until all tokens are exhausted
      }
      callback(false,array); // call our callback function returning fully populated data
      return;
  });
}

function GenerateInstanceTypesFile(account,region) { // get the updated list of available instance types and save it as js for the frontend use
  console.log((new Date()).toISOString(),'Getting available instance types from the '+account+' account...');
  var ec2client=new AWS.EC2( { 'region': region, 'accessKeyId': appOptions.Accounts[account].AWSKey, 'secretAccessKey': appOptions.Accounts[account].AWSSecret } );
  AWSPaginator (ec2client, 'describeInstanceTypes', undefined, 'InstanceTypes', function (err,itypes) {
    if (err) {
      console.log ((new Date()).toISOString(),'Error getting instance types from AWS ',err,err.stack);
      return;
    }
    var instancetypes={}; // object for all possible instance types
    for (var i=0; i<itypes.length;i++) {
      var mem=itypes[i].MemoryInfo.SizeInMiB/1024; //divide by 1024 as it is returned in MiB
      if (mem % 1 === 0) mem=mem.toFixed(0); else mem=mem.toFixed(1); //remove trailing .0 if it is integer
      instancetypes[itypes[i].InstanceType]={};
      instancetypes[itypes[i].InstanceType]={
        CPU: itypes[i].VCpuInfo.DefaultVCpus,
        Core: itypes[i].VCpuInfo.DefaultCores,
        Clock: itypes[i].ProcessorInfo.SustainedClockSpeedInGhz,
        Memory: mem,
        NetworkPerformance: itypes[i].NetworkInfo.NetworkPerformance
      };
    }
    fs.writeFile('./public/scripts/instancetypes.js', 'var instancetypes=JSON.parse(\''+JSON.stringify(instancetypes,null,0)+'\');', function (err, file) {
      if (err) console.log ((new Date()).toISOString(),'Error writing instance types file '+'./public/scripts/instancetypes.js ',err);
      console.log((new Date()).toISOString(),'Instance types file was updated.');
    });
  }); 
}

awsrouter.get('/instancesjson', (req,res)=> {
  var instancestatuses={}; // object of aggregated instance statuses
  var instances = []; // aggregated list of describe instances data
  if (typeof(req.query.account) == 'undefined' || req.query.account ==''){
    return res.status(500).type('application/json').send('{"error":"Account is undefined"}').end;
  }
  if (typeof(req.query.region) == 'undefined' || req.query.region ==''){
    return res.status(500).type('application/json').send('{"error":"Region is undefined"}').end;
  }
  var ec2client=new AWS.EC2( { 'region': req.query.region, 'accessKeyId': appOptions.Accounts[req.query.account].AWSKey, 'secretAccessKey': appOptions.Accounts[req.query.account].AWSSecret } );
  AWSPaginator(ec2client, 'describeInstanceStatus', undefined, 'InstanceStatuses', function (err,data1) { // call paginator to get Instance Statuses
    if (err) {
      console.log((new Date()).toISOString(),err, err.stack);
      return res.status(500).type('application/json').send('{"error":"Error getting describeInstanceStatus from AWS"}').end; //close http request on error
    }
    console.log((new Date()).toISOString(),'Got instance statuses for: '+data1.length+' instances');
    var instancestatus='Offline'; // default status of instance
    for (var i=0;i<data1.length;i++){ // iterate through the array of instance statuses
      if (data1[i].InstanceStatus.Status==='ok' && data1[i].SystemStatus.Status==='ok'){ //only mark it available if both instance and system statuses are ok
        instancestatus='Available';
      }
      else {
          instancestatus='Unavailable';
      }
      instancestatuses[data1[i].InstanceId]=instancestatus; // populate instancestatuses object
    }
    AWSPaginator(ec2client, 'describeInstances', undefined, 'Reservations', function (err,data2) { // call paginator to Describe Instances
      if (err) {
        console.log((new Date()).toISOString(),err, err.stack);
        return res.status(500).type('application/json').send('{"error":"Error getting describeInstances from AWS"}').end; // close http request on error
      }
      console.log((new Date()).toISOString(),'Got instance information for: '+data2.length+' instances');
      for (var i=0;i<data2.length;i++){ // iterate through array of all instances
        var available='Offline'; // default status of instance
        if (typeof data2[i].Instances[0].InstanceId !== 'undefined' && typeof instancestatuses[data2[i].Instances[0].InstanceId] !== 'undefined'){
          available=instancestatuses[data2[i].Instances[0].InstanceId];
        }
        var instanceobj={
            InstanceId: data2[i].Instances[0].InstanceId,
            InstanceType: data2[i].Instances[0].InstanceType,
            PrivateIpAddress: data2[i].Instances[0].PrivateIpAddress,
            PublicIpAddress: data2[i].Instances[0].PublicIpAddress,
            SubnetId: data2[i].Instances[0].SubnetId,
            VpcId: data2[i].Instances[0].VpcId,
            AvailabilityZone: data2[i].Instances[0].Placement.AvailabilityZone,
            BlockDeviceMappings: data2[i].Instances[0].BlockDeviceMappings,
            State: data2[i].Instances[0].State.Name,
            Available: available
        }
        if (typeof appOptions.Accounts[req.query.account].Tags !== 'undefined'){
          for (var j=0; j<appOptions.Accounts[req.query.account].Tags.length; j++){
            instanceobj[appOptions.Accounts[req.query.account].Tags[j]]=get_tags(data2[i].Instances[0].Tags,appOptions.Accounts[req.query.account].Tags[j])
          }
        }
        instances.push(instanceobj) // populate instances array with complete instance status and information
      }
      return res.status(200).type('application/json').send(JSON.stringify(instances,null,0)).end; // return instances object as json data
    });
  });
});

awsrouter.get('/volumesjson', (req,res)=> {
  if (typeof(req.query.account) == 'undefined' || req.query.account ==''){
    return res.status(500).type('application/json').send('{"error":"Account is undefined"}').end;
  }
  if (typeof(req.query.region) == 'undefined' || req.query.region ==''){
    return res.status(500).type('application/json').send('{"error":"Region is undefined"}').end;
  }
  var volumes={} // object of described volumes
  var ec2client=new AWS.EC2( { 'region': req.query.region, 'accessKeyId': appOptions.Accounts[req.query.account].AWSKey, 'secretAccessKey': appOptions.Accounts[req.query.account].AWSSecret } );
  AWSPaginator(ec2client, 'describeVolumes', undefined, 'Volumes', function (err,data3) {
    if (err) {
      console.log((new Date()).toISOString(),err, err.stack);
      return res.status(500).type('application/json').send('{"error":"Error getting describeVolumes from AWS"}').end;
    }
    else {
      for (var i=0;i<data3.length;i++){
        volumes[data3[i].VolumeId]={};
        volumes[data3[i].VolumeId]={
          InstanceId: 'none',
          Device: 'none',
          Iops: data3[i].Iops,
          Size: data3[i].Size,
          State: data3[i].State,
          VolumeType: data3[i].VolumeType,
          SnapshotId: data3[i].SnapshotId,
          Name: get_tags(data3[i].Tags,"Name"),
          Customer: get_tags(data3[i].Tags,"Customer")
        }
        if (data3[i].Attachments.length > 0){
          volumes[data3[i].VolumeId].InstanceId=data3[i].Attachments[0].InstanceId;
          volumes[data3[i].VolumeId].Device=data3[i].Attachments[0].Device;
        }
      }
      return res.status(200).type('application/json').send(JSON.stringify(volumes,null,0)).end;
    }
  });
});

awsrouter.get('/configuration', (req,res)=> {
  var accounts=Object.keys(appOptions.Accounts);
  var configuration = {"AccountsList": accounts,"Accounts":{}}; //frontend configuration object
  for (i=0;i<accounts.length;i++){
    configuration.Accounts[accounts[i]]={};
    var regionslist=[];
    for (j=0;j<appOptions.Accounts[accounts[i]].Regions.length;j++){
      regionslist.push(appOptions.Accounts[accounts[i]].Regions[j].region);
    }
    configuration.Accounts[accounts[i]]= {
      "Name": appOptions.Accounts[accounts[i]].Name,
      "RegionsList": regionslist,
      "Regions": appOptions.Accounts[accounts[i]].Regions,
      "Tags": appOptions.Accounts[accounts[i]].Tags
    }
  }
  return res.status(200).type('application/json').send(JSON.stringify(configuration,null,0)).end;
});

awsrouter.get('/consolescreenshot', (req,res)=> {
  if (typeof(req.query.account) == 'undefined' || req.query.account ==''){
    return res.status(500).type('application/json').send('{"error":"Account is undefined"}').end;
  }
  if (typeof(req.query.region) == 'undefined' || req.query.region ==''){
    return res.status(500).type('application/json').send('{"error":"Region is undefined"}').end;
  }
  if (typeof(req.query.InstanceId) == 'undefined' || req.query.InstanceId ==''){
    return res.status(500).type('application/json').send('{"error":"InstanceId is undefined"}').end;
  }
  var ec2client=new AWS.EC2( { 'region': req.query.region, 'accessKeyId': appOptions.Accounts[req.query.account].AWSKey, 'secretAccessKey': appOptions.Accounts[req.query.account].AWSSecret } );
  ec2client.getConsoleScreenshot({InstanceId: req.query.InstanceId}, function (err,data) {
    if (err) {
      console.log((new Date()).toISOString(),err, err.stack);
      return res.status(500).type('application/json').send('{"error":"Error getting getConsoleScreenshot for '+req.query.InstanceId+' from AWS"}').end;
    }
    else {
      return res.status(200).type('application/json').send(data.ImageData).end;
    }
  });
});

awsrouter.get('/consoleoutput', (req,res)=> {
  if (typeof(req.query.account) == 'undefined' || req.query.account ==''){
    return res.status(500).type('application/json').send('{"error":"Account is undefined"}').end;
  }
  if (typeof(req.query.region) == 'undefined' || req.query.region ==''){
    return res.status(500).type('application/json').send('{"error":"Region is undefined"}').end;
  }
  if (typeof(req.query.InstanceId) == 'undefined' || req.query.InstanceId ==''){
    return res.status(500).type('application/json').send('{"error":"InstanceId is undefined"}').end;
  }
  var ec2client=new AWS.EC2( { 'region': req.query.region, 'accessKeyId': appOptions.Accounts[req.query.account].AWSKey, 'secretAccessKey': appOptions.Accounts[req.query.account].AWSSecret } );
  ec2client.getConsoleOutput({InstanceId: req.query.InstanceId}, function (err,data) {
    if (err) {
      console.log((new Date()).toISOString(),err, err.stack);
      return res.status(500).type('application/json').send('{"error":"Error getting getConsoleScreenshot for '+req.query.InstanceId+' from AWS"}').end;
    }
    else {
      return res.status(200).type('application/json').send(data.Output).end;
    }
  });
});

awsrouter.post('/manage', (req,res)=> { // endpoint to perform start/stop commands on an instance
  if (typeof(req.query.account) == 'undefined' || req.query.account ==''){
    return res.status(500).type('application/json').send('{"error":"Account is undefined"}').end;
  }
  if (typeof(req.query.region) == 'undefined' || req.query.region ==''){
    return res.status(500).type('application/json').send('{"error":"Region is undefined"}').end;
  }
  if (typeof(req.query.InstanceId) == 'undefined' || req.query.InstanceId ==''){
    return res.status(500).type('application/json').send('{"error":"InstanceId is undefined"}').end;
  }
  if (typeof(req.query.command) == 'undefined' || req.query.command ==''){
    return res.status(500).type('application/json').send('{"error":"Command is undefined"}').end;
  }
  console.log((new Date()).toISOString(),"manage:",req.query.account,req.query.region,req.query.InstanceId,req.query.command);
  if (req.isAuthenticated()){
    if (!appOptions.Accounts[req.query.account].AuthorizedUsers.includes(req.user.email)) {
      console.log((new Date()).toISOString(),'User',req.user.nameID,'is NOT authorized to',req.query.command,req.query.InstanceId);
      return res.status(403).type('application/json').send('{"error":"You are not authorized to perform this operation. Ask your administrator for permissions."}');
    }
  }
  else {
    return res.status(403).type('application/json').send('{"error":"You are not authenticated to perform this operation."}').end;
    console.log((new Date()).toISOString(),'User is NOT authenticated to',req.query.command,req.query.InstanceId);
  }
  console.log((new Date()).toISOString(),'User',req.user.nameID,'is authorized to',req.query.command,req.query.InstanceId);
  var ec2client=new AWS.EC2( { 'region': req.query.region, 'accessKeyId': appOptions.Accounts[req.query.account].AWSKey, 'secretAccessKey': appOptions.Accounts[req.query.account].AWSSecret } );
  if (req.query.command == 'start'){
    ec2client.startInstances({InstanceIds: [req.query.InstanceId]}, function (err,data) {
      if (err) {
        console.log((new Date()).toISOString(),err, err.stack);
        return res.status(403).type('application/json').send('{"error":"Error starting instance '+req.query.InstanceId+'"}').end;
      }
      else {
        return res.status(200).type('application/json').send('{"message":"ok"}').end;
      }
    });
  } else if (req.query.command == 'stop'){
    ec2client.stopInstances({InstanceIds: [req.query.InstanceId]}, function (err,data) {
      if (err) {
        console.log((new Date()).toISOString(),err, err.stack);
        return res.status(403).type('application/json').send('{"error":"Error stopping instance '+req.query.InstanceId+'"}').end;
      }
      else {
        return res.status(200).type('application/json').send('{"message":"ok"}').end;
      }
    });
  } else {
    return res.status(500).type('application/json').send('{"error":"Unknown command"}').end;
  }
});

module.exports = {GenerateInstanceTypesFile, awsrouter}