const express = require('express');
const router = express.Router();
const Ninja = require('../models/ninja')

//get a list of ninjas from the database
router.get('/ninjas', function(req, res, next) {
  // Ninja.find({}).then(function(ninjas){
  //   res.send(ninjas)
  // })
  // Ninja.geoNear(
  //         {type: 'Point', coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)]},

  Ninja.aggregate([{
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)]
        },
        distanceField: "dist.calculated",
        maxDistance: 100000,
        spherical: true
      }
    }])
    .then(function(result) {
      res.send(result);
    }).catch(next);

});

//   Ninja.geoNear(
//     {type: 'Point', coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)]},
//     {maxDistance: 100000, spherical: true}
//   ).then(function(ninjas){
//     res.send(ninjas)
//   });
// });

// add a newe ninja to the database
router.post('/ninjas', function(req, res, next) {
  //this does same method as the other
  Ninja.create(req.body).then(function(ninja) {
    res.send(ninja);
  }).catch(next);

});
// update a ninja in the database
router.put('/ninjas/:id', function(req, res, next) {
  Ninja.findByIdAndUpdate({
    _id: req.params.id
  }, req.body).then(function() {
    Ninja.findOne({
      _id: req.params.id
    }).then(function(ninja) {
      res.send(ninja);
    });
  });
});
//delete a ninja from the database
router.delete('/ninjas/:id', function(req, res, next) {
  Ninja.findByIdAndRemove({
    _id: req.params.id
  }).then(function(ninja) {
    res.send(ninja);
    // res.send({type: 'DELETE'});
  });
});


module.exports = router;
