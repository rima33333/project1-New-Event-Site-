const express = require("express");
const router = express.Router();
const Event = require('../models/Event');
const { check, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const moment = require('moment');
const fs = require('fs'); // For potential file deletion


moment().format();

// Middleware to check if user is logged in
isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/users/login');
}
////////////////////////////////////////////
router.get('/creat', isAuthenticated, (req, res) => {
    res.render('event/creat', {
      
        errors: req.flash('errors')
    });
});
//////////////////////////////////////
router.get('/edit/:id', isAuthenticated, (req, res) => {
    Event.findOne({ _id: req.params.id }).then(event => {
        res.render('event/edit', {
            event: event,
            eventDate: moment(event.date).format('YYYY-MM-DD'),
            errors: req.flash('errors'),
            message: req.flash('info')
        });
    }).catch(err => {
        console.error(err);
        res.status(500).send("Error retrieving events.");
    });
});
////////////////////////////////////////////


///////////////////////////////////////////////////////
///////// router to home page 


router.get('/:pageNo?', (req, res) => {
    let pageNo =1 
    if( req.params.pageNo){
        pageNo =parseInt(req.params.pageNo)
    }
    if (req.params.pageNo==0){
        pageNo=1

    }
    let q ={
        skip: 5 *(pageNo -1),
        limit:5
    }
    //find totals document 
    let totalDocs =0
    Event.countDocuments({}).then((total) => {
        totalDocs =parseInt(total)
        Event.find({},{},q).then(events => {
            let chunk = [];
            let chunkSize = 3;
            for (let i = 0; i < events.length; i += chunkSize) {
                chunk.push(events.slice(i, i + chunkSize));
            }
            res.render('event/index', {
                chunk: chunk,
                message: req.flash('info'),
                total:parseInt(totalDocs),
                pageNo: pageNo
            });
        }).catch(err => {
            console.error(err);
            res.status(500).send("Error retrieving events.");
        });
    }).catch((err) => {
        console.error(err);
    });
    
   
});

router.get('/event/:id', (req, res) => {
    Event.findOne({ _id: req.params.id }).then(event => {
        res.render('event/show', {
            event: event
        });
    }).catch(err => {
        console.error(err);
        res.status(500).send("Error retrieving events.");
    });
});
///////////////////////////////////////////////////////////////
// Multer configuration for file uploads with validation
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'photo-' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb('Error: Images Only!');
    }
});
///////////////////////////////////////////////////////////////////////////////////// 


router.post('/creat', 
    upload.single('photo'), // Multer middleware should come first
 [// Multer middleware should come first
 
 check('title')
 .isLength({ min: 5 }).withMessage('Title should be more than 5 characters')
 .escape(),

check('description')
 .isLength({ min: 5 }).withMessage('Description should be more than 5 characters')
 .escape(),

check('location')
 .isLength({ min: 3 }).withMessage('Location should be more than 3 characters')
 .escape(),

check('date')
 .isDate().withMessage('Date should be a valid date')


]
   , async (req, res) => {
        console.log(req.body); // For debugging purposes
        const errors = validationResult(req);
    console.log(errors)
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        return res.redirect('/events/creat');  // Return statement added
    }else{
    let newEvent = new Event({
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        location: req.body.location,
        user_id: req.user.id,
        created_at: Date.now(),
        photo: req.file ? req.file.filename : null
    });
    try {
        await newEvent.save();
        req.flash('info', 'The event was created successfully');
        res.redirect('/events');
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
}
});
//////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////
router.post('/update', upload.single('photo'), 
[// Multer middleware should come first
 
    check('title')
        .isLength({ min: 5 }).withMessage('Title should be more than 5 characters')
        .escape(),
    
    check('description')
        .isLength({ min: 5 }).withMessage('Description should be more than 5 characters')
        .escape(),
    
    check('location')
        .isLength({ min: 3 }).withMessage('Location should be more than 3 characters')
        .escape(),
    
    check('date')
        .isDate().withMessage('Date should be a valid date')
 

]
,isAuthenticated, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        return res.redirect('/events/edit/' + req.body.id); 
    }

    let newFields = {
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        date: req.body.date
    };

    if (req.file) {
        // New photo uploaded
        newFields.photo = req.file.filename;

        // If you want to delete the old photo from disk, fetch the event first to get the old filename
        const event = await Event.findById(req.body.id);
        if (event.photo) {
            fs.unlink('./uploads/' + event.photo, (err) => {
                if (err) console.error("Error deleting old photo: ", err);
            });
        }
    }

    let query = { _id: req.body.id };
    try {
        await Event.updateOne(query, newFields);
        req.flash('info', "The event was updated successfully");
        res.redirect('/events');
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});
///////////////// delete event/////////////////////////////////////////
router.delete('/delete/:id', isAuthenticated, async (req, res) => {
    let query = { _id: req.params.id };
    try {
        await Event.deleteOne(query);
        res.status(200).json('deleted');
    } catch (err) {
        res.status(404).json('There was an error. Event was not deleted');
    }
});


module.exports = router;
