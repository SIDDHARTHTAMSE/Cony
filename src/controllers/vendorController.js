const { Op } = require('sequelize');
const { z } = require('zod');
const Vendor = require('../models/vendor');

const vendorSchema = z.object({
    vendor_name: z.string().nonempty("Vendor name is required"),
    address: z.string().nonempty("Vendor address should be require"),
    country: z.string().optional(),
    contact_details: z.string()
    .min(10, "Contact details must be at least 10 digits")
    .max(10, "Contact details cannot exceed 15 digits")
    .regex(/^\d+$/, "Contact details must contain only numbers"),
    email_id: z.string().email("Invalid email format").optional(),
});

// Create a new Vendor
exports.createVendor = async (req, res, next) => {
    try {
        const validatedData = vendorSchema.parse(req.body);

        const newVendor = await Vendor.create(validatedData);

        return res.status(201).json(newVendor);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        next(error);
    }
};

// Get all Vendors
exports.getAllVendors = async (req, res, next) => {
    try {
        const vendors = await Vendor.findAll();
        res.status(200).json(vendors);
    } catch (error) {
        next(error);
    }
};

// Get a Vendor by ID
exports.getVendorById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const vendor = await Vendor.findByPk(id);

        if(!vendor) {
            return res.status(404).json({
                message: "Vendor not found"
            });
        }

        return res.status(201).json(vendor);
    } catch (error) {
        next(error);
    }
};

// Update a Vendor by Id
exports.updateVendorById = async (req, res, next) => {
    try{
        const { id } = req.params;
        const validatedData = vendorSchema.parse(req.body);

        const [updated] = await Vendor.update(validatedData, {
            where: {
                vendor_id: id
            }
        });

        if(!updated) {
            return res.status(404).json({
                message: "Vendor not found nothing to update"
            });
        }

        const updatedVendor = await Vendor.findByPk(id);
        res.status(200).json(updatedVendor);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        next(error);
    }
};

// Delete a Vendor by Id
exports.deleteVendor = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deleted = await Vendor.destroy({
            where: { 
                vendor_id: id
            },
        });

        if(!deleted) {
            return res.status(404).json({
                message: "Vendor not found"
            });
        }
        res.status(200).json({
            message: "Vendor deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};
