const Note = require('./../models/notesModel')
const catchAsync = require('./../utils/catchAsync')

exports.newNote = catchAsync( async(req, res, next) => {
    req.body.user = req.user;
    const newNote = await Note.create(req.body)
    res.status(200).json({
        status: 'success',
        data: newNote
    })
})

exports.getNotes = catchAsync(async(req, res) => {
    let filter = {};
    filter = {user: req.user};
    const notes = await Note.find(filter);
    res.status(200).json({
        status: 'success',
        results: notes.length,
        data: {
            notes
        }
    })
})

exports.editNote = catchAsync(async (req, res, next) => {
    req.body.user = req.user;
    const note = await Note.findByIdAndUpdate(req.params.id, req.body,{
        runValidators: true
    });
    if(!note){
        return res.status(400).json({
            status: 'failed',
            message: `Note with id: ${req.params.id} is not present`
        })
    }
    res.status(200).json({
        status: 'success',
        data: note
    })
})

exports.deleteNote = catchAsync(async (req, res, next) => {
    const note = await Note.findOneAndDelete({_id:req.params.id, user: req.user._id});
    if(!note){
        return res.status(400).json({
            status: 'failed',
            message: `Either this note id: ${req.params.id} is not your or it is not present`
        })
    }
    res.status(200).json({
        status: 'success',
        data: null
    })
})
