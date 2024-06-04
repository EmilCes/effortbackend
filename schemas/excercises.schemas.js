
const createExcerciseSchema = () =>{
    return {
        name: {
            in: ['body'],
            notEmpty: {
                errorMessage: 'Name is required'
            },
            isString: {
                errorMessage: 'Name must be a string'
            }
        },
        description: {
            in: ['body'],
            notEmpty: {
                errorMessage: 'Description is required'
            },
            isString: {
                errorMessage: 'Description must be a string'
            }
        },
        videoUrl: {
            in: ['body'],
            notEmpty: {
                errorMessage: 'Video URL is required'
            },
            isString: {
                errorMessage: 'Video URL must be a valid string'
            }
        },
        creatorId: {
            in: ['body'],
            notEmpty: {
                errorMessage: 'Creator ID is required'
            },
            isString: {
                errorMessage: 'Creator ID must be a string'
            }
        }
    };
}

const updateExerciseSchema = () => {
    return {
        creatorId: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: 'Creator id must not be empty'
            },
            isString: {
                errorMessage: 'Creator id must be a string'
            }
        },
        name: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: 'Name must not be empty'
            },
            isString: {
                errorMessage: 'Name must be a string'
            }
        },
        description: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: 'Description must not be empty'
            },
            isString: {
                errorMessage: 'Description must be a string'
            }
        },
        videoUrl: {
            in: ['body'],
            optional: true,
            notEmpty: {
                errorMessage: 'Video URL must not be empty'
            },
            isString: {
                errorMessage: 'Video URL must be a valid URL'
            }
        }
    };
};

const musclesToExerciseSchema = () => {
    return {
        muscles: {
            in: ['body'],
            isArray: {
                errorMessage: 'Muscles must be an array'
            },
            custom: {
                options: (muscles) => muscles.every(muscle => typeof muscle.name === 'string' && muscle.name.trim() !== ''),
                errorMessage: 'Each muscle must have a valid name'
            }
        }
    };
};


module.exports = {
    createExcerciseSchema,
    updateExerciseSchema, 
    musclesToExerciseSchema
};
