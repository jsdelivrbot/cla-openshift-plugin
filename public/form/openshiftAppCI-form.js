(function(params) {

    var server = Cla.ui.ciCombo({
        name: 'server',
        value: params.rec.server || '',
        class: 'OpenshiftServer',
        fieldLabel: 'Server',
        allowBlank: false
    });

    var projectNameTextField = Cla.ui.textField({
        name: 'appProject',
        fieldLabel: 'Project Name',
        allowBlank: false
    });
    var appNameTextField = Cla.ui.textField({
        name: 'appName',
        fieldLabel: 'Application name',
        allowBlank: false
    });


    return [
        server,
        projectNameTextField,
        appNameTextField

    ]
})