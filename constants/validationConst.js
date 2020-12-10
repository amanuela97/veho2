const registerConstraints = {
    companyId: {
        presence: {
            message: 'cannot be blank.',
        }
    },
    username: {
        presence: {
            message: 'cannot be blank.',
        },
        length: {
            minimum: 3,
            message: 'must be at least 3 characters',
        },
    },
    email: {
        presence: {
            message: 'cannot be blank.',
        },
        email: {
            message: 'not valid.',
        },
    },
    phoneNumber: {
        presence: {
            message: 'cannot be blank.',
        }
    },
    password: {
        presence: {
            message: 'cannot be blank.',
        },
        length: {
            minimum: 5,
            message: 'must be at least 5 characters',
        },
    },
    confirmPassword: {
        presence: 'cannot be blank.',
        equality: {
            attribute: 'password',
        },
    },
};


export default registerConstraints;