const express = require(`express`);
const auth = require(`../middleware/auth`);
const router = express.Router();
const multer = require(`../middleware/multer-config`)

const bookCtrl = require(`../controllers/bookController`);

router.post(`/`,auth,multer, bookCtrl.createBook);
router.get(`/`,auth, bookCtrl.getAllBooks);
router.get('/:id',auth, bookCtrl.getOneBook);
router.put('/:id',auth,multer, bookCtrl.modifyBook);
router.delete('/:id',auth, bookCtrl.deleteBook);

module.exports = router;