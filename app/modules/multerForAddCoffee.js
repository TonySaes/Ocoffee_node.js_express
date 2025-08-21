import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Dossier d'uploads local 
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(__dirname, "../../public/images/coffees");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = String(req.body.reference).trim().toLowerCase();
    cb(null, base + ext);
  }
});

// Filtre : accepter seulement des images
function fileFilter(req, file, cb) {
  if (/^image\/(png|jpeg|jpg|webp|gif)$/.test(file.mimetype)) cb(null, true);
  else cb(new Error("Format d'image non supporté"), false);
}

const upload = multer({ storage, fileFilter });

export default upload;
