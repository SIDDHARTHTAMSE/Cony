const Component = require('../models/component');
const { z } = require('zod');

const ComponentsArraySchema = z.array (
  z.object({
    category_id: z.string().min(1, "Category ID must be greater than 0").optional(),
    component_name: z.string().nonempty("Component name is required"),
  })
);

//Create a new Component
exports.createComponent = async (req, res, next) => {
  try {
    const validatedDataArray = ComponentsArraySchema.parse(req.body);

    const savedComponents = [];

    for (const validatedData of validatedDataArray) {
      const dataToSave = {
        ...validatedData,
        category_id: validatedData?.category_id
          ? parseInt(validatedData?.category_id, 10)
          : null, 
      };

    const existingComponent = await Component.findOne({
      where: { component_name: validatedData.component_name },
    });

    if (existingComponent) {
      return res.status(409).json({
        message: `Component with name '${validatedData.component_name}' already exists.`,
      });
    }

    const newComponent = await Component.create(dataToSave);
    savedComponents.push(newComponent);
    }

    res.status(201).json({
      components: savedComponents,
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


//Get all Components
exports.getAllComponents = async (req, res, next) => {
  try {
    const Components = await Component.findAll();
    const updatedComponents = Components.map((component) => {
      const plainComponent = component.toJSON();
      const { category_id, ...rest } = plainComponent;
      return {
        ...rest,
        categoryId: category_id,
      };
    });

    console.log(updatedComponents);
    res.status(200).json(updatedComponents);
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

// Get a component by name
exports.getComponentsByName = async (req, res, next) => {
  try{
    const { component_name } = req.body;

    if (!component_name){
      return res.status(404).json( {message: "Component Name required"} );
    }

    const existingComponent = await Component.findOne({
      where: { component_name },
    });

    if(! existingComponent ) {
      return res.status(404).json({ message: "Component Name is not found"});
    }

    if(process.env.NODE_ENV === 'Production') {
      const { createdAt, updatedAt, ...categoryData} = existingComponent.get();
      return res.status(200).json(categoryData);
    } else {
      return res.status(200).json(existingComponent);
    }
  } catch (error){
    next(error);
  }
};

//Update a Component by ID
exports.updateComponent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = ComponentSchema.parse(req.body);

    const dataToSave = {
      ...validatedData,
      category_id: validatedData?.category_id
        ? parseInt(validatedData?.category_id, 10)
        : null, 
    };
    
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
