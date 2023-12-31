const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "SECRET TOKEN";

const validateToken = asyncHandler(async(req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.sendStatus(401);
        return;
    }
    const jwtToken = authHeader.split(" ")[1];
    if (!jwtToken) {
        res.sendStatus(401);
        return;
    }

    // Verify the JWT
    await jwt.verify(jwtToken, JWT_SECRET, async (err, decoded) => {
        if (err) {
            console.log(err);
            res.sendStatus(401);
            return;
        }
        try {
            // Verify against db JWT
            const dbJwtToken = await prisma.token.findUnique({
                where: { id: decoded.tokenId },
                include: { user: true }
            });
            if (!dbJwtToken || dbJwtToken.expiration < new Date()) {
                res.sendStatus(401);
                return;
            }
            req.user = dbJwtToken.user;
            next();
        } catch (e) {
            res.sendStatus(401);
        }
    });
});

module.exports = validateToken;