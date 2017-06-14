(function(params) {
    var data = params.data || {};

    var serverComboBox = Cla.ui.ciCombo({
        name: 'server',
        class: 'OpenshiftServer',
        fieldLabel: _('Server'),
        value: params.data.server || '',
        hidden: !(params.data.command != 'check status'),
        width: 400,
        allowBlank: false,
        with_vars: 1
    });

    var commandComboBox = Cla.ui.comboBox({
        name: 'command',
        fieldLabel: 'Command',
        data: [
            ['project','project'],
            ['new-project','new-project'],
            ['new-app','new-app'],
            ['check status','check status'],
            ['delete project','delete project'],
            ['delete app','delete app'],
            ['Custom command','Custom command']
        ],
        value: params.data.command || 'project',
        allowBlank: false,
        anchor: '100%',
        singleMode: true
    });

    var appNameTextField = Cla.ui.textField({
        fieldLabel: _('Application name'),
        name: 'appNameNew',
        value: params.data.appNameNew || '',
        allowBlank: true,
        hidden: !(params.data.command != 'check status')
    });

    var projectNameTextField = Cla.ui.textField({
        fieldLabel: _('Project name'),
        name: 'projectName',
        value: params.data.projectName || '',
        allowBlank: true,
        hidden: !(params.data.command != 'check status')
    });

    var appComboBox = Cla.ui.ciCombo({
        fieldLabel: _('Select application'),
        name: 'appName',
        class: 'OpenshiftApp',
        value: params.data.appName || '',
        width: 400,
        allowBlank: true,
        with_vars: 1,
        hidden: !(params.data.command == 'check status')
    });

    commandComboBox.on('addItem', function() {
        var v = commandComboBox.getValue();
        if (v == 'check status') {
            appComboBox.show();
            serverComboBox.hide();
            appComboBox.allowBlank = false;
            serverComboBox.allowBlank = true;
            projectNameTextField.hide();
            appNameTextField.hide();
            optionsTextfield.hide();
            projectNameTextField.allowBlank = true;
            appNameTextField.allowBlank = true;
        } else if (v == 'new-app') {
            appComboBox.hide();
            serverComboBox.show();
            appComboBox.allowBlank = true;
            serverComboBox.allowBlank = false;
            projectNameTextField.show();
            appNameTextField.show();
            optionsTextfield.show();
            projectNameTextField.allowBlank = false;
            appNameTextField.allowBlank = false;
        } else if (v == 'new-project') {
            appComboBox.hide();
            serverComboBox.show();
            appComboBox.allowBlank = true;
            serverComboBox.allowBlank = false;
            projectNameTextField.show();
            appNameTextField.hide();
            optionsTextfield.show();
            projectNameTextField.allowBlank = false;
            appNameTextField.allowBlank = true;
        } else if (v == 'delete project') {
            appComboBox.hide();
            serverComboBox.show();
            appComboBox.allowBlank = true;
            serverComboBox.allowBlank = false;
            projectNameTextField.show();
            appNameTextField.hide();
            optionsTextfield.hide();
            projectNameTextField.allowBlank = false;
            appNameTextField.allowBlank = true;
        } else if (v == 'delete app') {
            appComboBox.show();
            serverComboBox.hide();
            appComboBox.allowBlank = false;
            serverComboBox.allowBlank = true;
            projectNameTextField.hide();
            appNameTextField.hide();
            optionsTextfield.hide();
            projectNameTextField.allowBlank = true;
            appNameTextField.allowBlank = true;
        } else if (v == 'project') {
            appComboBox.hide();
            serverComboBox.show();
            appComboBox.allowBlank = true;
            serverComboBox.allowBlank = false;
            projectNameTextField.show();
            appNameTextField.hide();
            optionsTextfield.hide();
            projectNameTextField.allowBlank = false;
            appNameTextField.allowBlank = true;
        } else {
            appComboBox.hide();
            serverComboBox.show();
            appComboBox.allowBlank = true;
            serverComboBox.allowBlank = false;
            projectNameTextField.hide();
            appNameTextField.hide();
            optionsTextfield.show();
            projectNameTextField.allowBlank = true;
            appNameTextField.allowBlank = true;
        }
    });

    var optionsTextfield = Cla.ui.arrayGrid({
        fieldLabel: _('Additional options'),
        name: 'commandOptions',
        value: params.data.commandOptions,
        description: 'Command Options',
        default_value: '.'
    });

    var errorBox = Cla.ui.errorManagementBox({
        errorTypeName: 'errors',
        errorTypeValue: params.data.errors || 'fail',
        rcOkName: 'rcOk',
        rcOkValue: params.data.rcOk,
        rcWarnName: 'rcWarn',
        rcWarnValue: params.data.rcWarn,
        rcErrorName: 'rcError',
        rcErrorValue: params.data.rcError,
        errorTabsValue: params.data
    });

    var panel = Cla.ui.panel({
        layout: 'form',
        items: [
            commandComboBox,
            serverComboBox,
            projectNameTextField,
            appNameTextField,
            appComboBox,
            optionsTextfield,
            errorBox
        ]
    });

    return panel;
})