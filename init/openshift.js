var reg = require('cla/reg');

reg.register('service.openshift.command', {
    name: _('Openshift Task'),
    icon: '/plugin/cla-openshift-plugin/icon/openshift.svg',
    form: '/plugin/cla-openshift-plugin/form/openshift-form.js',
    rulebook: {
        moniker: 'openshift_task',
        description: _('Executes openshift tasks'),
        required: ['server', 'command'],
        allow: ['server', 'command', 'app_name_new', 'project_name', 'app_name',
            'command_options', 'errors'
        ],
        mapper: {
            'app_name_new': 'appNameNew',
            'project_name': 'projectName',
            'app_name': 'appName',
            'command_options': 'commandOptions'
        },
        examples: [{
            openshift_task: {
                command: 'new-app',
                server: 'openshift_server',
                project_name: "test",
                app_name: "test-app",
                command_options: "openshift/deployment-example"
            }
        }]
    },
    handler: function(ctx, params) {

        var ci = require("cla/ci");
        var reg = require("cla/reg");
        var log = require("cla/log");

        var server = params.server || "";
        var appMid = params.appName || "";
        var projectName = params.projectName || "";
        var commandOption = params.command || "";
        var mainCommand,
            ocServer,
            fullCommand,
            project,
            parsedResponse,
            appCi;
        if (commandOption != "check status" && commandOption != "delete app") {
            ocServer = ci.findOne({
                mid: server + ""
            });
            if (!ocServer) {
                log.fatal(_("Server CI doesn't exist"));
            }
            mainCommand = ocServer.mainCommand || "oc ";
        } else {
            appCi = ci.findOne({
                mid: appMid + ""
            });
            if (!appCi) {
                log.fatal(_("Application CI doesn't exist"));
            }
        }
        var additionalOptions = params.commandOptions || [];
        var options = " ";
        additionalOptions.forEach(function(element) {
            options += " " + element;
        });

        var command = (mainCommand || "") + " " + (commandOption || "");
        var errors = params.errors || "fail";

        if (commandOption == "custom") {
            fullCommand = mainCommand + " " + options;
        } else if (commandOption == "check status") {
            ocServer = ci.findOne({
                mid: appCi.server + ''
            });
            if (!ocServer) {
                log.fatal(_("Server CI doesn't exist"));
            }
            project = appCi.appProject;
            fullCommand = ocServer.mainCommand + " describe dc/" + appCi.appName;
        } else if (commandOption == "new-app") {
            errors = "silent";
            fullCommand = command + " --name='" + params.appNameNew + "' " + options;
        } else if (commandOption == "new-project") {
            errors = "silent";
            fullCommand = command + " --display-name='" + projectName + "' " + projectName + " " + options;
        } else if (commandOption == "delete app") {
            errors = "silent";
            ocServer = ci.findOne({
                mid: appCi.server + ''
            });
            if (!ocServer) {
                log.fatal(_("Server CI doesn't exist"));
            }
            project = appCi.appProject;
            fullCommand = ocServer.mainCommand + " delete all -l app='" + appCi.appName + "'";
        } else if (commandOption == "delete project") {
            errors = "silent";
            fullCommand = command + " " + projectName;
        } else {
            fullCommand = command + " " + projectName;
        }

        function remoteCommand(params, command, server, errors) {
            var output = reg.launch('service.scripting.remote', {
                name: _('Openshift Task'),
                config: {
                    errors: errors,
                    server: server.server,
                    path: command,
                    output_error: params.output_error,
                    output_warn: params.output_warn,
                    output_capture: params.output_capture,
                    output_ok: params.output_ok,
                    meta: params.meta,
                    rc_ok: params.rc_ok,
                    rc_error: params.rc_error,
                    rc_warn: params.rc_warn
                }
            });
            return output;
        }

        var loginCommand = ocServer.mainCommand + " login " + ocServer.ocClusterServer + ((ocServer.tokenLogin == 0) ? (" -u=" +
            ocServer.userName + " -p=" + ocServer.password) : (" --token=" + ocServer.authToken));
        var login = remoteCommand(params, loginCommand, ocServer, params.errors);
        var commandLaunch;
        var response;
        if (commandOption == "check status") {
            var selectProject = remoteCommand(params, "oc project " + project, ocServer);
            commandLaunch = remoteCommand(params, fullCommand, ocServer, errors);
            var parseIndex = commandLaunch.output.indexOf("Deployment #");
            parsedResponse = commandLaunch.output.substring(parseIndex, commandLaunch.output.length);
            parseIndex = parsedResponse.search(/Deployment #\d+:/);
            if (parseIndex <= 0) {
                parseIndex = parsedResponse.search("Events:");
            }
            if (parseIndex <= 0) {
                parseIndex = parsedResponse.search("No events");
            }
            var parsedSubString = parsedResponse.substring(0, parseIndex);
            response = parsedSubString;
            log.info(_("Openshift ") + commandOption + _(" task finished"), response);
        } else if (commandOption == "new-app") {
            var projectChange = remoteCommand(params, "oc project " + projectName, ocServer);
            commandLaunch = remoteCommand(params, fullCommand, ocServer, errors);

            if ((commandLaunch.rc != 0 && params.errors != "custom") || (params.errors == "custom" && params.rc_ok != commandLaunch.rc)) {
                parsedResponse = commandLaunch.output.match(/error: services ".*" already exists/);
                if (parsedResponse != null) {
                    log.warn(_("Warning ") + params.appNameNew + _(" application already exist"), commandLaunch.output);
                } else {
                    if (params.errors == "fail" || (params.errors == "custom" && params.rc_error != commandLaunch.rc)) {
                        log.fatal(_("Create new application failed "), commandLaunch.output);
                    } else if (params.errors == "warn" || (params.errors == "custom" && params.rc_warn != commandLaunch.rc)) {
                        log.warn(_("Create new application failed "), commandLaunch.output);
                    } else {
                        log.error(_("Create new application failed "), commandLaunch.output);
                    }
                }
            } else {
                log.info(_("Done, application ") + params.appNameNew + _(" created"), commandLaunch.output);
            }

            var OpenshiftCi = ci.getClass('OpenshiftApp');
            var ocApp = new OpenshiftCi({
                name: params.appNameNew,
                server: [params.server],
                appProject: projectName,
                appName: params.appNameNew
            });
            var appMid = ocApp.save();
            response = {};
            response.output = commandLaunch.output;
            response.mid = appMid;
            log.info(_("Openshift ") + commandOption + _(" task finished"), response);
        } else if (commandOption == "delete project") {
            commandLaunch = remoteCommand(params, fullCommand, ocServer, errors);
            response = commandLaunch.output;

            if ((commandLaunch.rc != 0 && params.errors != "custom") || (params.errors == "custom" && params.rc_ok != commandLaunch.rc)) {
                parsedResponse = response.match(/cannot delete projects in project ".*"/);
                if (parsedResponse != null) {
                    log.warn(_("Warning ") + project + _(" does not exist"), response);
                } else {
                    if (params.errors == "fail" || (params.errors == "custom" && params.rc_error != commandLaunch.rc)) {
                        log.fatal(_("Delete project failed "), response);
                    } else if (params.errors == "warn" || (params.errors == "custom" && params.rc_warn != commandLaunch.rc)) {
                        log.warn(_("Delete project failed "), response);
                    } else {
                        log.error(_("Delete project failed "), response);
                    }
                }
            } else {
                log.info(_("Done, project ") + projectName + _(" deleted"), response);
            }

            log.info(_("Openshift ") + commandOption + _(" task finished"), response);
        } else if (commandOption == "delete app") {
            remoteCommand(params, "oc project " + project, ocServer, params.errors);
            commandLaunch = remoteCommand(params, fullCommand, ocServer, errors);

            response = commandLaunch.output;
            parsedResponse = response.match(/No resources found/);

            if ((commandLaunch.rc != 0 && params.errors != "custom") || (params.errors == "custom" && params.rc_ok != commandLaunch.rc)) {

                if (parsedResponse != null) {
                    log.warn(_("Warning ") + appCi.appName + __(" not found"), response);
                } else {
                    if (params.errors == "fail" || (params.errors == "custom" && params.rc_error != commandLaunch.rc)) {
                        log.fatal(_("Delete application failed "), response);
                    } else if (params.errors == "warn" || (params.errors == "custom" && params.rc_warn != commandLaunch.rc)) {
                        log.warn(_("Delete application failed "), response);
                    } else {
                        log.error(_("Delete application failed "), response);
                    }
                }
            } else {
                log.info(_("Done, application ") + appCi.appName + _(" deleted"), response);
            }

            appCi = ci.load(appMid + '');
            appCi.active(0);
            appCi.save();
            log.info(_("Openshift ") + commandOption + _(" task finished"), response);

        } else if (commandOption == "new-project") {

            commandLaunch = remoteCommand(params, fullCommand, ocServer);
            response = commandLaunch.output;

            if ((commandLaunch.rc != 0 && params.errors != "custom") || (params.errors == "custom" && params.rc_ok != commandLaunch.rc)) {
                parsedResponse = response.match(/Error from server: project ".*" already exists/);
                if (parsedResponse != null) {
                    log.warn(_("Warning ") + projectName + _(" project already exist"), response);
                } else {
                    if (params.errors == "fail" || (params.errors == "custom" && params.rc_error != commandLaunch.rc)) {
                        log.fatal(_("Create new project failed "), response);
                    } else if (params.errors == "warn" || (params.errors == "custom" && params.rc_warn != commandLaunch.rc)) {
                        log.warn(_("Create new project failed "), response);
                    } else {
                        log.error(_("Create new project failed "), response);
                    }
                }
            } else {
                log.info(_("Done, project ") + projectName + _(" created"), response);
            }

            log.info(_("Openshift ") + commandOption + _(" task finished"), response);

        } else {

            commandLaunch = remoteCommand(params, fullCommand, ocServer);
            response = commandLaunch.output;
            log.info(_("Openshift ") + commandOption + _(" task finished"), response);
        }

        return response;

    }
});