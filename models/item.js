const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB: ", error.message);
  });

const itemSchema = new mongoose.Schema({
    latin: {
        type: String,
        minLength: 6,
        required: true
    },
    common: {
        type: [String],
        required: true
    }
});

// Format object returned by Mongoose by
// modifying toJSON method of schema
itemSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    // transform _id (object) to id (string)
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    // don't need mongo versioning field at frontend
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Item', itemSchema)