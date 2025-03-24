import express from 'express';
import { getCountries, getRoles } from '../controllers/commonController';
import upload from '../middlewares/upload';
import { register, login, forceLogoutAdmin, getRolesAndCountries, viewSessions, uploadProfilePicture } from '../controllers/authController';
const router = express.Router();

router.get('/roles', getRoles);
router.get('/countries', getCountries);
router.post('/register', register);
router.post('/login', login);
router.get('/sessions', viewSessions);
router.post('/logout', forceLogoutAdmin);
router.get('/roles-countries', getRolesAndCountries);
router.post('/upload/:userId', upload.single('profilePic'), uploadProfilePicture);

export default router;
