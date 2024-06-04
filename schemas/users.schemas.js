const getUserByUsernameSchema = () => {
    return {
        username: {
            in: ['params'],
            notEmpty: true,
            isString: {
                errorMessage: 'Username must be a string'
            }
        }
    };
};

const createUserSchema = () => {
    return {
        email: {
            in: ['body'],
            notEmpty: {
                errorMessage: 'Email is required'
            },
            isEmail: {
                errorMessage: 'Invalid email'
            }
        },
        password: {
            in: ['body'],
            notEmpty: {
                errorMessage: 'Password is required'
            },
            isLength: {
                options: { min: 6 },
                errorMessage: 'Password must be at least 6 characters long'
            }
        },
        username: {
            in: ['body'],
            notEmpty: {
                errorMessage: 'Username is required'
            },
            isString: {
                errorMessage: 'Username must be a string'
            }
        },
        name: {
            in: ['body'],
            notEmpty: {
                errorMessage: 'Name is required'
            },
            isString: {
                errorMessage: 'Name must be a string'
            }
        },
        lastname: {
            in: ['body'],
            notEmpty: {
                errorMessage: 'Last name is required'
            },
            isString: {
                errorMessage: 'Last name must be a string'
            }
        },
        dateOfBirth: {
            in: ['body'],
            notEmpty: {
                errorMessage: 'Date of birth is required'
            },
            isDate: {
                errorMessage: 'Invalid date format'
            }
        },
        userType: {
            in: ['body'],
            notEmpty: {
                errorMessage: 'User type is required'
            },
            isString: {
                errorMessage: 'User type must be a string'
            }
        }
    };
};

const updateUserSchema = () => {
    return {
        email: {
            in: ['body'],
            optional: true,
            isEmail: {
                errorMessage: 'Invalid email'
            }
        },
        username: {
            in: ['body'],
            optional: true,
            isString: {
                errorMessage: 'Username must be a string'
            }
        },
        name: {
            in: ['body'],
            optional: true,
            isString: {
                errorMessage: 'Name must be a string'
            }
        },
        middlename: {
            in: ['body'],
            optional: true,
            isString: {
                errorMessage: 'Middle name must be a string'
            }
        },
        lastname: {
            in: ['body'],
            optional: true,
            isString: {
                errorMessage: 'Last name must be a string'
            }
        },
        weight: {
            in: ['body'],
            optional: true,
            isFloat: {
                errorMessage: 'Weight must be a number'
            }
        },
        height: {
            in: ['body'],
            optional: true,
            isFloat: {
                errorMessage: 'Height must be a number'
            }
        }
    };
};

module.exports = {
    getUserByUsernameSchema,
    createUserSchema,
    updateUserSchema
};
