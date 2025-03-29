const express = require('express');
const { authentication } = require('../middlewares/auth');
const {authorize} = require('../middlewares/authorize');
const Enrollment = require('../models/enrollment');
const Course = require('../models/course');

const studentRouter = express.Router();

studentRouter.post('/enroll', authentication, authorize(['student']), async (req, res) => {
    try {
      const { courseId } = req.body;
      const course = await Course.findById(courseId);
  
      if (!course) return res.status(404).json({ message: 'Course not found' });
  
      const existingEnrollment = await Enrollment.findOne({ student: req.user.id, course: courseId }).populate("course");
      if (existingEnrollment) return res.status(400).json({ message: 'Already enrolled in this course' });
  
      let enrollment = await Enrollment.create({ student: req.user.id, course: courseId });
      enrollment = await Enrollment.findById(enrollment._id).populate("student", "name role email").populate("course", "description title");
      res.status(201).json({ message: 'Successfully enrolled', enrollment});
      
    } catch (error) {
      res.status(500).json({ message: `Error : ${error.message}` });
    }
  }
);
studentRouter.post('/unenroll', authentication, authorize(['student']), async (req, res) => {
    try {
      const { courseId } = req.body;
      const enrollment = await Enrollment.findOneAndDelete({ student: req.user.id, course: courseId }).populate("student", "name role email").populate("course", "description title");;
  
      if (!enrollment) return res.status(400).json({ message: 'Not enrolled in this course' });
  
      res.json({ message: 'Successfully unenrolled', enrollment });
  
    } catch (error) {
      res.status(500).json({ message: 'Error unenrolling from course' });
    }
  });

module.exports = studentRouter;
