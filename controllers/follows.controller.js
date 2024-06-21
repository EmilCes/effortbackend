const { user, follow } = require('../models');

let self = {};

// GET: api/follows/:username/following
self.getUserFollowing = async function (req, res) {
    try {
        const { username } = req.params;

        // Buscar el usuario por username
        const userFound = await user.findOne({ where: { username } });

        if (!userFound) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const userId = userFound.userId;

        // Obtener los usuarios seguidos
        const following = await follow.findAll({
            where: { userFollowerId: userId },
            include: [{
                model: user,
                as: 'followed',
                attributes: ['userId', 'username']
            }]
        });

        const followingUsers = following.map(f => f.followed);

        return res.status(200).json(followingUsers);

    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
};

// GET: api/follows/:username/followers
self.getUserFollowers = async function (req, res) {
    try {
        const { username } = req.params;

        // Buscar el usuario por username
        const userFound = await user.findOne({ where: { username } });

        if (!userFound) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const userId = userFound.userId;

        // Obtener los seguidores
        const followers = await follow.findAll({
            where: { userFollowedId: userId },
            include: [{
                model: user,
                as: 'follower',
                attributes: ['userId', 'username']
            }]
        });

        const followerUsers = followers.map(f => f.follower);

        return res.status(200).json(followerUsers);

    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
};

// POST: api/follows
self.addFollower = async function (req, res) {
    try {
        const { followerUsername, followedUsername } = req.body;

        // Buscar usuarios por username
        const follower = await user.findOne({ where: { username: followerUsername } });
        const followed = await user.findOne({ where: { username: followedUsername } });

        if (!follower || !followed) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Crear registro en la tabla follows
        await follow.create({
            userFollowerId: follower.userId,
            userFollowedId: followed.userId
        });

        return res.status(201).json({ message: "Seguidor añadido exitosamente" });

    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
};

// DELETE: api/follows
self.removeFollower = async function (req, res) {
    try {
        const { followerUsername, followedUsername } = req.body;

        // Buscar usuarios por username
        const follower = await user.findOne({ where: { username: followerUsername } });
        const followed = await user.findOne({ where: { username: followedUsername } });

        if (!follower || !followed) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Eliminar registro en la tabla follows
        const result = await follow.destroy({
            where: {
                userFollowerId: follower.userId,
                userFollowedId: followed.userId
            }
        });

        if (result === 0) {
            return res.status(404).json({ message: "Relación no encontrada" });
        }

        return res.status(204).send();

    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
};

module.exports = self;
