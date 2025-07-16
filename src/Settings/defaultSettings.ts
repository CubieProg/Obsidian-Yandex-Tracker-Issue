export const defaultSettings = {
    "orgId": "",
    "oauth": "",
    "issueAttrs": [
        {
            "firstLayer": "key",
            "modifyers": [
                "ytlink"
            ]
        },
        {
            "firstLayer": "queue",
            "modifyers": [
                "ytlink"
            ]
        },
        {
            "firstLayer": "summary",
            "modifyers": [
                "trim25"
            ]
        },
        {
            "firstLayer": "type",
            "modifyers": []
        },
        {
            "firstLayer": "assignee",
            "modifyers": [
                "initials"
            ]
        },
        {
            "firstLayer": "createdAt",
            "modifyers": [
                "date"
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
                "boardlink"
            ]
        },
        {
            "firstLayer": "name",
            "modifyers": [
                "trim25"
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
                "projectlink"
            ]
        },
        {
            "firstLayer": "name",
            "modifyers": []
        },
        {
            "firstLayer": "lead",
            "modifyers": [
                "initials"
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
        },
        {
            "firstLayer": "",
            "modifyers": []
        }
    ],
    "queueAttrs": [
        {
            "firstLayer": "key",
            "modifyers": [
                "ytlink"
            ]
        },
        {
            "firstLayer": "name",
            "modifyers": []
        },
        {
            "firstLayer": "description",
            "modifyers": [
                "trim25"
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
                "initials"
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
                "yesno"
            ]
        },
        {
            "firstLayer": "startDate",
            "modifyers": [
                "date"
            ]
        },
        {
            "firstLayer": "endDate",
            "modifyers": [
                "date"
            ]
        },
        {
            "firstLayer": "createdAt",
            "modifyers": [
                "date"
            ]
        },
        {
            "firstLayer": "createdBy",
            "modifyers": [
                "initials"
            ]
        },
        {
            "firstLayer": "board",
            "modifyers": [
                "boardlink"
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
                "initials"
            ]
        },
        {
            "firstLayer": "email",
            "modifyers": []
        },
        {
            "firstLayer": "firstLoginDate",
            "modifyers": [
                "date"
            ]
        },
        {
            "firstLayer": "lastLoginDate",
            "modifyers": [
                "time"
            ]
        }
    ],
    "ganttTerminationStatuses": [
        "resolved",
        "gotovo"
    ]
}