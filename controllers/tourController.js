const Tour = require('../models/tourModel')

const aliasTopTours = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
    next()
}

const getAllTourse = async (req, res) => {
    try {
        console.log(req.query)

        // Simple Filtering
        // const query = await Tour.find({
        //     duration: 5,
        //     difficulty: 'easy'
        // })
            
        // const query = await Tour.find()
        //     .where('duration')
        //     .equals(5)
        //     .where('difficulty')
        //     .equals('easy')

        // 1A) Filtering
        const queryObj = { ...req.query }
        const excludeFields = ['page', 'sort', 'limit', 'fields']
        excludeFields.forEach(element => delete queryObj[element])
        // console.log(queryObj)
        // console.log(excludeFields)
        
        // 1B) Advanced Filtering
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        // console.log(JSON.parse(queryStr))

        let query = Tour.find(JSON.parse(queryStr))

        // 2) Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ')
            query = query.sort(sortBy)
        }
        else {
            query = query.sort('-createdAt')
        }

        // 3) Field Limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ')
            console.log(fields)
            query = query.select(fields)
        }
        else {
            query = query.select('-__v')
        }

        // 4) Pagination
        const page = req.query.page * 1 || 1
        const limit = req.query.limit * 1 || 100
        const skip = (page - 1) * limit
        query = query.skip(skip).limit(limit)

        if (req.query.page) {
            const numTours = await Tour.countDocuments()
            if (skip >= numTours) {
                throw new Error('This page does not exists')
            }
        }


        const tours = await query

        res.status(200).json({
            status: 'success',
            requestedAt: req.requestTime,
            results: tours.length,
            data: {
                tours
            }
        })
    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

const createTour = async (req, res) => {
    try {
        // const newTour = new Tour({})
        // newTour.save()

        const newTour = await Tour.create(req.body)

        res.status(201).json({
            status: 'success',
            data: {
                newTour
            }
        })
    }
    catch (err) {
        return res.status(400).json({
            status: 'fail',
            message: 'Invalid Data send'
        })
    }
}

const getTour = async (req,res) => {
    try {
        const id = req.params.id
        const tour = await Tour.findById(id)
        // Tour.findOne({ __id: req.params.id })
        
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    }
    catch (err) {
        return res.status(400).json({
            status: 'fail',
            message: 'Invalid Data send'
        })
    }
}

const updateTour = async (req, res) => {
    try {
        const id = req.params.id
        const tour = await Tour.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    }
    catch (err) {
        return res.status(400).json({
            status: 'fail',
            message: 'Invalid Data send'
        })
    }

}

const deleteTour = async (req, res) => {
    try {
        const id = req.params.id
        const tour = await Tour.findByIdAndDelete(id)
        
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    }
    catch (err) {
        return res.status(400).json({
            status: 'fail',
            message: 'Invalid Data send'
        })
    }
}

module.exports = {
    getAllTourse,
    createTour,
    getTour,
    updateTour,
    deleteTour,
    aliasTopTours
}