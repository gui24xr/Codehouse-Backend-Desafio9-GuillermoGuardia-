import express from 'express'
import { UsersController } from '../controllers/users-controller.js'
import passport from 'passport'


export const router = express.Router()
const usersController = new UsersController


router.post('/api/sessions/registrarse',usersController.createUser)
router.post('/api/sessions/login',usersController.authenticateUser)
router.post('/api/sessions/logout', usersController.clearTokenSession)


