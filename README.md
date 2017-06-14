
# Openshift plugin

The Openshift plugin will allow you to use the Openshift command-line interface (CLI) from a Clarive instance.

## Requirements

This plugin requires Openshift to be installed and the OC cluster to be be running in the instance in order for it to work properly.

To install Openshift you need to click [here](https://docs.openshift.com/enterprise/3.0/install_config/index.html) and follow the instructions.

## Installation

To install the plugin, move the cla-openshift-plugin folder inside the `CLARIVE_BASE/plugins`
directory in the Clarive instance.

## How to use

To use this plugin, you need to have your OpenShift cluster running so that the commands can be executed.

Once the plugin is correctly installed, you will see a new palette service called 'Openshift Task', and two new CIs - one for the Openshift server, and the other for the applications inside Openshift.

### Openshift Server CI

You will be able to save your Openshift server parameters in this CI. The main fields are:

- **Server** - Choose the *Server* CI where the Openshift cluster is running.
- **Openshift cluster URL -** Write the URL where the Openshift cluster is running the website.
- **Token login?** - Check this if you wish to use a token to log into the app, or leave it unchecked to enter a user id and password to log in.
- **Main command** - Enter the main command used for the console API. The default value is *oc*.

Configuration example:

    Server: Clarive_server
    Openshift Cluster hostname: https://10.0.2.15:8443 
    Token login?: unchecked
    Username: test
    Password: test
    Main command: oc

### Openshift Application CI

In this CI, you will be able to configure the parameters for Openshift apps to be able to check their status.
The parameters for this CI are:

- **Openshift Server** - Choose the Openshift server CI on which the application is located.
- **Project name** - Write the name of the project in which the application is located.
- **Application name** - Write the application name inside Openshift.

Configuration example:

    Openshift Server: OC_Server
    Project name: app-project
    Application name: application-example

### Openshift Task:

This palette service will allow you to choose a server on which the Openshift cluster is running to run a remote command to create or launch a project or application.
The different parameters from the palette service are:

- **Command** - In this parameter you can write the main command you wish to launch. Depending on the selected option, you will have different fields to fill out.
The different options to choose are:
    - Project: Selects a project from the Openshift server.
    - New-project: Creates a new project.
    - Delete project: Deletes a project.
    - New-app: Creates a new application in a project.
    - Delete app: Deletes an application.
    - Check status: Checks the application deployment status.
    - Custom command: Sends a custom command.

- **Server** - This field will appear if you do not have the *check status* or *delete application* option selected. This option lets you choose the server on which you wish to execute the command. 
- **Command arguments** - Here you can add different options or parameters for the command you wish to run, such as application name, url, directory etc. If you are running the custom command option, you do not need to type *oc* at the command.
- **Select application** - This field will appear when you select the *check status* or *delete application* option, and you need to check the appropriate application CI.
- **Errors and Outputs** - These two fields are for error control on the command launch.

Configuration example:

    Command: new-app
    Server: Clarive_server
    Project name: test
    Application name: test-app
    Command arguments: openshift/deployment-example 
    Errors: fail
    Output: 

This example will deploy a new application from *openshift/deployment-example* inside test project in the selected server with t thehe name *test-app*.
The service will return the output message and MID for the new application CI in Clarive.

NOTE: For the command *new-app*, the server will return a HASH structure with two arrays for the output message and for the CI's MID. The keys for each port array in the HASH will be *output* and *mid*.
For the other commands the output will always be the output message without any HASH structure.
Remember to set a "Return key" value in the "Openshift task" properties if you want to use the output data later.

If you wish to pass the MID to a variable to be used later, you need to use the *Code* palette service with the following code in Perl, where *{return_key}* is the HASH output from the *new-app* command and *app_ci* is the variable where you are going to save the *mid*:
    
    $stash->{app_ci} = $stash->{return_key}->{mid};

