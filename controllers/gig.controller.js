import Gig from "../models/gig.model.js";
import createError from "../utils/createError.js";

// Create a new gig
export const createGig = async (req, res, next) => {
  if (!req.isSeller) {
    return next(createError(403, "Only sellers can create a gig!"));
  }

  const newGig = new Gig({
    userId: req.userId,
    ...req.body,
  });

  try {
    const savedGig = await newGig.save();
    res.status(201).json(savedGig);
  } catch (err) {
    next(err);
  }
};

// Delete a gig by ID
export const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) {
      return next(createError(404, "Gig not found!"));
    }

    if (gig.userId.toString() !== req.userId) {
      return next(createError(403, "You can delete only your gig!"));
    }

    await Gig.findByIdAndDelete(req.params.id);
    res.status(200).send("Gig has been deleted!");
  } catch (err) {
    next(err);
  }
};

// Get a single gig by ID
export const getGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) {
      return next(createError(404, "Gig not found!"));
    }
    res.status(200).json(gig);
  } catch (err) {
    next(err);
  }
};

// Get all gigs with filters
export const getGigs = async (req, res, next) => {
  const q = req.query;

  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.cat && { cat: q.cat }),
    ...((q.min || q.max) && {
      price: {
        ...(q.min && { $gte: Number(q.min) }),
        ...(q.max && { $lte: Number(q.max) }),
      },
    }),
    ...(q.search && { title: { $regex: q.search, $options: "i" } }),
  };

  const sort = q.sort || "createdAt"; // Default sort

  try {
    const gigs = await Gig.find(filters).sort({ [sort]: -1 });
    res.status(200).json(gigs);
  } catch (err) {
    next(err);
  }
};
