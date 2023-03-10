/**
 * AdminController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const bcrypt = require("bcrypt");
const superAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash("superadmin123", 10);
    const admindata = {
      name: "superadmin",
      email: "superadmin@superadmin.com",
      password: hashedPassword,
      role: "super_admin",
    };
    const isSuperAdmin = await Admin.findOne({
      email: "superadmin@superadmin.com",
    });
    if (!isSuperAdmin) {
      const superAdminData = await Admin.create(admindata).fetch();
      return console.log("SuperAdmin id: ", superAdminData.id);
    }
    return console.log({
      message: `Super Admin already exists,  SuperAdmin id: ${isSuperAdmin.id}`,
    });
  } catch (error) {
    return console.log(error);
  }
};
superAdmin();

module.exports = {
  signup: async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
      const isAdminExist = await Admin.findOne({
        email: email,
      });
      if (!isAdminExist) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const createAdmin = await Admin.create({
          name,
          email,
          password: hashedPassword,
          role,
        }).fetch();
        return res.status(200).json({
          message: "Admin created successfully",
          data: createAdmin,
        });
      }
      return res.status(400).json({
        message: "Admin already exists",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error.message,
      });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const isAdminExist = await Admin.findOne({ email: email });
      if (!isAdminExist) {
        return res.status(400).json({ message: "Admin does not exist" });
      }

      if (
        email === "superadmin@superadmin.com" &&
        password === "superadmin123"
      ) {
        const superAdminData = await Admin.findOne({
          email: "superadmin@superadmin.com",
        });
        const passwordMatches = await bcrypt.compare(
          password,
          superAdminData.password
        );
        if (!passwordMatches) {
          return res.status(400).json({ message: "Invalid Password" });
        }
        const token = await sails.helpers.superAdminJwt(
          superAdminData.id,
          superAdminData.role
        );
        superAdminData.token = token;
        return res.json({
          message: "superAdmin logging successfully",
          superAdminData: superAdminData,
          token: token,
        });
      }

      const adminPasswordMatches = await bcrypt.compare(
        password,
        isAdminExist.password
      );
      if (!adminPasswordMatches) {
        return res.status(400).json({ message: "Invalid Password" });
      }

      const token = await sails.helpers.adminJwt(
        isAdminExist.id,
        isAdminExist.role
      );
      isAdminExist.token = token;
      return res.json({
        message: `Admin logging successfully`,
        data: isAdminExist,
      });
    } catch (error) {
      console.log(error);
      return res.serverError(error);
    }
  },

  logout: async (req, res) => {
    try {
      console.log(req.headers["authorization"], " <---------");
      req.headers["authorization"] = null;
      console.log("---------> ", req.headers["authorization"]);
      return res.json({ message: `logout successfully` });
    } catch (error) {
      console.log(error);
      return res.serverError(error);
    }
  },
  home: async (req, res) => {
    try {
      if (req.admin.adminRole !== "super_admin") {
        return res.json({ message: "you not have access to this page" });
      }
      const data = await Restaurant.find().populate("owner").populate("admins");
      return res.json({
        message: `welcome ${req.admin.adminRole} to dashboard`,
        data,
      });
    } catch (error) {
      console.log(error);
      return res.serverError(error);
    }
  },
};
