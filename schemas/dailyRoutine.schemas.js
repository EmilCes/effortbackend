const createDailyRoutine = () =>{
    return{
        name: {
            in: ['body'],
            notEmpty:true,
            isString: {
                errorMessage: 'Daily Routine name must be a string'
            }
        }
    }
}

const updateDailyRoutine = () =>{
    return{
        name: {
            in: ['body'],
            notEmpty:true,
            isString: {
                errorMessage: 'Daily Routine name must be a string'
            }
        }
    }
}

const addExercisesToRoutineSchema = () => {
    return {
        exercises: {
            in: ['body'],
            isArray: {
                errorMessage: 'Exercises must be an array'
            },
            custom: {
                options: (exercises) => exercises.every(exercise => typeof exercise.exerciseId === 'number' && typeof exercise.series === 'number' && typeof exercise.repetitions === 'number'),
                errorMessage: 'Each exercise must have valid properties (exerciseId, series, repetitions)'
            }
        }
    };
};

const updateExercisesInRoutineSchema = () => {
    return {
        exercises: {
            in: ['body'],
            isArray: {
                errorMessage: 'Exercises must be an array'
            },
            custom: {
                options: (exercises) => exercises.every(exercise => typeof exercise.exerciseId === 'number' && typeof exercise.series === 'number' && typeof exercise.repetitions === 'number'),
                errorMessage: 'Each exercise must have valid properties (exerciseId, series, repetitions)'
            }
        }
    };
};

module.exports = {
    createDailyRoutine,
    updateDailyRoutine,
    addExercisesToRoutineSchema,
    updateExercisesInRoutineSchema
}
