const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Notes');
const router = express.Router();
const { body, validationResult } = require("express-validator");

router.get('/getallnotes', fetchuser, async (req,res)=>{
    try{
        const notes = await Note.find({id : req.user.id});
        res.send(notes);
    }catch (error) {
        res.status(500).json({
          error: error,
          message: "Internal Server Error",
        });
      }
});

router.post(
    "/addnote", fetchuser, 
    body("title", "Enter a valid title").isLength({min: 3}),
    body("description", "Description must be at least 5 characters length").isLength({min: 5}),
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const { title, description, tag } = req.body;
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedData = await note.save();
        res.json(savedData);
      } catch (error) {
        res.status(500).json({
          error: error,
          message: "Internal Server Error",
        });
      }
    }
  );

router.put(
    "/updatenote/:id", fetchuser, 
    async (req, res) => {
      try {
        const { title, description, tag } = req.body;
        let newNote = {};
        if(title) { newNote.title = title };
        if(description) { newNote.description = description };
        if(tag) { newNote.tag = tag };
        
        let note = await Note.findById(req.params.id);
        if(!note) {return res.status(404).send("Not Found")};
        if(note.user.toString() !== req.user.id){
          return res.status(401).send("Not allowed");
        }
        note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});
        res.json(note);
      } catch (error) {
        res.status(500).json({
          error: error,
          message: "Internal Server Error",
        });
      }
    }
  );
router.delete(
    "/deletenote/:id", fetchuser, 
    async (req, res) => {
      try {        
        let note = await Note.findById(req.params.id);
        if(!note) {return res.status(404).send("Not Found")};
        if(note.user.toString() !== req.user.id){
          return res.status(401).send("Not allowed");
        }
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({"message": "Note deleted successfully", note});
      } catch (error) {
        res.status(500).json({
          error: error,
          message: "Internal Server Error",
        });
      }
    }
  );

module.exports = router;