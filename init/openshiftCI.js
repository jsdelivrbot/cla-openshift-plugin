var ci = require("cla/ci");

ci.createRole("Openshift");

ci.createClass("OpenshiftServer", {
    form: '/plugin/cla-openshift-plugin/form/openshiftCI-form.js',
    icon: '/plugin/cla-openshift-plugin/icon/openshift.svg',
    roles: ["Openshift", "ClariveSE"],
    has: {
        server: {
            is: "rw",
            isa: "ArrayRef",
            required: true
        },
        ocClusterServer: {
            is: "rw",
            isa: "Str",
            required: true
        },
        tokenLogin: {
            is: "rw",
            isa: "Bool",
            required: true
        },
        userName: {
            is: "rw",
            isa: "Str",
            required: false
        },
        password: {
            is: "rw",
            isa: "Str",
            required: false
        },
        authToken: {
            is: "rw",
            isa: "Str",
            required: false
        },
        mainCommand: {
            is: "rw",
            isa: "Str",
            required: true
        },
    }

});

ci.createClass("OpenshiftApp", {
    form: '/plugin/cla-openshift-plugin/form/openshiftAppCI-form.js',
    icon: '/plugin/cla-openshift-plugin/icon/openshift.svg',
    roles: ["Openshift", "ClariveSE"],
    has: {
        server: {
            is: "rw",
            isa: "ArrayRef",
            required: true
        },
        appProject: {
            is: "rw",
            isa: "Str",
            required: true
        },
        appName: {
            is: "rw",
            isa: "Str",
            required: true
        }
    }

});