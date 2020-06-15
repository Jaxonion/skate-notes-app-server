const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/
const xss = require('xss');
const { JWT_SECRET, JWT_EXPIRY } = require('../config');

const AuthService = {
    validatePassword(password) {
        if (password.length < 8) {
            return 'Password must be longer than 8 character'
        }
        if (password.length > 72) {
            return 'Password must be less than 72 characters'
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password must not start or end with empty spaces'
        }
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return 'Password must contain 1 uper case, lower cass, number and space character'
        }
        return null 
    },
    hasUserWithUserName(knex, username) {
        return knex.select('*')
            .from('users_skate')
            .where({ username })
            .first()
            .then(user => !!user)
    },
    hasUserWithEmail(knex, email) {
        return knex.select('*')
            .from('users_skate')
            .where({ email })
            .first()
            .then(user => !!user)
    },
    userExists(knex, username) {
        return knex.select('*')
            .from('users_skate')
            .where({ username })
            .first()
            .then(user => user)
    },
    hashPassword(password) {
        return bcrypt.hash(password, 12)
    },
    serializeUser(user) {
        return {
            username: xss(user.username),
            email: xss(user.email),
            password: user.password
        }
    },
    createUser(knex, user) {
        return knex('users_skate')
            .insert(user)
            .returning('*')
            .then(([user]) => user)
    },
    createJwt(subject, payload) {
        return jwt.sign(payload, JWT_SECRET, {
            subject,
            expiresIn: JWT_EXPIRY,
            algorithm: 'HS256',
        })
    },
    getUserId(knex, username) {
        return knex('users_skate')
            .select('id')
            .where({ username })
    },
    getUserNotes(knex, user_id) {
        return knex('notes')
            .select('*')
            .where({ user_id })
    },
    createNote(knex, user_id, trick_name) {
        note = {
            "user_id": user_id,
            "trick_name": trick_name,
            "leftfootangle": "90",
            "leftfootupdown": "0",
            "leftfootrightleft": "0",
            "rightfootangle": "90",
            "rightfootupdown": "0",
            "rightfootrightleft": "0",
            "note": ""
        }
        return knex('notes')
            .insert(note)
            .returning('*')
            .then(([note]) => note)
    },
    updateNote(knex, noteId, note) {
        const { leftfootangle, leftfootupdown, leftfootrightleft, rightfootangle, rightfootupdown, rightfootrightleft, trick_name } = note;
        console.log('isthisright', leftfootangle, rightfootangle)
        console.log(noteId)
        console.log(trick_name)
        return knex('notes')
            .where('id', noteId)
            .update({
                "trick_name": trick_name,
                "leftfootangle": leftfootangle,
                "leftfootupdown": leftfootupdown,
                "leftfootrightleft": leftfootrightleft,
                "rightfootangle": rightfootangle,
                "rightfootupdown": rightfootupdown,
                "rightfootrightleft": rightfootrightleft,
                "note": note.note
            })
    },
    deleteNote(knex, noteId) {
        return knex('notes')
            .where('id', noteId)
            .del()
    }
}

module.exports = AuthService;