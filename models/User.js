const mongoose = require("mongoose");
const bcyrpt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, minlength: 5, required: true },
    isAdmin : {type : Boolean, default : false},
    category :{type : String, required :true},
    token: { type: String },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (this.category && this.category === "manager"){
        this.isAdmin = true
    }
  if (this.password && this.isModified("password")) {
    this.password = await bcyrpt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.verifyPassword = async function (password) {
  try {
    var result = await bcyrpt.compare(password, this.password);
    return result;
  } catch (error) {
    return error;
  }
};

userSchema.methods.signToken = async function () {
  console.log(this);
  const payload= { userId: this.id, email: this.email, isAdmin: this.isAdmin};
  try {
    const token = jwt.sign(payload, "secret");
    return token;
  } catch (error) {
    return error;
  }
};

userSchema.methods.userJSON = function (token) {
  return {
    name: this.name,
    email: this.email,
    token: token,
    isAdmin : this.isAdmin,
  };
};

module.exports = mongoose.model("User", userSchema);
