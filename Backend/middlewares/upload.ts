import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Define storage configuration
const storage = multer.diskStorage({
    destination: (req: Request, file, cb) => {
        const userId = req.params.userId; // Get userId from request params

        if (!userId) {
            return cb(new Error('User ID is required'), '');
        }

        const uploadPath = path.join(__dirname, `../uploads/${userId}`);

        // Ensure the directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req: Request, file, cb) => {
        cb(null, `profile_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

export default upload;
