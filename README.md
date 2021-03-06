# aws-ec2-dashboard
## Simplified AWS EC2 dashboard
Full stack Node.js/JavaScript application that displays list of EC2 instances in a compact and simple way.

## Features:
 * Multiple AWS accounts with easy switch.
 * Easy region switch with selectable regions to display.
 * Easy filter by resource names.
 * Customized tags to display.
 * Get the instance console screenshot with one click.
 * Get the instance console logs with one click.
 * Start/stop instances by authorized users.
 * SSL support.
 * SAML authentication.(Currently the only one supported)

## Installation:
1. Install node.js
2. Git clone the app from here https://github.com/oleg31337/aws-ec2-dashboard.git
3. Run "npm install" to install required node modules

## Configuration:
1. Make sure you have on hand AWS keys and secrets for the management users you created in AWS IAM for all accounts you need to configure in the app.
2. Create SSL certificate for your server that will run this app.
3. Create JSON configuration files from templates provided. Two config files are required: server-options.json and app-options.json. Don't yet fill the SAML config, we'll do it later.
4. Run application "node app.js"
5. Open your browser and navigate to the app url to get saml metadata e.g. https://your-server.acme.com:8443/awsdashboard/saml/metadata.xml Save the xml file and use for the next step.
6. Create SAML app at your Identity Provider and use saved metadata file.
7. Fill in SAML information in the server-options.json file.
8. Restart the node application.
9. Navigate your browser to the app url.
