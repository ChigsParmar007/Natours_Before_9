const express = require('express')
const { getAllTourse, getTour, createTour, updateTour, deleteTour, aliasTopTours } = require('../controllers/tourController')
const router = express.Router()

// router.param('id', checkID)

// app.get('/api/v1/tours', getAllTourse)
// app.post('/api/v1/tours', createTour)
// app.get('/api/v1/tours/:id', getTour)
// app.patch('/api/v1/tours/:id', updateTour)
// app.delete('/api/v1/tours/:id', deleteTour)

router
    .route('/top-5-cheap')
    .get(aliasTopTours, getAllTourse)   

router
    .route('')
    .get(getAllTourse)
    .post(createTour)

router
    .route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour)

module.exports = router