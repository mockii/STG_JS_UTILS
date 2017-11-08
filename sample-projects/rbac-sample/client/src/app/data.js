'use strict';

angular.module('rbac.sample.data', [])
    .constant('SECURED_OBJECTS', {
        ADMIN: [
            {
                object_name: "Dashboard",
                object_type: "Page",
                access_type: "WRITE",
                attributes: null
            },
            {
                object_name: "Sample Form",
                object_type: "Menu",
                access_type: "WRITE",
                attributes: null
            },
            {
                object_name: "User Administration",
                object_type: "Menu",
                access_type: "WRITE",
                attributes: null
            },
            {
                object_name: "RBS Admin Panel",
                object_type: "Page Section",
                access_type: "WRITE",
                attributes: null
            },
            {
                object_name: "RBS Portlet 2",
                object_type: "Page Section",
                access_type: "WRITE",
                attributes: null
            },
            {
                object_name: "RBS Input 7",
                object_type: "Field",
                access_type: "WRITE",
                attributes: null
            },
            {
                object_name: "RBS Input 8",
                object_type: "Field",
                access_type: "WRITE",
                attributes: null
            }
        ],
        USER: [
            {
                object_name: "Dashboard",
                object_type: "Page",
                access_type: "READ",
                attributes: null
            },
            {
                object_name: "Sample Form",
                object_type: "Menu",
                access_type: "WRITE",
                attributes: null
            },
            {
                object_name: "User Administration",
                object_type: "Menu",
                access_type: "BLOCKED",
                attributes: null
            },
            {
                object_name: "RBS Admin Panel",
                object_type: "Page Section",
                access_type: "BLOCKED",
                attributes: null
            },
            {
                object_name: "RBS Portlet 2",
                object_type: "Page Section",
                access_type: "READ",
                attributes: null
            },
            {
                object_name: "RBS Input 7",
                object_type: "Field",
                access_type: "READ",
                attributes: null
            },
            {
                object_name: "RBS Input 8",
                object_type: "Field",
                access_type: "READ",
                attributes: null
            }
        ]
    })

;