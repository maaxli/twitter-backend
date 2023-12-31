const asycnHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const EMAIL_TOKEN_EXPIRATION_MINIUTES = 30;
const JWT_EXPIRATION_HOURS = 12;

/* Generate a db email token and send an email containing the token to the client
 *
 * @param email The email of the client
 * @param emailTokenString The string email token
 */
async function generateDbEmailToken(email, emailTokenString) {
    const expiration = new Date(new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINIUTES * 60 * 1000);
    try {
        await prisma.token.create({
            data: {
                type: "EMAIL",
                emailToken: emailTokenString,
                expiration: expiration,
                user: {
                    connect: {
                        email: email
                    }
                }
            }
        });
        // TODO: send email token to user's email using SendGrid
    } catch (e) {
        throw new Error(e);
    }
}

/* Helper function for generating a db email token
 *
 * @return A unique (not currently in use) email token
 */
async function generateUniqueEmailToken() {
    let emailTokenString = "";
    let dbToken = null;
    do {
        emailTokenString = Math.floor(10000000 + Math.random() * 90000000).toString();
        dbToken = await prisma.token.findUnique({
            where: { emailToken: emailTokenString }
        });
    } while (dbToken !== null);
    return emailTokenString;
}

/* Helper function for generating a JWT
 * 
 * @param tokenId The ID of the corresponding token in the db
 * @return JWT
 */
function generateJWT(tokenId) {
    return jwt.sign(
        { tokenId },
        process.env.JWT_SECRET,
        {
            algorithm: "HS256",
            expiresIn: "12h"
        }
    );
}

//@desc log in a user
//@route /auth/login
//@access public
const loginUser = asycnHandler(async (req, res, err) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ error: "All fields required." });
    }

    // Create new account if one does not already exist
    const user = await prisma.user.findUnique({
        where: { email: email }
    });
    if (user === null) {
        // redirect to a page to create a new user, current request/response cycle ends
        res.status(303).json({ message: "Redirecting to create new account" });
        return;
    }

    // Generate stateful email token, in scenario that an account already exists
    try {
        const uniqueEmailToken = await generateUniqueEmailToken();
        await generateDbEmailToken(email, uniqueEmailToken);
        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Unable to log in or create new user" });
    }
});

//@desc authenticate a user's email token
//@route /auth/authenticate
//@access public
const obtainJWT = asycnHandler(async (req, res, err) => {

    // Extract information from client request
    const { email, emailToken } = req.body;
    if (!email || !emailToken) {
        res.status(400).json({ error: "Missing fields" });
    }
    const dbEmailToken = await prisma.token.findUnique({
        where: { emailToken: emailToken },
        include: { user: true }
    });

    // Token validation
    if (!dbEmailToken) {
        res.sendStatus(401);
        return;
    }
    if (dbEmailToken.user.email !== email) {
        res.sendStatus(401);
        return;
    }
    if (dbEmailToken.expiration < new Date()) {
        await prisma.token.delete({
            where: { emailToken: emailToken }
        })
        res.sendStatus(401);
        return;
    }

    // Deleting used email token
    await prisma.token.delete({
        where: { emailToken: emailToken }
    });
    
    // Storing a corresponding db token for the JWT
    const expiration = new Date(new Date().getTime() + JWT_EXPIRATION_HOURS * 60 * 60 * 1000);
    const dbJwtToken = await prisma.token.create({
        data: {
            type: "JWT",
            expiration: expiration,
            user: {
                connect: { id: dbEmailToken.user.id }
            }
        }
    });

    // Generate JWT (TODO ideally stored in cookies)
    const jwtToken = generateJWT(dbJwtToken.id);
    res.json(jwtToken);
});

module.exports = {
    generateDbEmailToken,
    generateUniqueEmailToken,
    loginUser,
    obtainJWT
}

