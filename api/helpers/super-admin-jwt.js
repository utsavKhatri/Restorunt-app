const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();
module.exports = {


  friendlyName: 'Super admin jwt',


  description: '',


  inputs: {
    id: {
      type: "ref",
      description: "The user object to create a token for.",
      required: true,
    },
    adminRole: {
      type: "ref",
      description: "The admin object to create a token for.",
      required: true,
    },
  },

  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs, exits) {
    const user = inputs.id;
    const adminRole = inputs.adminRole;
    const token = jwt.sign({ id: user, adminRole: adminRole }, process.env.SECRET, {
      expiresIn: "2h",
    });
    return exits.success(token);
  },


};

