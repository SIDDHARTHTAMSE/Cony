const Component = require('../models/component');
const { z } = require('zod');

// Zod schema for Component validation
const ComponentSchema = z.object({
  category_id: z.number().min(1, "Category ID must be greater than 0").optional(),
  component_name: z.string().nonempty("Component name is required"),
});

//Create a new Component
exports.createComponent = async (req, res, next) => {
  try {
    // console.log("Getting request", req.body);

    const validatedData = ComponentSchema.parse(req.body);

    // Check if the component_name already exists
    const existingComponent = await Component.findOne({
      where: { component_name: validatedData.component_name },
    });

    console.log("existing data is", existingComponent)

    if (existingComponent) {
      res.status(409).json({ message: "Component name already exists." });
      // console.log("error message to client")
    }else{
      const newComponent = await Component.create(validatedData);
      res.status(201).json(newComponent);
      // console.log(newComponent)
    }

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


//Get all Components
exports.getAllComponents = async (req, res, next) => {
  try {
    const Components = await Component.findAll();
    res.status(200).json(Components);
  } catch (error) {
    next(error);
  }
};

//Get a Component by ID
exports.getComponentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const Components = await Component.findByPk(id);

    if (!Components) {
      return res.status(404).json({ message: "Component not found" });
    }

    res.status(200).json(Components);
  } catch (error) {
    next(error);
  }
};

//Update a Component by ID
exports.updateComponent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = ComponentSchema.parse(req.body);
    
    const [updated] = await Component.update(validatedData, { where: { component_id: id } });
    
    if (!updated) {
      return res.status(404).json({ message: "Component not found or nothing to update" });
    }

    const updatedComponent = await Component.findByPk(id);
    res.status(200).json(updatedComponent);
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

//Delete a Component by ID
exports.deleteComponent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Component.destroy({ where: { component_id: id } });

    if (!deleted) {
      return res.status(404).json({ message: "Component not found" });
    }

    res.status(200).json({ message: "Component deleted successfully" });
  } catch (error) {
    next(error);
  }
};
