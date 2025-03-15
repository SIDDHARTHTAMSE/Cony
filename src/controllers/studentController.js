const { Op } =  require('sequelize');
const Student = require('../models/student');
const { z } = require('zod');

const studentSchema = z.object({
    student_name: z.string().min(1, "Student name is required"),
    gender: z.string().min(1, "Gender is required"),
    roll_no: z.string().min(1, "Roll number is required"),
});

exports.createStudent = async (req, res, next) => {
    try {
        const validatedData = studentSchema.parse(req.body);
        const newStudent = await Student.create(validatedData);

        if (process.env.NODE_ENV === 'Production') {
            const { createdAt, updatedAt, ...studentWithoutTimestamps } = newStudent.toJSON();
            return res.status(201).json({
                student_id: studentWithoutTimestamps.student_id,
                student_name: studentWithoutTimestamps.student_name,
                gender: studentWithoutTimestamps.gender,
                roll_no: studentWithoutTimestamps.roll_no
            });
          }else{
            return res.status(201).json(newStudent);
          }
    } catch (error) {
        if (error instanceof z.ZodError) {
          if (process.env.NODE_ENV === 'Production') {
            return res.status(400).json({ message: error.errors[0].message });
          }else{
            return res.status(400).json({ errors: error.errors });
          }
        }
        next(error); 
      }
};
