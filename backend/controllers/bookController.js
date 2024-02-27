const Book = require(`../models/bookModel`);
const fs = require (`fs`)

exports.createBook= (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get(`host`)}/images/${req.file.filename}`});
    book.save()
        .then(() => res.status(201).json({message: "Livre enregistré !"}))
        .catch(error => res.status(400).json({error}));
    };

exports.modifyBook = (req, res, next) => {
      const bookObject = req.file ? {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    
      delete bookObject._userId;
      Book.findOne({_id: req.params.id})
          .then((book) => {
              if (book.userId != req.auth.userId) {
                  res.status(401).json({ message : 'Not authorized'});
              } else {
                if (req.file){
                    const filename = book.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, (error) => {
                      if (error) {
                        console.log(error);
                      }
                    });
                }
                  Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                  .then(() => res.status(200).json({message : 'Livre modifié!'}))
                  .catch(error => res.status(401).json({ error }));
              }
          })
          .catch((error) => {
              res.status(400).json({ error });
          });
   };

   exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
      .then((book) => {
        if (book.userId != req.auth.userId) {
          res.status(401).json({ message: 'Not authorized' });
        } else {
          const filename = book.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
            Book.deleteOne({ _id: req.params.id })
              .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
              .catch((error) => res.status(400).json({ error }));
          });
        }
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
  };

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
      .then(book => res.status(200).json(book))
      .catch(error => res.status(404).json({ error }));
  };

exports.getAllBooks= (req, res, next) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({error}));
    };

exports.bestRating=  (req, res, next) => {
        Book.find().sort({averageRating: -1}).limit(3)
            .then((books)=>res.status(200).json(books))
            .catch((error)=>res.status(404).json({ error }));};

exports.rating = (req, res) => {
                Book.findOne({ _id: req.params.id })
                    .then(book => {
                        book.ratings.map(rate => {
                            if ( req.auth.userId === rate.userId ) {
                                res.status(400).json({ message: 'Vous avez déjà noté ce livre !' })
                            }
                        })
                        
                        book.ratings.push({
                            'userId': req.auth.userId,
                            'grade': req.body.rating
                        });
                        let sumRating = 0;
            
                        book.ratings.map(rate => sumRating += rate.grade);
                        book.averageRating = Math.round( (sumRating / book.ratings.length)*100)/100;
            
                        Book.updateOne({ _id: req.params.id }, book)
                            .then(() => { res.status(201).json(book) })
                            .catch((error) => { res.status(401).json({ error }) });
                    })
                    .catch((error) => { res.status(401).json({ error}) });
            };