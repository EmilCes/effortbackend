const idMuscleSchema = () =>{
    return{
        in: ['params'],
            notEmpty: true,
            isDecimal: {
                errorMessage: 'Muscle ID must be a number'
            }
    }
}

const createMuscleSchema = () => {
    return {
        muscleName: {
            in: ['body'],
            notEmpty: true,
            isString: {
                errorMessage: 'Muscle name must be a string'
            }
        }
    };
};

const updateMuscleSchema = () => {
    return {
        muscleId: {
            in: ['params'],
            notEmpty: true,
            isDecimal: {
                errorMessage: 'Muscle ID must be a number'
            }
        },
        muscleName: {
            in: ['body'],
            notEmpty: true,
            isString: {
                errorMessage: 'Muscle name must be a string'
            }
        }
    };
};

