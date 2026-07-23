import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Construction', 'Steel', 'Machinery', 'Electrical', 'Safety', 'Industrial Equipment'],
    },
    manufacturer: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Product image URL is required'],
    },
    price: {
      type: Number,
      default: null, // null = "Request Quote"
    },
    tags: {
      type: [String],
      default: [],
    },
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
    featured: {
      type: Boolean,
      default: false, // true = shows on homepage
    },
    active: {
      type: Boolean,
      default: true, // false = hidden from public
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Prevent model re-compilation on hot-reload in dev
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

export default Product;
