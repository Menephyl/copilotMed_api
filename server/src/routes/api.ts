import { Router } from 'express';
import multer from 'multer';
import * as consultationController from '../controllers/consultationController';
import path from 'path';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/transcribe', upload.single('audio'), consultationController.transcribe);
router.post('/diagnose', consultationController.diagnose);
router.post('/chat', consultationController.chat);

export default router;
