const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const Mutation = {
// signup user
  async signup(parent, args, context, info) {
    const { username, email, password } = args.input;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await context.db.collection("users").insertOne({
      username,
      email,
      password: hashedPassword
    });

    const token = jwt.sign({ userId: user.insertedId }, process.env.APP_SECRET);

    return {
      token,
      user
    };
  },
// add employee
  async addEmployee(parent, args, context, info) {
    const { first_name, last_name, email, gender, salary } = args.input;

    const employee = await context.db.collection("employees").insertOne({
      first_name,
      last_name,
      email,
      gender,
      salary
    });

    return employee;
  },
// update employee
  async updateEmployee(parent, args, context, info) {
    const { id, input } = args;

    const { first_name, last_name, email, gender, salary } = input;

    const employee = await context.db.collection("employees").findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: { first_name, last_name, email, gender, salary } },
      { returnOriginal: false }
    );

    return employee.value;
  },
// delete employee
  async deleteEmployee(parent, args, context, info) {
    const { id } = args;

    const employee = await context.db.collection("employees").findOneAndDelete({
      _id: ObjectId(id)
    });

    return employee.value;
  }
};

const Query = {
// login user
  async login(parent, args, context, info) {
    const { username, password } = args;

    const user = await context.db.collection("users").findOne({ username });
    if (!user) {
      throw new Error("No such user found");
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ userId: user._id }, process.env.APP_SECRET);

    return {
      token,
      user
    };
  },
// get all employees
  async allEmployees(parent, args, context, info) {
    const employees = await context.db
      .collection("employees")
      .find({})
      .toArray();

    return employees;
  },
// get employee by id
  async employee(parent, args, context, info) {
    const { id } = args;

    const employee = await context.db
      .collection("employees")
      .findOne({ _id: ObjectId(id) });

    return employee;
  }
};

module.exports = {
    Query,
    Mutation
};