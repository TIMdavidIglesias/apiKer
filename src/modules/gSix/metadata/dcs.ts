import { IGDoc } from "../models";

export const _dcs: IGDoc[] = [{
    database: {
        db: 'apiKer',
        dbCollection: 'accounts',
        customDB: 'apikers'
    },
    fields: {
        tst1: {
            tst11: {
                _test: {
                    t1: {
                        type: 'Boolean', options: {
                            required: false, param: 't1', apiDoc: {
                                description: 't1'
                            }
                        }
                    },
                    t2: {
                        type: 'String', options: {
                            required: false, param: 't2', apiDoc: {
                                description: 't2'
                            }
                        }
                    },
                    t3: {
                        type: 'Number', options: {
                            required: false, param: 't3', apiDoc: {
                                description: 't3'
                            }
                        }
                    },
                    t4: {
                        type: 'String', options: {
                            required: false, param: 't4', apiDoc: {
                                description: 't4'
                            }
                        }
                    },
                    t5: {
                        type: 'Boolean', options: {
                            required: false, param: 't5', apiDoc: {
                                description: 't5'
                            }
                        }
                    },
                    t6: {
                        type: 'Number', options: {
                            required: false, param: 't6', apiDoc: {
                                description: 't6'
                            }
                        }
                    },
                }, tsssst: {
                    type: 'String', options: {
                        required: false, param: 'tt', apiDoc: {
                            description: 't6'
                        }
                    }
                },
            }
        },
        tt: {
            type: 'String', options: {
                required: false, param: 'tt', apiDoc: {
                    description: 't6'
                }
            }
        },
        _users: {
            type: 'String', options: {
                required: false, param: 'users', apiDoc: {
                    description: 't6'
                }
            }
        },
        _whiteListedUsers: {
            type: 'String', options: {
                required: false, param: 'whiteListedUsers', apiDoc: {
                    description: 't6'
                }
            }
        },
        _blackListedUsers: {
            type: 'String', options: {
                required: false, param: 'blackListedUsers', apiDoc: {
                    description: 't6'
                }
            }
        },
        publicAccountNo: {
            type: 'String', options: {
                required: true, param: 'publicAccountNo', apiDoc: {
                    description: 'phoneType'
                }
            }
        },
        accountNo: {
            type: 'String', options: {
                required: true, param: 'accountNo', apiDoc: {
                    description: 'phoneType'
                }
            }
        },
        metadata: {
            allowedAppGroup: {
                type: 'String', options: {
                    required: false, param: 'allowedAppGroup', apiDoc: {
                        description: 'phoneType'
                    }
                }
            },
            registerAppID: {
                type: 'String', options: {
                    required: false, param: 'registerAppID', apiDoc: {
                        description: 'phoneType'
                    }
                }
            },
            maxPermission: {
                type: 'String', options: {
                    required: false, param: 'maxPermission', apiDoc: {
                        description: 'phoneType'
                    }
                }
            },
            isActive: {
                type: 'Boolean', options: {
                    required: false, param: 'isActive', apiDoc: {
                        description: 'phoneType'
                    }
                }
            },
            isLocked: {
                type: 'Boolean', options: {
                    required: false, param: 'isLocked', apiDoc: {
                        description: 'phoneType'
                    }
                }
            },
            isPrimary: {
                type: 'Boolean', options: {
                    required: false, param: 'isPrimary', apiDoc: {
                        description: 'phoneType'
                    }
                }
            },
            isVerified: {
                type: 'Boolean', options: {
                    required: false, param: 'isVerified', apiDoc: {
                        description: 'phoneType'
                    }
                }
            },
        },
        test: {
            _telfs: {
                isPrimary: {
                    type: 'Boolean', options: {
                        required: false, param: 'isPrimary', apiDoc: {
                            description: 'phoneType'
                        }
                    }
                },
                number: {
                    type: 'String', options: {
                        required: false, param: 'number', apiDoc: {
                            description: 'phoneType'
                        }
                    }
                },
                countryCode: {
                    type: 'Number', options: {
                        required: false, param: 'countryCode', apiDoc: {
                            description: 'phoneType'
                        }
                    }
                },
                alias: {
                    type: 'String', options: {
                        required: false, param: 'alias', apiDoc: {
                            description: 'phoneType'
                        }
                    }
                },
                isActive: {
                    type: 'Boolean', options: {
                        required: false, param: 'isActive', apiDoc: {
                            description: 'phoneType'
                        }
                    }
                },
                phoneType: {
                    type: 'Number', options: {
                        required: false, param: 'phoneType', apiDoc: {
                            description: 'phoneType'
                        }
                    }
                },
            }
        }
    },
    metadata: {
        alias: 'accounts',
        isActive: true,
    },
    queries: [{
        name: 'lookUpByUser',
        query:
        {
            $and: [
                { _users: { operator: 'in', param: 'LU_users' } }, // Transacciones con un monto mayor a 1000
                // {
                //     $and: [
                //         { isActive: { operator: 'eq', param: 'isActive' } },    // Transacciones de la categoría 'Compras'
                //     ]
                // }
            ]
        },
    }]
},
{
    database: {
        db: 'apiKer',
        dbCollection: 'users',
        customDB: 'apikers'
    },
    queries: [{
        name: 'lookUpByEmail',
        query:
        {
            $and: [
                { email: { operator: 'eq', param: 'email' } }, // Transacciones con un monto mayor a 1000
                // {
                //     $and: [
                //         { isActive: { operator: 'eq', param: 'isActive' } },    // Transacciones de la categoría 'Compras'
                //     ]
                // }
            ]
        },

    }],
    fields: {
        email: {
            type: 'String', options: {
                unique: true, required: true, param: 'email', apiDoc: {
                    description: 'phoneType'
                }
            }
        },
        publicName: {
            type: 'String', options: {
                required: true, param: 'publicName', apiDoc: {
                    description: 'phoneType'
                }
            }
        },
        password: {
            type: 'String', options: {
                required: true, param: 'password', apiDoc: {
                    description: 'phoneType'
                }
            }
        },
        firstName: {
            type: 'String', options: {
                required: false, param: 'firstName', apiDoc: {
                    description: 'phoneType'
                }
            }
        },
        lastName: {
            type: 'String', options: {
                required: false, param: 'lastName', apiDoc: {
                    description: 'phoneType'
                }
            }
        },
        middleName: {
            type: 'String', options: {
                required: false, param: 'middleName', apiDoc: {
                    description: 'phoneType'
                }
            }
        },
        DOB: {
            type: 'Date', options: {
                required: false, param: 'DOB', apiDoc: {
                    description: 'phoneType'
                }
            }
        },
        _phones: {
            isPrimary: {
                type: 'Boolean', options: {
                    required: false, param: 'pIsPrimary', apiDoc: {
                        description: 'phoneType'
                    }
                }
            },
            number: {
                type: 'String', options: {
                    required: false, param: 'pNumber', apiDoc: {
                        description: 'phoneType'
                    }
                }
            },
            countryCode: {
                type: 'Number', options: {
                    required: false, param: 'pCountryCode', apiDoc: {
                        description: 'phoneType'
                    }
                }
            },
            alias: {
                type: 'String', options: {
                    required: false, param: 'pAlias', apiDoc: {
                        description: 'phoneType'
                    }
                }
            },
            isActive: {
                type: 'Boolean', options: {
                    required: false, param: 'pIsActive', apiDoc: {
                        description: 'phoneType'
                    }
                }
            },
            phoneType: {
                type: 'Number', options: {
                    required: false, param: 'pPhoneType', apiDoc: {
                        description: 'phoneType'
                    }
                }
            },
            track: {
                t1: {
                    _tracks: {
                        info: {
                            type: 'String', options: {
                                required: false, param: 'email1', apiDoc: {
                                    description: 'phoneType'
                                }
                            }
                        },
                        info2: {
                            type: 'String', options: {
                                required: false, param: 'email2', apiDoc: {
                                    description: 'phoneType'
                                }
                            }
                        },
                    },
                    metadata: {
                        m1: {
                            type: 'String', options: {
                                required: false, param: 'm1', apiDoc: {
                                    description: 'phoneType'
                                }
                            }
                        },
                    }
                }
            },
        },
        metadata: {
            data: {
                allowedAppGroup: {
                    type: 'String', options: {
                        required: false, param: 'allowedAppGroup', apiDoc: {
                            description: 'phoneType'
                        }
                    }
                },
                registerAppID: {
                    type: 'String', options: {
                        required: false, param: 'registerAppID', apiDoc: {
                            description: 'phoneType'
                        }
                    }
                },
                maxPermission: {
                    type: 'String', options: {
                        required: false, param: 'maxPermission', apiDoc: {
                            description: 'phoneType'
                        }
                    }
                },
                isActive: {
                    type: 'Boolean', options: {
                        required: false, param: 'isActive', apiDoc: {
                            description: 'phoneType'
                        }
                    }
                },
                isLocked: {
                    type: 'Boolean', options: {
                        required: false, param: 'isLocked', apiDoc: {
                            description: 'phoneType'
                        }
                    }
                },
                isPrimary: {
                    type: 'Boolean', options: {
                        required: false, param: 'isPrimary', apiDoc: {
                            description: 'phoneType'
                        }
                    }
                },
                isVerified: {
                    type: 'Boolean', options: {
                        required: false, param: 'isVerified', apiDoc: {
                            description: 'phoneType'
                        }
                    }
                },
                times: {
                    firstLoginTime: {
                        type: 'Date', options: {
                            required: false, param: 'firstLoginTime', apiDoc: {
                                description: 'phoneType'
                            }
                        }
                    },
                    lastLoginTime: {
                        type: 'Date', options: {
                            required: false, param: 'lastLoginTime', apiDoc: {
                                description: 'phoneType'
                            }
                        }
                    },
                    firstSessionTime: {
                        type: 'Date', options: {
                            required: false, param: 'firstSessionTime', apiDoc: {
                                description: 'phoneType'
                            }
                        }
                    },
                    lastSessionTime: {
                        type: 'Date', options: {
                            required: false, param: 'lastSessionTime', apiDoc: {
                                description: 'phoneType'
                            }
                        }
                    },
                },
            }
        }
    },
    metadata: {
        alias: 'users',
        isActive: true,
    }
},
{
    database: {
        db: 'apiKer',
        dbCollection: 'session',
        customDB: 'apikers'
    },
    queries: [{
        name: 'lookUpByUserID',
        query:
        {
            $and: [
                { userID: { operator: 'eq', param: 'userID' } },
                // { registerAppID: { operator: 'eq', param: 'registerAppID' } }
            ]
        },

    },
    {
        name: 'lookUpByID',
        query:
        {
            $and: [
                { _id: { operator: 'eq', param: 'sID' } }, // Transacciones con un monto mayor a 1000
                // {
                //     $and: [
                //         { isActive: { operator: 'eq', param: 'isActive' } },    // Transacciones de la categoría 'Compras'
                //     ]
                // }
            ]
        },

    }],
    fields: {
        userID: {
            type: 'String', options: {
                required: true, param: 'userID', apiDoc: {
                    description: 'phoneType'
                }
            }
        },
        fingerPrint: {
            type: 'String', options: {
                required: false, param: 'fingerPrint', apiDoc: {
                    description: 'phoneType'
                }
            }
        },
        startTime: {
            type: 'Date', options: {
                required: true, param: 'startTime', apiDoc: {
                    description: 'phoneType'
                }
            }
        },
        lastUpdatedTime: {
            type: 'Date', options: {
                required: true, param: 'lastUpdatedTime', apiDoc: {
                    description: 'phoneType'
                }
            }
        },
        sessionAliveMins: {
            type: 'Number', options: {
                required: true, param: 'sessionAliveMins', apiDoc: {
                    description: 'phoneType'
                }
            }
        },
        allowedAppGroup: {
            type: 'String', options: {
                required: false, param: 'allowedAppGroup', apiDoc: {
                    description: 'phoneType'
                }
            }
        },
        registerAppID: {
            type: 'String', options: {
                required: false, param: 'registerAppID', apiDoc: {
                    description: 'phoneType'
                }
            }
        },
    },
    metadata: {
        alias: 'session',
        isActive: true,
    }
}]