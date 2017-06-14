(function(params) {

    var server = Cla.ui.ciCombo({
        name: 'server',
        value: params.rec.server || '',
        class: 'generic_server',
        fieldLabel: 'Server',
        allowBlank: false
    });

    var ocClusterServerTextField = Cla.ui.textField({
        name: 'ocClusterServer',
        fieldLabel: 'Openshift Cluster URL',
        allowBlank: false
    });

    var loginCheckBox = Cla.ui.checkBox({
        name: 'tokenLogin',
        fieldLabel: 'Token login?',
        checked: params.rec.tokenLogin || false
    });

    loginCheckBox.on('check', function() {
        var v = loginCheckBox.checked;
        if (v) {
            tokenTextField.show();
            userTexfield.hide();
            passTextfield.hide();
            tokenTextField.allowBlank = false;
            userTexfield.allowBlank = true;
            passTextfield.allowBlank = true;
        } else {
            tokenTextField.hide();
            userTexfield.show();
            passTextfield.show();
            tokenTextField.allowBlank = true;
            userTexfield.allowBlank = false;
            passTextfield.allowBlank = false;
        }
    });

    var userTexfield = Cla.ui.textField({
        name: 'userName',
        fieldLabel: 'Username',
        allowBlank: false,
        hidden: !(loginCheckBox.checked != 1)
    });
    var passTextfield = Cla.ui.textField({
        name: 'password',
        fieldLabel: 'Password',
        allowBlank: false,
        inputType: 'password'
    });
    var tokenTextField = Cla.ui.textField({
        name: 'authToken',
        fieldLabel: 'Authentication Token',
        allowBlank: false,
        hidden: !(loginCheckBox.checked == 1)
    });
    var mainCommandTextField = Cla.ui.textField({
        name: 'mainCommand',
        value: params.rec.mainCommand || "oc",
        fieldLabel: 'Main command ("oc" by default)',
        allowBlank: false
    });


    return [
        server,
        ocClusterServerTextField,
        loginCheckBox,
        userTexfield,
        passTextfield,
        tokenTextField,
        mainCommandTextField
    ]
})