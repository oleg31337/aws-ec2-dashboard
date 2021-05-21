var activedimmer='\
    <p>&nbsp;</p>\
    <p>&nbsp;</p>\
    <div class="ui active dimmer">\
    <div class="ui text loader">Loading</div>\
    </div>'
var globalconfig={}; //global app config

var MD5 = function(d){var r = M(V(Y(X(d),8*d.length)));return r.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}

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
          document.getElementById("TableContents").innerHTML ='<div class="ui inverted placeholder segment"><div class="ui inverted icon header"><i class="exclamation triangle icon"></i>Error getting data for this region</div></div>';
          $('#TableDimmer').removeClass('active');
        });
    });
}
function clearTableData(){
  console.log('clearTableData');
  $('#TableDimmer').addClass('active');
}

function getGlobalConfiguration(nextfunction){ // get global app config from the backend
  console.log('getGlobalConfiguration');
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.timeout=5000;
  var url = "configuration";
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      window.globalconfig=JSON.parse(this.responseText);

      if (typeof(nextfunction) == 'function') {nextfunction()};
    };
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
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
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.timeout=5000;
  var url = "checksession";
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(this.responseText); //convert reply to json
      if (typeof response.message != 'undefined' && response.message=="ok" && typeof response.username != 'undefined'){
        document.getElementById('logintext').innerHTML=response.username;
        document.getElementById('loginmenu').setAttribute("onclick", "logoutDialog()");
        document.getElementById('loginmenu').removeAttribute("href");
      }
      else {
        document.getElementById('logintext').innerHTML="Login"; //set menu text back to "Login"
        document.getElementById('loginmenu').removeAttribute("onclick");
        document.getElementById('loginmenu').setAttribute("href", "login");
      }
    }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
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
    document.getElementById('modal_contents').setAttribute("class", "ui large modal");
    document.getElementById('modal_contents').setAttribute("style", "background-color:#4d4d4d; color:#f2f2f2");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.timeout=10000;
    var url = "consolescreenshot?InstanceId="+instanceId+"&region="+awsregion+"&account="+account;
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        var contents='<div class="ui image content" style="background-color:#4d4d4d; color:#f2f2f2">\
            <img class="ui centered fluid image" src="data:image/jpg;base64, '+this.responseText+'">\
            </div>\
            <div class="ui actions" style="background-color:#4d4d4d; color:#f2f2f2">\
                <div class="ui black bottom right icon button" onclick="displayConsoleScreenshot(\''+instanceId+'\',\''+account+'\',\''+awsregion+'\')"><i class="sync icon"></i>&nbsp;Refresh</div>\
                <div class="ui black deny bottom right button">Close</div>\
            </div>';
            document.getElementById('modal_contents').innerHTML=contents;
            }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    document.getElementById('modal_contents').innerHTML=activedimmer+'</br><div class="actions"><div class="ui black deny right button">Close</div></div>;';
    $('.ui.large.modal').modal('show');
}

function displayConsoleOutput(instanceId,account,awsregion){ // show instance console log dialog
    document.getElementById('modal_contents').setAttribute("class", "ui large modal");
    document.getElementById('modal_contents').setAttribute("style", "background-color:#4d4d4d; color:#f2f2f2");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.timeout=10000;
    var url = "consoleoutput?InstanceId="+instanceId+"&region="+awsregion+"&account="+account;
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var contents='<div class="header" style="background-color:#4d4d4d; color:#f2f2f2">Console output</div>\
            <div class="scrolling content" style="background-color:#4d4d4d; color:#f2f2f2"><p style="background-color:#1a1a1a; color:#e6e6e6">'+atob(this.responseText).split("\n").join("<br />")+'"</p></div>\
            <div class="actions" style="background-color:#4d4d4d; color:#f2f2f2">\
                <div class="ui black bottom right icon button" onclick="displayConsoleOutput(\''+instanceId+'\',\''+account+'\',\''+awsregion+'\')"><i class="sync icon"></i>&nbsp;Refresh</div>\
                <div class="ui black deny right button">Close</div>\
            </div>';
            document.getElementById('modal_contents').innerHTML=contents;
            }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    document.getElementById('modal_contents').innerHTML=activedimmer+'</br><div class="actions"><div class="ui black deny right button">Close</div></div>;';
    $('.ui.large.modal').modal('show');
}

function appInit() { // main app that is called from the html page to initialize the frontend app
  console.log('appInit');
  getGlobalConfiguration(generateMenu); // get the global config, then generate the menu. menu will trigger getting data and creating table.
}