const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const ClaimTypes = require('../config/claimTypes');

const GenerateToken = (email, username, userType) => {
    const token = jwt.sign({
        [ClaimTypes.Name]: email,
        [ClaimTypes.GivenName]: username,
        [ClaimTypes.Role]: userType,
        "iss": "Effort",
        "aud": "EffortUsers"
    },
        jwtSecret, {
            expiresIn: '20m'
        }
    )

    return token;
};

const RemainingTimeToken = (req) => {
    try {
        const authHeader = req.header('Authorization');
        if(!authHeader.startsWith('Bearer '))
            return null;

        // Get token from request 
        const token = authHeader.split(' ')[1];

        // Verify the token, if it isn't valid go to the catch 
        const decodedToken = jwt.verify(token, jwtSecret);

        // Returns the remaining time in minutes
        const time = (decodedToken.exp - (new Date().getTime() / 1000));
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time - minutes * 60);
        
        return "00:" + minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0");
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = { GenerateToken, RemainingTimeToken }