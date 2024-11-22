const { z } = require('zod');
const FinishedComponent = require('../models/finishedcomponent');
const Component = require('../models/component');
const FinishedStore = require('../models/finishedStore')

// Define Zod schema for finished component data validation
const finishedComponentSchema = z.object({
  component_id: z.string().min(1, "Component ID is required"),
  manufactured_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, use YYYY-MM-DD"),
  manufactured_quantity: z.string().min(1, "Manufactured quantity must be a positive number"),
});

// Create a new Finished Component
exports.createFinishedComponent = async (req, res, next) => {
  try {
    // Validate request data
    const validation = finishedComponentSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }

    const { component_id, manufactured_date, manufactured_quantity } = req.body;

    // Prepare data for saving
    const dataToSave = {
      component_id: parseInt(component_id, 10),
      manufactured_date,
      manufactured_quantity: parseInt(manufactured_quantity, 10),
    };

    // Check if Component exists
    const componentExists = await Component.findByPk(dataToSave.component_id);
    if (!componentExists) {
      return res.status(404).json({ message: "Component not found" });
    }

    // Create or update the FinishedStore entry
    const finishedStoreEntry = await FinishedStore.findOne({
      where: { component_id: dataToSave.component_id },
    });

    if (finishedStoreEntry) {
      // If the FinishedStore entry exists, update the available_quantity by adding manufactured_quantity
      finishedStoreEntry.available_quantity += dataToSave.manufactured_quantity;
      await finishedStoreEntry.save();
    } else {
      // If no FinishedStore entry exists, create a new one with manufactured_quantity as the available_quantity
      await FinishedStore.create({
        component_id: dataToSave.component_id,
        available_quantity: dataToSave.manufactured_quantity,
      });
    }

    // Create a new FinishedComponent record
    const newFinishedComponent = await FinishedComponent.create(dataToSave);

    res.status(201).json(newFinishedComponent);
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({
      message: "Internal Server Error while creating Finished Component or updating inventory",
      error: error.message,
    });
    next(error);
  }
};

//Get all Finished Components
exports.getAllFinishedComponents = async (req, res, next) => {
  try {
    const finishedComponents = await FinishedComponent.findAll();
    res.status(200).json(finishedComponents);
  } catch (error) {
    next(error);
  }
};

//Get a Finished Component by ID
exports.getFinishedComponentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const finishedComponent = await FinishedComponent.findByPk(id);

    if (!finishedComponent) {
      return res.status(404).json({ message: "Finished Component not found" });
    }

    res.status(200).json(finishedComponent);
  } catch (error) {
    next(error);
  }
};

//Update a Finished Component by ID
exports.updateFinishedComponent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = finishedComponentSchema.parse(req.body);
    
    const [updated] = await FinishedComponent.update(validatedData, { where: { finished_component_id: id } });
    
    if (!updated) {
      return res.status(404).json({ message: "Finished Component not found or nothing to update" });
    }

    const updatedFinishedComponent = await FinishedComponent.findByPk(id);
    res.status(200).json(updatedFinishedComponent);
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

//Delete a Finished Component by ID
exports.deleteFinishedComponent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await FinishedComponent.destroy({ where: { finished_component_id: id } });

    if (!deleted) {
      return res.status(404).json({ message: "Finished Component not found" });
    }

    res.status(200).json({ message: "Finished Component deleted successfully" });
  } catch (error) {
    next(error);
  }
};
