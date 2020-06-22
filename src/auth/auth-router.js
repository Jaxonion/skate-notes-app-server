const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const router = express.Router();
const AuthService = require('./auth-server');
const { JWT_SECRET, JWT_EXPIRY, DATABASE_URL } = require('../config');

const app = express();



router
    .route('/login')
    .post((req, res, next) => {
        const { username, password } = req.body;
        console.log(username, password)
        if(!username || !password) {
            res.status(401).json({
                error: 'missing field'
            })
        }
        AuthService.userExists(
            req.app.get('db'),
            username
        )
            .then(user => {
                if(!user) {
                    return res.status(401).json({
                        error: 'username or password incorrect'
                    })
                }
                const userData = {
                    username: user.username,
                    email: user.email,
                    password: user.password
                }
                console.log('userdata', userData)
                bcrypt.compare(password, user.password, (err, result) => {
                    if(!result) {
                        return res.status(401).json({
                            error: 'incorrect password'
                        })
                    }
                    if ( result ) {
                        jwt.sign(userData, JWT_SECRET, {expiresIn: '30m'}, (err, token) => {
                            if (err) {
                                res.statusMessage = err.message;
                                return res.status(400).end();
                            }
                            return res.status(200).json({
                                token,
                                notes: userData.notes
                            })
                        })
                    }
                })
            })
    })
    .get((req, res, next) => {
        let token = req.headers.sessiontoken;

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                res.statusMessage = "Your session timed out";
                return res.status( 409 ).end();
            }

            return res.status(200).json({
                username: decoded.username
            })
        })
    });

router
    .route('/signup')
    .post((req, res, next) => {
        const { username, email, password } = req.body;
        if(!username || !email || !password) {
            res.status(401).json({
                error: 'missing field'
            })
        }
        const passwordError = AuthService.validatePassword(password)

        if (passwordError) {
            return res.status(400).json({ error: passwordError })
        }
        console.log('psql', DATABASE_URL)
        console.log('username', username, 'email', email, 'password', password)
        AuthService.hasUserWithUserName(
            req.app.get('db'),
            username
        )
            .then(hasUserWithUserName => {
                if(hasUserWithUserName) {
                    return res.status(401).json({
                        error: 'username already being used'
                    })
                }
                AuthService.hasUserWithEmail(
                    req.app.get('db'),
                    email
                )
                    .then(hasUserWithEmail => {
                        if(hasUserWithEmail) {
                            return res.status(401).json({
                                error: 'email already being used'
                            })
                        }
                        return AuthService.hashPassword(password)
                            .then(hashedPassword => {
                                const newUser = {
                                    username,
                                    email,
                                    password: hashedPassword
                                }
                                console.log('newuzer', newUser)
                                return AuthService.createUser(
                                    req.app.get('db'),
                                    newUser
                                )
                                    .then(user => {
                                        res.status(201)
                                            .location(path.posix.join(req.originalUrl))
                                            .json(AuthService.serializeUser(user))
                                    })
                            })
                    })
            })
    });

router
    .route('/save')
    .put((req, res, next) => {
        let token = req.headers.sessiontoken;
        const { username, noteId, leftFoot, rightFoot, note, trick_name } = req.body;
        console.log(trick_name)
        if(!leftFoot || !rightFoot || !noteId) {
            res.status(400).json({
                error: 'Bad request'
            }).end()
        }
        AuthService.getUserId(
            req.app.get('db'),
            username
        )
            .then(userId => {
                const updatedNote = {
                    "id": noteId,
                    "user_id": userId[0].id,
                    "trick_name": trick_name,
                    "leftfootangle": leftFoot.angle,
                    "leftfootupdown": leftFoot.upDown,
                    "leftfootrightleft": leftFoot.rightLeft,
                    "rightfootangle": rightFoot.angle,
                    "rightfootupdown": rightFoot.upDown,
                    "rightfootrightleft": rightFoot.rightLeft,
                    "note": note
                }
                AuthService.updateNote(
                    req.app.get('db'),
                    noteId,
                    updatedNote
                )
                    .then(response => {
                        console.log(response)
                        res.status(200).json({
                            message: 'updated note'
                        })
                    })
            })
    });

router
    .post('/info', (req, res, next) => {
        const { username } = req.body;
        console.log(username)
        if (!username) {
            return res.status(400).json({
                error: 'no credentials'
            })
        }
        AuthService.getUserId(
            req.app.get('db'),
            username
        )
            .then(response => {
                //console.log(response[0].id)
                AuthService.getUserNotes(
                    req.app.get('db'),
                    response[0].id
                )
                    .then(notes => {
                        return res.status(200).json({
                            notes
                        })
                    })
            })

    });

router
    .post('/new', (req, res, next) => {
        const { username, trick_name } = req.body;
        if(!username || !trick_name) {
            return res.status(401).end()
        }
        AuthService.getUserId(
            req.app.get('db'),
            username
        )
            .then(response => {
                AuthService.createNote(
                    req.app.get('db'),
                    response[0].id,
                    trick_name
                )
                    .then(newNote => {
                        return res.status(201).json({
                            newNote
                        })
                    })
            })
    });

router
    .delete('/delete/:id', (req, res, next) => {
        console.log(hey)
        const { selectedNoteId } = req.params.id;
        console.log('id of note to delete is', selectedNoteId)
        AuthService.deleteNote(
            req.app.get('db'),
            selectedNoteId
        )
            .then(deletedNote => {
                return res.status(200).json({
                    message: `note deleted`
                })
            })
    });

module.exports = router;