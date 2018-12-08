# Openshift plugin

<img src="https://cdn.jsdelivr.net/gh/clarive/cla-openshift-plugin@master/public/icon/openshift.svg?sanitize=true" alt="Openshift Plugin" title="Openshift Plugin" width="120" height="120">

The Openshift plugin will allow you to use the Openshift command-line interface (CLI) from a Clarive instance.

## Requirements

This plugin requires Openshift to be installed and the OC cluster to be be running in the instance in order for it to work properly.

To install Openshift you need to click [here](https://docs.openshift.com/enterprise/3.0/install_config/index.html) and follow the instructions.

## Installation

To install the plugin, move the cla-openshift-plugin folder inside the `$CLARIVE_BASE/plugins`
directory in the Clarive instance.

### Openshift Server Resource

To configurate the Openshift Server Resource open:

In **Clarive SE**: Resources -> ClariveSE.

In **Clarive EE**: Resources -> Openshift.

You will be able to save your Openshift server parameters in this Resource. The main fields are:

- **Server** - Choose the *Server* Resource where the Openshift cluster is running.
- **Openshift cluster URL -** Write the URL where the Openshift cluster is running the website.
- **Token login?** - Check this if you wish to use a token to log into the app, or leave it unchecked to enter a user id and password to log in.
- **Main command** - Enter the main command used for the console API. The default value is *oc*.

Configuration example:

    Server: Openshift_server
    Openshift Cluster hostname: https://10.0.2.15:8443 
    Token login?: unchecked
    Username: test
    Password: test
    Main command: oc

### Openshift Application Resource

To configurate the Openshift Application Resource open:

In **Clarive SE**: Resources -> ClariveSE.

In **Clarive EE**: Resources -> Openshift.

In this Resource, you will be able to configure the parameters for Openshift apps to be able to check their status.
The parameters for this Resource are:

- **Openshift Server** - Choose the Openshift server Resource on which the application is located.
- **Project name** - Write the name of the project in which the application is located.
- **Application name** - Write the application name inside Openshift.

Configuration example:

    Openshift Server: OC_Server
    Project name: app-project
    Application name: application-example

### Openshift Task

The different available parameters are:

- **Command (variable name: command)** - In this parameter you can write the main command you wish to launch. Depending on the selected option, you will have different fields to fill out.
The different options to choose are:
    - Project ("project"): Selects a project from the Openshift server.
    - New-project ("new-project"): Creates a new project.
    - Delete project ("delete project"): Deletes a project.
    - New-app ("new-app"): Creates a new application in a project.
    - Delete app ("delete app"): Deletes an application.
    - Check status ("check status"): Checks the application deployment status.
    - Custom command ("custom"): Sends a custom command.

- **Server (server)** - This field will appear if you do not have the *check status* or *delete application* option selected. This option lets you choose the server on which you wish to execute the command. 
- **Command arguments (command_options)** - Here you can add different options or parameters for the command you wish to run, such as application name, url, directory etc. If you are running the custom command option, you do not need to type *oc* at the command.
- **Select application (app_name)** - This field will appear when you select the *check status* or *delete application* option, and you need to check the appropriate application Resource.
- **Application name (appNameNew)** - This field will appear when you select the *new app* option, and you need to write the application name.
- **Project name (projectName)** - This field will appear when you select the *new project*, *delete project*, *new app* or *project* option, and you need to write the project name.

**Only Clarive EE**

- **Errors and output** - These two fields are related to manage control errors. Options are:
   - **Fail and output error** - Search for configurated error pattern in script output. If found, an error message is
     displayed in monitor showing the match.
   - **Warn and output warn** - Search for configurated warning pattern in script output. If found, an error message is
     displayed in monitor showing the match.
   - **Custom** - In case combo box errors is set to custom a new form is showed to define the behavior with these fields:
   - **OK** - Range of return code values for the script to have succeeded. No message will be displayed in monitor.
   - **Warn** - Range of return code values to warn the user. A warn message will be displayed in monitor.
   - **Error** - Range of return code values for the script to have failed. An error message will be displayed in monitor.

## How to use

### In Clarive EE

Once the plugin is placed in its folder, you can find this service in the palette in the section of generic service and can be used like any other palette op.

Op Name: **Openshift Task**

Example:

```yaml
    Command: new-app
    Server: Clarive_server
    Project name: test
    Application name: test-app
    Command arguments: openshift/deployment-example
``` 

This example will deploy a new application from *openshift/deployment-example* inside test project in the selected server with the name *test-app*.
The service will return the output message and MID for the new application Resource in Clarive.

NOTE: For the command *new-app*, the server will return a HASH structure with two arrays for the output message and for the Resource's MID. The keys for each port array in the HASH will be *output* and *mid*.
For the other commands the output will always be the output message without any HASH structure.
Remember to set a "Return key" value in the "Openshift task" properties if you want to use the output data later.

If you wish to pass the MID to a variable to be used later, you need to use the *Code* palette service with the following code in Perl, where *{return_key}* is the HASH output from the *new-app* command and *app_ci* is the variable where you are going to save the *mid*:
    
    $stash->{app_ci} = $stash->{return_key}->{mid};

### In Clarive SE

#### Rulebook

If you want to use the plugin through the Rulebook, in any `do` block, use this ops as examples to configure the different parameters:

```yaml
rule: Openshift demo
do:
   - openshift_task:
       command: 'new-app'
       server: 'openshift_server'  # Use Resource MID
       project_name: "test"
       app_name_new: "test-app"
       command_options: ["openshift/deployment-example"]
```

```yaml
rule: Yet another Openshift demo
do:
   - openshift_task:
       command: 'project'
       server: 'openshift_server'   # Use Resource MID
       project_name: "test"
```

```yaml
rule: Yet another Openshift demo
do:
   - openshift_task:
       command: 'new-project'
       server: 'openshift_server'   # Use Resource MID
       project_name: "test"
```

```yaml
rule: Yet another Openshift demo
do:
   - openshift_task:
       command: 'check status'
       appName: 'app_resource-1'    # Use Resource MID
```

```yaml
rule: Yet another Openshift demo
do:
   - openshift_task:
       command: 'delete project'
       server: 'openshift_server'   # Use Resource MID
       project_name: "test"
```

```yaml
rule: Yet another Openshift demo
do:
   - openshift_task:
       command: 'delete app'
       app_name: 'app_resource-1'   # Use Resource MID
```

##### Outputs

###### Success

The service will return the output from the console.

###### Possible configuration failures

**Task failed**

The service will return the output from the console with the error message.

**Variable required**

```yaml
Error in rulebook (compile): Required argument(s) missing for op "openshift_task": "server"
```

Make sure you have all required variables defined.

**Not allowed variable**

```yaml
Error in rulebook (compile): Argument `Server` not available for op "openshift_task"
```

Make sure you are using the correct paramaters (make sure you are writing the variable names correctly).

## More questions?

Feel free to join **[Clarive Community](https://community.clarive.com/)** to resolve any of your doubts.