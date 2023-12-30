const asycnHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const EMAIL_TOKEN_EXPIRATION_MINIUTES = 10;

//@desc Generate a db email token and send an email containing the token to the client
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

// helper function for generating a db email token (string)
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
    // verify that stateful token is valid, delete if not
    // generate JWT (use helper function)
    // delete email token after generating JWT
    res.json({ message: "request received! "});
});

module.exports = {
    generateDbEmailToken,
    generateUniqueEmailToken,
    loginUser,
    obtainJWT
}

