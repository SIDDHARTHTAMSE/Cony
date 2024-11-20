const { z } = require('zod');
const FinishedComponent = require('../models/finishedcomponent');
const Component = require('../models/component');
const FinishedStore = require('../models/finishedStore')

// Define Zod schema for finished Component validation
const finishedComponentSchema = z.object({
  component_id: z.string().nonempty("Component ID must be a positive integer"),
  manufactured_date: z.string().nonempty("Manufactured date is required")
<<<<<<< HEAD
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, use YYYY-MM-DD"),
  manufactured_quantity: z.number().positive("Manufactured quantity must be greater than 0"),

                      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, use YYYY-MM-DD"),
  manufactured_quantity: z.string().nonempty("Manufactured quantity must be greater than 0"),
>>>>>>> 25f832ef77eb8f6c89eb20adc722326dffd10daf
});

// Create a new Finished Component
exports.createFinishedComponent = async (req, res, next) => {
  const validation = finishedComponentSchema.safeParse(req.body);

  const dataToSave = {
    ...validation,
    component_id: validation?.component_id
      ? parseInt(validation.component_id, 10)
      : null, 
    manufactured_quantity: validation?.manufactured_quantity
      ? parseInt(validation.manufactured_quantity, 10)
      : null, 
  };

  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.errors });
  }

  const { component_id, manufactured_date, manufactured_quantity } = req.body;

  try {
    // Check if Component exists
    const Components = await Component.findByPk(component_id);
    if (!Components) {
      return res.status(404).json({ message: 'Component not found' });
    }

    // Check if entry exists in FinishedStore
    const finishedStoreEntry = await FinishedStore.findOne({ where: { component_id } });

    if (finishedStoreEntry) {
      // Update existing available quantity
      finishedStoreEntry.available_quantity += manufactured_quantity;
      await finishedStoreEntry.save();
    } else {
      // Create a new FinishedStore entry
      await FinishedStore.create({ component_id, available_quantity: manufactured_quantity });
    }

    // Create FinishedComponent record
    const newFinishedComponent = await FinishedComponent.create({
      component_id,
      manufactured_date,
      manufactured_quantity,
    });

    res.status(201).json(newFinishedComponent);

  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error while creating finished Component or updating inventory",
      error: error.message
    });
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

    const dataToSave = {
      ...validatedData,
      component_id: validatedData?.component_id
        ? parseInt(validatedData.component_id, 10)
        : null, 
      manufactured_quantity: validatedData?.manufactured_quantity
        ? parseInt(validatedData.manufactured_quantity, 10)
        : null, 
    };
    
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
