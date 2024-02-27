const express = require(`express`);
const router = express.Router();

const auth = require(`../middleware/auth`);
const imageUpload = require(`../middleware/imageUpload`)

const bookCtrl = require(`../controllers/bookController`);

router.post(`/`,auth,imageUpload,imageUpload.resizeImage, bookCtrl.createBook);
router.post(`/:id/rating`,auth, bookCtrl.rating);
router.get(`/`,bookCtrl.getAllBooks);
router.get('/bestrating', bookCtrl.bestRating);
router.get('/:id', bookCtrl.getOneBook);
router.put('/:id',auth,imageUpload, imageUpload.resizeImage, bookCtrl.modifyBook);
router.delete('/:id',auth, bookCtrl.deleteBook);

module.exports = router;