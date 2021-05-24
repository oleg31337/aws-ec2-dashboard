var activedimmer='\
    <p>&nbsp;</p>\
    <p>&nbsp;</p>\
    <div class="ui active dimmer">\
    <div class="ui text loader">Loading</div>\
    </div>'
var globalconfig={}; //global app config

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function setCookie(cname, cvalue, cexpire) { //function to set a cookie
  var expires='';
  if (typeof(cexpire) != 'undefined'){
    var d = new Date();
    d.setTime(d.getTime() + cexpire);
    expires = '; expires='+ d.toUTCString();
  }
  document.cookie = cname + '=' + cvalue + expires + '; path=/';
}

function getCookie(cname) { //function to read a single cookie value
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setClipboard(value,elem) { //function to copy specified text to clipboard and change data tooltip for 1 sec to Copied
    var tempInput = document.createElement("input");
    tempInput.style = "position: absolute; left: -1000px; top: -1000px";
    tempInput.value = value;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    elem.parentElement.setAttribute("data-tooltip","Copied");
    setTimeout(function(){elem.parentElement.setAttribute("data-tooltip","Copy");},1000);
}

function filterTable() { // function to filter table
  var input = document.getElementById("TableFilter"); //input filter in the menu bar
  var filter = input.value.toUpperCase(); // we perform case insensitive filtering
  var table = document.getElementById("InstancesTable"); //get our table to filter
  var filtercolumns = table.querySelectorAll('th.filtrable'); // get filtrable columns from table header
  var filtercolidx= []; // filtrable columns indexes;
  for (i=0; i<filtercolumns.length; i++){
    filtercolidx.push(filtercolumns[i].cellIndex);
  }
  var tbody = table.getElementsByTagName("tbody")[0]; //get table body, to exclude header from filtering
  var tr = tbody.getElementsByTagName("tr"); // get all tr elements
  for (i = 0; i < tr.length; i++) {
    td=tr[i].getElementsByTagName("td"); // get all td elements
    var matchfound=0;
    for (j=0; j<filtercolidx.length; j++){ // go through all columns that are filtrable
      var txtValue = td[filtercolidx[j]].textContent || td[filtercolidx[j]].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        matchfound++;
        break; // no need to process anything else as we have a match.
      }
    }
    if (matchfound != 0){
      tr[i].style.display = "";
    } else {
      tr[i].style.display = "none";
    }
  }
}

function errorTableContents(errmsg){
  document.getElementById("TableContents").innerHTML ='<div class="ui inverted placeholder segment"><div class="ui inverted icon header"><i class="exclamation triangle icon"></i>'+errmsg+'</div></div>';
  $('#TableDimmer').removeClass('active');  
}
async function getTableData(account,region){ // get instance and volumes data from the backend
  console.log('getTableData');
  var stat=fetch("describeinstancestatus?region="+region+"&account="+account);
  var inst=fetch("describeinstances?region="+region+"&account="+account);
  var vols=fetch("describevolumes?region="+region+"&account="+account);
  Promise.allSettled([stat,inst,vols])
    .then(async ([s,i,v])=>{
      Promise.allSettled([s.value.json(),i.value.json(), v.value.json()])
        .then(([ss,ii,vv])=>{
          generateTable(ss.value,ii.value,vv.value,account,region);
        }).catch(err=>{
          console.log(err);
          errorTableContents('Error getting data for this region');
        });
    }).catch(err=>{
          console.log(err);
          errorTableContents('Error getting data for this region');
        });
}
function clearTableData(){
  console.log('clearTableData');
  $('#TableDimmer').addClass('active');
}

function getGlobalConfiguration(nextfunction){ // get global app config from the backend
  console.log('getGlobalConfiguration');
  fetch('configuration')
    .then(resp => resp.json())
    .then(config => {
      window.globalconfig=config;
      if (typeof(nextfunction) == 'function') {nextfunction()};
    })
    .catch(err=>{
      errorTableContents('Error getting global configuration.</br>Internal server error.');
      console.error(err);
    });
}

function generateMenu(account,region){ // build menu with accounts and regions
  console.log('generateMenu');
  clearTableData(); // clear table before generating menu
  if (typeof(account) == 'undefined') account="";
  if (typeof(region) == 'undefined') region="";
  var urlParams = new URLSearchParams(window.location.search);
  if (account =="" && urlParams.has('account') && urlParams.get('account') !="" && window.globalconfig.AccountsList.includes(urlParams.get('account'))){
    account=urlParams.get('account');
  }
  if (account =="" && getCookie("account") != "" && window.globalconfig.AccountsList.includes(getCookie("account"))){
    account=getCookie("account");
    if (region =="" && getCookie("region") != "" && window.globalconfig.Accounts[account].RegionsList.includes(getCookie("region"))){
      region=getCookie("region");
    }
  }
  if (account == ""){ // finally set account to default
    account=window.globalconfig.AccountsList[0];
  }
  if (region =="" && urlParams.has('region') && urlParams.get('region') !="" && window.globalconfig.Accounts[account].RegionsList.includes(urlParams.get('region'))){
    region=urlParams.get('region');
  }
  if (region == ""){ //finally set region to default
    region=window.globalconfig.Accounts[account].RegionsList[0];
  }
  var inputfiltervalue='';
  if (document.getElementById("TableFilter") != null && document.getElementById("TableFilter").value !=''){
    inputfiltervalue = document.getElementById("TableFilter").value; //get the value of input filter in the menu bar
  }
  setCookie('account',account); // save account in a cookie
  setCookie('region',region); // save region in a cookie
  //console.log("account="+account+" region="+region);
  var menuitems='<div class="ui inverted simple dropdown item"><i class="globe icon"></i><div id="account_dropdown_text">'+window.globalconfig.Accounts[account].Name+'</div>\
    <i class="dropdown icon"></i>\
    <div class="inverted menu">'
  for (i=0;i<window.globalconfig.AccountsList.length;i++){
    menuitems+='<a class="inverted item" onclick="generateMenu(\''+window.globalconfig.AccountsList[i]+'\',\'\')">'+window.globalconfig.Accounts[window.globalconfig.AccountsList[i]].Name+'</a>'
  }
  menuitems+='</div></div>';
  var regions = window.globalconfig.Accounts[account].Regions;
  for (i=0;i<regions.length;i++){
    var itemclass='item';
    if (regions[i].region===region){
      itemclass='item active';
    }
    menuitems+='<a class="'+itemclass+'" onclick="generateMenu(\''+account+'\',\''+regions[i].region+'\')" >'+regions[i].name+'<br/>('+regions[i].region+')</a>';
  }
  menuitems+='<div class="right menu"><div class="ui inverted transparent left icon input"><i class="filter icon"></i><input id="TableFilter" type="text" placeholder="Filter..." onkeyup="filterTable()" onpaste="filterTable()" value="'+inputfiltervalue+'"></div><a class="ui item" onclick="document.getElementById(\'TableFilter\').value=\'\';filterTable()"><i class="trash alternate outline icon"></i>Clear<br/>filter</a><a class="ui item" onclick="refreshTable(\''+account+'\',\''+region+'\')"><i class="sync icon"></i>Refresh</a><a href="login" class="ui item" id="loginmenu"><i class="user outline icon"></i><div id="logintext">Login</div></a></div>'
  document.getElementById('MainMenu').innerHTML=menuitems;
  checkSession();
  getTableData(account,region);
}

function refreshTable(account,region){ //refresh table data
  console.log("refreshTable");
  clearTableData();
  checkSession();
  getTableData(account,region);
}

function logoutDialog(){ // log-out confirmation dialog
  document.getElementById('modal_contents').setAttribute("class", "ui mini modal");
  document.getElementById('modal_contents').setAttribute("style", "");
  document.getElementById('modal_contents').innerHTML='\
  <div class="ui header">Do you want to logout?</div>\
  <div class="content">\
  </div>\
  <div class="ui actions">\
    <a href="logout" class="ui submit button">Logout</a>\
    <div class="ui black deny button">Cancel</div>\
  </div>';
  $('.ui.mini.modal').modal('show');
}

function checkSession() { // check if user is authenticated and there is a valid session on the backend.
  console.log("checkSession");
  fetch("checksession")
    .then(resp=>resp.json())
    .then(session=>{
      if (typeof session.message != 'undefined' && session.message=="ok" && typeof session.username != 'undefined'){
        document.getElementById('logintext').innerHTML=session.username;
        document.getElementById('loginmenu').setAttribute("onclick", "logoutDialog()");
        document.getElementById('loginmenu').removeAttribute("href");
      }
      else {
        document.getElementById('logintext').innerHTML="Login"; //set menu text back to "Login"
        document.getElementById('loginmenu').removeAttribute("onclick");
        document.getElementById('loginmenu').setAttribute("href", "login");
      }
    })
    .catch(err=>{
      console.error(err);
    });
}

function generateTable(statuses,instances,volumes,account,awsregion) { // create instances table contents
  console.log("generateTable");
  //console.log("account: ",account);
  //console.log("region: ",awsregion);
  var tags=window.globalconfig.Accounts[account].Tags || []; // get all additional tags to put in the table
  //console.log("tags: ",tags);
  var out = '<table id="InstancesTable" class="ui sortable inverted very compact selectable celled table">\
  <thead><tr>\
  <th class="filtrable">State</th>';
  for (i=0; i<tags.length; i++){
    if (i==0){
      out+='<th class="default-sort filtrable">'+tags[i]+'</th>'; // first tag will be used for default sorting
    } else {
      out+='<th class="filtrable">'+tags[i]+'</th>';
    }
  }
  out += '<th class="filtrable">Instance Type</th>\
  <th class="no-sort">IP Addresses</th>\
  <th class="no-sort">Volumes</th>\
  <th class="filtrable">Instance Id</th>\
  </tr>\
  </thead><tbody>';

  for(i = 0; i < instances.length; i++) {
    var status_color="grey"; //default status label color
    var avail_color="grey"; //default availability label color
    var instance_action=""; // default action for instance
    var available='Offline'; // default status of instance
    if (typeof statuses[instances[i].InstanceId] !='undefined'){
      available=statuses[instances[i].InstanceId];
    }
    if (instances[i].State=="running"){
      status_color="green";
      instance_action="stop";
    }
    if (instances[i].State=="stopped"){
      status_color="brown";
      instance_action="start";
    }
    if (instances[i].State=="pending"){
      status_color="olive";
    }
    if (instances[i].State=="shutting-down"){
      status_color="orange";
    }
    if (available=="Available"){
      avail_color="green";
    }
    if (available=="Unavailable"){
      avail_color="red";
    }
    //generate list of attached volumes
    var volsinfo='';
    var numvolumes=instances[i].BlockDeviceMappings.length;
    for (j=0; j<numvolumes; j++){
      if (j>0){ volsinfo+='</br>'; }
      var volumeid=instances[i].BlockDeviceMappings[j].Ebs.VolumeId
      //console.log(volumeid);
      var iops=volumes[volumeid].Iops || 'slow';
      volsinfo+=volumes[volumeid].Device+',&nbsp;'+volumes[volumeid].VolumeType+',&nbsp;'+volumes[volumeid].Size+'GB,&nbsp;'+iops+'&nbsp;IOPS,&nbsp;<a href=\"https://console.aws.amazon.com/ec2/v2/home?region='+awsregion+'#Volumes:search='+volumeid+';sort=tag:Name\" target=\"_blank\">'+volumeid+'</a>&nbsp;<span class="ui" data-tooltip="Copy" data-variation="mini" data-inverted=""><i class="ui copy outline icon link" onclick="setClipboard(\''+volumeid+'\',this)"></i></span>';
    }
    //process instance action
    if (instance_action !== ""){ //if there is an action then make the status clickable and assign manage function
        instance_status='<a class="ui '+status_color+' medium  label" data-tooltip="Click to '+instance_action+'" data-inverted="" data-position="right center" onclick="manageDialog(\''+account+'\',\''+awsregion+'\',\''+instances[i].InstanceId+'\',\''+instances[i].Name+'\',\''+instance_action+'\')">'+capitalizeFirstLetter(instances[i].State)+'</a>';
    }
    else {
        instance_status='<div class="ui '+status_color+' medium  label">'+capitalizeFirstLetter(instances[i].State)+'</div>';
    }
    //now generate main table of instances
    out += '<tr class="filtrabletr">';
    //instance status and actions
    out+='<td>'+instance_status+'&nbsp;\
    <div class="ui '+avail_color+' medium label">'+capitalizeFirstLetter(available)+'</div>';
    if (instances[i].State == "running"){
      out+='<p></p><div class="ui icon button" data-tooltip="Console screenshot" data-inverted="" data-position="top left" onclick="displayConsoleScreenshot(\''+instances[i].InstanceId+'\',\''+account+'\',\''+awsregion+'\')"><i class="camera icon"></i></div> \
      <div class="ui icon button" data-tooltip="Console logs" data-inverted="" data-position="top left" onclick="displayConsoleOutput(\''+instances[i].InstanceId+'\',\''+account+'\',\''+awsregion+'\')"><i class="file alternate outline icon"></i></div>';
    }
    out+= '</td>';
    //tags to display
    for (t=0; t<tags.length; t++){ // go through all tags to display in a table
      out+= '<td data-sort-value="'+instances[i][tags[t]].toLowerCase()+'">'+instances[i][tags[t]]+'</td>';
    }
    //instance types
    out+='<td><div class="ui grey medium label">'+instances[i].InstanceType+'</div><br/><div style="font-size: x-small;">CPU: '+instancetypes[instances[i].InstanceType].CPU+', Clock: '+instancetypes[instances[i].InstanceType].Clock+' GHz,<br/>Mem: '+instancetypes[instances[i].InstanceType].Memory+'GB</div></td>';
    //ip addresses
    out+='<td>Private: '+instances[i].PrivateIpAddress+'&nbsp;<span class="ui" data-tooltip="Copy" data-variation="mini" data-inverted=""><i class="ui copy outline icon link" onclick="setClipboard(\''+instances[i].PrivateIpAddress+'\',this)"></i></span><br/>Public:  '+instances[i].PublicIpAddress+'&nbsp;<span class="ui" data-tooltip="Copy" data-variation="mini" data-inverted=""><i class="ui copy outline icon link" onclick="setClipboard(\''+instances[i].PublicIpAddress+'\',this)"></i></span></td>';
    //volumes information
    out+='<td>'+volsinfo+'</td>';
    //instance id
    out+='<td><a href="https://console.aws.amazon.com/ec2/v2/home?region='+awsregion+'#Instances:search='+instances[i].InstanceId+';sort=tag:Name" target="_blank">'+instances[i].InstanceId+'</a>&nbsp;<span class="ui" data-tooltip="Copy" data-variation="mini" data-inverted=""><i class="ui copy outline icon link" onclick="setClipboard(\''+instances[i].InstanceId+'\',this)"></i></span></td>\
    </tr>';
  }
  out += "</tbody></table>"
  if (instances.length>0){
    document.getElementById("TableContents").innerHTML = out;
    $('table').tablesort().data('tablesort').sort($("th.default-sort"));
    filterTable();
  }else {
    document.getElementById("TableContents").innerHTML ='<div class="ui inverted placeholder segment"><div class="ui inverted icon header"><i class="search icon"></i>There are no instances in this region</div></div>';
  }
  $('#TableDimmer').removeClass('active');
}
function manageDialog(account,region,instanceId,instanceName,command){ // confirmation dialog for start/stop of instances
    document.getElementById('modal_contents').setAttribute("class", "ui mini modal");
    document.getElementById('modal_contents').setAttribute("style", "");
    document.getElementById('modal_contents').innerHTML='\
        <div class="ui header">Are you sure you want to '+command+' this instance?</div>\
        <div class="content">\
        <p>Instance name: '+instanceName+'</p>\
        <p>Instance ID: '+instanceId+'</p>\
        </div>\
        <div class="ui actions">\
          <div class="ui green ok button" onclick="doManage(\''+account+'\',\''+region+'\',\''+instanceId+'\',\''+command+'\')">Yes</div>\
          <div class="ui red deny button">Cancel</div>\
        </div>';
    $('.ui.mini.modal').modal('show');
}
function responseDialog(message,error){ // response and error dialog to confirm actions by manageDialog
  document.getElementById('modal_contents').setAttribute("class", "ui mini modal");
  document.getElementById('modal_contents').setAttribute("style", "");
  if (typeof error !== 'undefined') {
    document.getElementById('modal_contents').innerHTML='\
    <h2 class="ui header"><i class="exclamation triangle icon"></i>'+error[0]+'</h2><div class="content">'+error[1]+'</div>\
    <div class="ui actions">\
      <div class="ui green ok button">OK</div>\
    </div>';
  } else if (typeof message !== 'undefined') {
    document.getElementById('modal_contents').innerHTML='\
    <h2 class="ui header"><i class="thumbs up icon"></i>'+message[0]+'</h2><div class="content">'+message[1]+'</div>\
    <div class="ui actions">\
      <div class="ui green ok button">OK</div>\
    </div>';
  }
  $('.ui.mini.modal').modal('show');
}

function doManage(account,region,instanceId,command){ // send a manage command to backend app
  console.log("doManage");
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.timeout=5000;
  var url = "manage?region="+region+"&account="+account+"&InstanceId="+instanceId.trim()+"&command="+command.trim();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4){
      var response = JSON.parse(this.responseText || '{}'); //convert reply to json
      var err=response.error || 'Unknown error';
      if (this.status == 200) {
        if (typeof response.message != 'undefined' && response.message=="ok"){
          responseDialog(['Success',capitalizeFirstLetter(command)+' command sent successfully'],undefined);
          refreshTable(account,region);
        }
        else {
          responseDialog(undefined, ["Error "+this.status,response.error]);
        }
      } else {
        responseDialog(undefined, ["Error "+this.status,response.error]);
      }
    }
  };
  xmlhttp.open("POST", url, true);
  xmlhttp.send();
  $('.ui.mini.modal').modal('hide'); //hide modal
  document.getElementById('modal_contents').innerHTML=''; //destroy modal contents
}

function displayConsoleScreenshot(instanceId,account,awsregion){ // show instance console screenshot dialog
  console.log("displayConsoleScreenshot");
  document.getElementById('modal_contents').setAttribute("class", "ui large modal");
  document.getElementById('modal_contents').setAttribute("style", "background-color:#4d4d4d; color:#f2f2f2");
  fetch("consolescreenshot?InstanceId="+instanceId+"&region="+awsregion+"&account="+account)
    .then(resp=>resp.text())
    .then(screenshot64=>{
      var contents='<div class="ui image content" style="background-color:#4d4d4d; color:#f2f2f2">\
        <img class="ui centered fluid image" src="data:image/jpg;base64, '+screenshot64+'">\
        </div>\
        <div class="ui actions" style="background-color:#4d4d4d; color:#f2f2f2">\
            <div class="ui black bottom right icon button" onclick="displayConsoleScreenshot(\''+instanceId+'\',\''+account+'\',\''+awsregion+'\')"><i class="sync icon"></i>&nbsp;Refresh</div>\
            <div class="ui black deny bottom right button">Close</div>\
        </div>';
      document.getElementById('modal_contents').innerHTML=contents;
    });
  document.getElementById('modal_contents').innerHTML=activedimmer+'</br><div class="actions"><div class="ui black deny right button">Close</div></div>;';
  $('.ui.large.modal').modal('show');
}

function displayConsoleOutput(instanceId,account,awsregion){ // show instance console log dialog
  document.getElementById('modal_contents').setAttribute("class", "ui large modal");
  document.getElementById('modal_contents').setAttribute("style", "background-color:#4d4d4d; color:#f2f2f2");
  fetch("consoleoutput?InstanceId="+instanceId+"&region="+awsregion+"&account="+account)
    .then(resp=>resp.text())
    .then(responseText=>{
      var contents='<div class="header" style="background-color:#4d4d4d; color:#f2f2f2">Console output</div>\
        <div class="scrolling content" style="background-color:#4d4d4d; color:#f2f2f2"><p style="background-color:#1a1a1a; color:#e6e6e6">'+atob(responseText).split("\n").join("<br />")+'"</p></div>\
        <div class="actions" style="background-color:#4d4d4d; color:#f2f2f2">\
            <div class="ui black bottom right icon button" onclick="displayConsoleOutput(\''+instanceId+'\',\''+account+'\',\''+awsregion+'\')"><i class="sync icon"></i>&nbsp;Refresh</div>\
            <div class="ui black deny right button">Close</div>\
        </div>';
      document.getElementById('modal_contents').innerHTML=contents;
    });
  document.getElementById('modal_contents').innerHTML=activedimmer+'</br><div class="actions"><div class="ui black deny right button">Close</div></div>;';
  $('.ui.large.modal').modal('show');
}

function appInit() { // main app that is called from the html page to initialize the frontend app
  console.log('appInit');
  getGlobalConfiguration(generateMenu); // get the global config, then generate the menu. menu will trigger getting data and creating table.
}