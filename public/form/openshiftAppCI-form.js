(function(params) {

    var server = Cla.ui.ciCombo({
        name: 'server',
        value: params.rec.server || '',
        class: 'OpenshiftServer',
        fieldLabel: _('Server'),
        allowBlank: false
    });

    var projectNameTextField = Cla.ui.textField({
        name: 'appProject',
        fieldLabel: _('Project Name'),
        allowBlank: false
    });
    var appNameTextField = Cla.ui.textField({
        name: 'appName',
        fieldLabel: _('Application name'),
        allowBlank: false
    });


    return [
        server,
        projectNameTextField,
        appNameTextField

    ]
})