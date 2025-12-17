import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,      // ensures no duplicate emails
    lowercase: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  emailVerified: {              // ✅ new field
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Optional: remove password when converting to JSON
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
}

export default mongoose.model("User", userSchema);
