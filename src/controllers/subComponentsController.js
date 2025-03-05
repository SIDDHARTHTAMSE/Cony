const { Op } = require('sequelize');
const Components = require('../models/component');
const SubComponents = require('../models/subComponents');
const { z } = require('zod');

const SubComponentsArraySchema = z.array (
    z.object({
        component_id: z.string().min(1, "Component ID must be greater than 0").optional(),
        subcomponents_name: z.string().nonempty(" SubComponent  name is required "),
    })
);

//Create a new SubComponents
exports.createSubComponents = async(req, res, next) => {
    try{
        const validatedDataArray = SubComponentsArraySchema.parse(req.body);

        const savedSubComponents = [];

        for( const validatedData of validatedDataArray){
            const dataToSave = {
                ...validatedData, 
                component_id: validatedData?.component_id
                    ? parseInt(validatedData?.component_id, 10)
                    : null,
            };

            const existingComponent_id = await Components.findOne({
                where: {
                    component_id: validatedData.component_id
                },
            });

            if(!existingComponent_id){
                return  res.status(409).json({ message:" Component_id not found "});
            }

            const existingSubComponentsName = await SubComponents.findOne({
                where: {
                    subcomponents_name: validatedData.subcomponents_name
                },
            });

            if(existingSubComponentsName) {
                return res.status(409).json({
                    message: `SubComponents with name '${validatedData.subcomponents_name}' already exists.`,
                });
            }
            
            const newSubComponents = await SubComponents.create(dataToSave);
            savedSubComponents.push(newSubComponents);
        }

        res.status(201).json({
            subComponents: savedSubComponents.map(subComponent => ({
                subcomponents_id: subComponent.subcomponents_id,
                component_id: subComponent.component_id,
                subcomponents_name: subComponent.subcomponents_name
            }))
        });        
    } catch (error) {
        if (error instanceof z.ZodError) {
          if (process.env.NODE_ENV === 'Production') {
            return res.status(400).json({ message: error.errors[0].message });
          } else {
            return res.status(400).json({ errors: error.errors });
          }
        }
        next(error);
      }
};

//Get all Sub Components
exports.getAllSubComponents = async (req, res, next ) => {
    try{
        const SubComponent = await SubComponents.findAll();
        const updatedSubComponents = SubComponent.map((subComponents) => {
            const plainSubComponent = subComponents.toJSON();
            const { component_id, ...rest } = plainSubComponent;
            return {
                ...rest,
                component_id: component_id,
            };
        });

        res.status(200).json(updatedSubComponents);
    } catch (error) {
        next(error);
    }
};

// Get a Sub Component by ID
exports.getSubComponentsId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const SubComponent = await  SubComponents.findByPk(id);

        if(!SubComponent){
            return res.status(404).json({ message: "SubComponent not found" });
        }

        res.status(200).json(SubComponent);
    } catch (error) {
        next(error);
    }
};

// Get a Sub Component by name
exports.getSubComponentsByName = async (req, res, next) => {
    try {
        const {  subcomponents_name } = req.body; 

        if( !subcomponents_name ){
            return res.status(404).json({ message: "SubComponents name required"});
        }

        const existingSubComponent = await SubComponents.findOne({
            where: {
                subcomponents_name
            },
        });

        if(!existingSubComponent){
            return res.status(404).json({ message: "SubComponent name not found"});
        }
        
        if(process.env.NODE_ENV === 'Production') {
            const { createdAt, updatedAt, ...categoryData} = existingSubComponent.get();
            return res.status(200).json(categoryData);
          } else {
            return res.status(200).json(existingSubComponent);
          }
    } catch (error){
        next(error);
    }
};

//Update a Sub Component by ID
exports.updateSubComponents = async(req, res, next) => {
    try {
        const { id } = req.params;
        const validatedDataArray = SubComponentsArraySchema.parse(req.body);

        const existingSubComponent = await SubComponents.findByPk(id);
        if(!existingSubComponent){
            return res.status(404).json({ message: "SubComponent id is not found"});
        }

        const updatedSubComponents = [];

        for(const validatedData of validatedDataArray) {
            const dataToSave = {
                ...validatedData,
                component_id: validatedData?.component_id
                    ? parseInt(validatedData?.component_id, 10)
                    : null,
            };

            const existingComponent_id = await Components.findOne({
                where: { 
                    component_id: validatedData.component_id 
                },
            });

            if(!existingComponent_id){
                return res.status(404).json({ message: "Component_id not found"})
            }

            await SubComponents.update(dataToSave, { where: { subcomponents_id: id } });


            const updated = await SubComponents.findByPk(id);
            updatedSubComponents.push(updated)
        }

            res.status(200).json({
                updatedSubComponent: updatedSubComponents.map(subComponents => ({
                    subcomponents_id: subComponents.subcomponents_id,
                    component_id: subComponents.component_id,
                    subcomponents_name: subComponents.subcomponents_name
                }))
            });
    } catch (error) {
        if (error instanceof z.ZodError){
            if (process.env.NODE_ENV === 'Production') {
                return res.status(400).json({ message: error.errors[0].message });
            } else{
                return res.status(400).json({ errors: error.errors });
            }
        }
        next(error);
    }
};

// Permanent Delete a Sub Component by ID
exports.deleteSubComponent = async(req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await SubComponents.destroy({ where: { subcomponents_id: id } });

        if(!deleted){
            return res.status(404).json({ message: "SubComponents not found"});
        }

        res.status(200).json({ message: "SubComponent deleted successfully"});
    } catch (error) {
        next(error);
    }
};

// Soft Delete a SubComponent by ID
exports.softDeleteSubComponents = async(req, res, next) => {
    try{
        const { id } = req.params;

        const existingSubComponent = await SubComponents.findOne({ where: { subcomponents_id: id } });

        if(!existingSubComponent){
            return res.status(404).json({ message: "SubComponent not found"});
        }

        const createdAt = new Date();
        await existingSubComponent.update({ is_deleted: true, deleted_at: createdAt });

        res.status(200).json({
            deleted_at: existingSubComponent.deleted_at,
            is_deleted: existingSubComponent.is_deleted
        });
    } catch(error){
        next(error);
    }
};

//Restore Soft Delete Sub Component by ID
exports.restoreSubComponent = async(req, res, next) => {
    try {
        const { id } = req.params;

        const existingSubComponent = await SubComponents.findOne({
            where: {
                subcomponents_id: id,
                deleted_at: { [Op.ne]: null },
                is_deleted: true
            },
        });

        if(!existingSubComponent){
            return res.status(404).json({ message: " SubComponent not found or not deleted"});
        }

        existingSubComponent.is_deleted = false;
        existingSubComponent.deleted_at = null,
        await existingSubComponent.save();

        res.status(200).json({ message: "SubComponent restored successfully"});
    } catch (error){
        next(error);
    }
};
