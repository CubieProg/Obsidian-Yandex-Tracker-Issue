export const defaultSettings = {
    "orgId": "",
    "oauth": "", "issueAttrs": [
        {
            "firstLayer": "assignee",
            "secondLayer": "login",
            "modifyers": []
        },
        {
            "firstLayer": "key",
            "modifyers": [
                {
                    "modifyerName": "ytlink",
                    "args": []
                }
            ]
        },
        {
            "firstLayer": "queue",
            "modifyers": [
                {
                    "modifyerName": "ytlink",
                    "args": []
                }
            ]
        },
        {
            "firstLayer": "summary",
            "modifyers": [
                {
                    "modifyerName": "trim",
                    "args": [
                        "25"
                    ]
                }
            ]
        },
        {
            "firstLayer": "type",
            "modifyers": []
        },
        {
            "firstLayer": "assignee",
            "modifyers": [
                {
                    "modifyerName": "initials",
                    "args": []
                }
            ]
        },
        {
            "firstLayer": "createdAt",
            "modifyers": [
                {
                    "modifyerName": "date",
                    "args": []
                }
            ]
        },
        {
            "firstLayer": "status",
            "modifyers": []
        },
        {
            "firstLayer": "project",
            "modifyers": []
        }
    ],
    "boardAttrs": [
        {
            "firstLayer": "id",
            "modifyers": [
                {
                    "modifyerName": "boardlink",
                    "args": []
                }
            ]
        },
        {
            "firstLayer": "name",
            "modifyers": [
                {
                    "modifyerName": "trim",
                    "args": [
                        "25"
                    ]
                }
            ]
        },
        {
            "firstLayer": "estimateBy",
            "modifyers": []
        },
        {
            "firstLayer": "country",
            "modifyers": []
        },
        {
            "firstLayer": "defaultQueue",
            "modifyers": []
        },
        {
            "firstLayer": "columns",
            "modifyers": []
        }
    ],
    "projectAttrs": [
        {
            "firstLayer": "id",
            "modifyers": [
                {
                    "modifyerName": "projectlink",
                    "args": []
                }
            ]
        },
        {
            "firstLayer": "name",
            "modifyers": []
        },
        {
            "firstLayer": "lead",
            "modifyers": [
                {
                    "modifyerName": "initials",
                    "args": []
                }
            ]
        },
        {
            "firstLayer": "status",
            "modifyers": []
        },
        {
            "firstLayer": "startDate",
            "modifyers": []
        },
        {
            "firstLayer": "endDate",
            "modifyers": []
        }
    ],
    "queueAttrs": [
        {
            "firstLayer": "key",
            "modifyers": [
                {
                    "modifyerName": "ytlink",
                    "args": []
                }
            ]
        },
        {
            "firstLayer": "name",
            "modifyers": []
        },
        {
            "firstLayer": "description",
            "modifyers": [
                {
                    "modifyerName": "trim",
                    "args": [
                        "25"
                    ]
                }
            ]
        },
        {
            "firstLayer": "defaultType",
            "modifyers": []
        },
        {
            "firstLayer": "defaultPriority",
            "modifyers": []
        },
        {
            "firstLayer": "lead",
            "modifyers": [
                {
                    "modifyerName": "initials",
                    "args": []
                }
            ]
        },
        {
            "firstLayer": "teamUsers",
            "modifyers": []
        },
        {
            "firstLayer": "",
            "modifyers": []
        }
    ],
    "sprintAttrs": [
        {
            "firstLayer": "name",
            "modifyers": []
        },
        {
            "firstLayer": "status",
            "modifyers": []
        },
        {
            "firstLayer": "archived",
            "modifyers": [
                {
                    "modifyerName": "yesno",
                    "args": []
                }
            ]
        },
        {
            "firstLayer": "startDate",
            "modifyers": [
                {
                    "modifyerName": "date",
                    "args": []
                }
            ]
        },
        {
            "firstLayer": "endDate",
            "modifyers": [
                {
                    "modifyerName": "date",
                    "args": []
                }
            ]
        },
        {
            "firstLayer": "createdAt",
            "modifyers": [
                {
                    "modifyerName": "date",
                    "args": []
                }
            ]
        },
        {
            "firstLayer": "createdBy",
            "modifyers": [
                {
                    "modifyerName": "initials",
                    "args": []
                }
            ]
        },
        {
            "firstLayer": "board",
            "modifyers": [
                {
                    "modifyerName": "boardlink",
                    "args": []
                }
            ],
            "secondLayer": "id"
        },
        {
            "firstLayer": "",
            "modifyers": []
        }
    ],
    "userAttrs": [
        {
            "firstLayer": "display",
            "modifyers": [
                {
                    "modifyerName": "initials",
                    "args": []
                }
            ]
        },
        {
            "firstLayer": "email",
            "modifyers": []
        },
        {
            "firstLayer": "firstLoginDate",
            "modifyers": [
                {
                    "modifyerName": "date",
                    "args": []
                }
            ]
        },
        {
            "firstLayer": "lastLoginDate",
            "modifyers": [
                {
                    "modifyerName": "time",
                    "args": []
                }
            ]
        }
    ],
    "ganttTerminationStatuses": [
        "resolved",
        "gotovo"
    ]
}