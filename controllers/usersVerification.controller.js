const crypto = require('crypto');
const { user } = require('../models');
const { sendEmail } = require('../services/mailSender.service')

let self = {};

// POST: api/user-verification/:email
self.sendEmail = async function (req, res) {
    try {
        const email = req.params.email;
        const userInstance = await user.findOne({ where: { email: email } });
        
        if (!userInstance) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const token = crypto.randomBytes(20).toString('hex');
        userInstance.emailVerificationToken = token;
        await user.update({ emailVerificationToken: token }, { where: { email: email } })
        const verificationLink = `http://192.168.100.5:3000/api/user-verification/${token}`;

        await sendEmail(
            email,
            'Confirmación Correo Electrónico',
            `Por favor, confirma tu correo electrónico haciendo clic en el siguiente enlace: ${verificationLink}`
        );

        return res.status(200).send({ message: 'Correo electrónico de confirmación enviado' });
    } catch (error) {
        console.error('Error al enviar el correo de confirmación:', error);
    }
}

// GET: api/user-verification/verified/email
self.verifiedEmail = async function (req, res) {
    const email = req.params.email;
    let data = await user.findOne({ where: { email: email, emailVerified: true } });

    if (!data) return res.status(400).json({ message: 'Correo no verificado.' });

    return res.status(200).json({ message: 'Correo verificado.' });
}

// GET: api/user-verification/token
self.verifyEmail = async function (req, res) {
    try {
        const token = req.params.token;

        const result = await user.update(
            { emailVerified: true }, 
            { 
                where: { emailVerificationToken: token }, 
                returning: true
            }
        );

        if (result[0] === 0) {
            return res.status(200).send({ message: 'Correo ya verificado.' });
        }

        const updatedUser = result[1][0];

        return res.status(200).send({ message: 'Correo verificado correctamente.', user: updatedUser });
    } catch (error) {
        console.error('Error al verificar el correo:', error);
    }
}


module.exports = self;