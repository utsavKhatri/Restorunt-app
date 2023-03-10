/**
 * RestaurantController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const bcrypt = require("bcrypt");
module.exports = {
  home:async (req, res) => {
    try {
      if (req.admin.adminRole !== "restaurant_admin") {
        return res.json({ message: "you not have access to this page" });
      }
      const data = await Admin.find({id:req.admin.id}).populate("restaurants");
      return res.json({
        message: `welcome ${req.admin.adminRole} to restaurant dashboard`,
        data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error.message,
      });
    }
  },
  createRestaurant: async (req, res) => {
    const { name, address, adminName, adminEmail, password } = req.body;
    const owner = req.admin.id;
    try {
      const isAdminExist = await Admin.findOne({
        email: adminEmail,
      });
      if (!isAdminExist) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const createAdmin = await Admin.create({
          name: adminName,
          email: adminEmail,
          password: hashedPassword,
          role: "restaurant_admin",
        }).fetch();
        const newRestaurant = await Restaurant.create({
          name,
          address,
          owner,
          admins: createAdmin.id,
        }).fetch();
        return res.status(201).json({
          message: "restaurant & admin created successfully",
          restaurantdata: newRestaurant,
          admindata: createAdmin,
        });
      }
      res.status(400).json({
        message: "Admin already exists",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error.message,
      });
    }
  },
  addAdmins: async (req, res) => {
    const { restaurantId, admins } = req.body;
    console.log(req.body);
    try {
      if (req.admin.adminRole !== "restaurant_admin") {
        return res.status(400).json({
          message: "Only restaurant_admin can add admins",
        });
      }

      const isRestaurant = await Restaurant.findOne(restaurantId).populate(
        "admins",
        { id: admins }
      );
      console.log(isRestaurant);
      if (!isRestaurant) {
        return res.status(400).json({
          message: "Restaurant does not exist",
        });
      }
      if (isRestaurant.admins.includes(req.admin.id)) {
        return res.status(400).json({
          message: "Admin already exists",
        });
      }
      await Restaurant.addToCollection(restaurantId, "admins", admins);
await Admin.addToCollection(admins, "restaurants", restaurantId);
      return res.status(200).json({ message: "admins added successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error.message,
      });
    }
  },
  removeadmins: async (req, res) => {
    const { restaurantId, admins } = req.body;
    console.log(req.body);
    try {
      if (req.admin.adminRole !== "restaurant_admin") {
        return res.status(400).json({
          message: "Only restaurant_admin can remove admins",
        });
      }

      const isRestaurant = await Restaurant.findOne(restaurantId).populate(
        "admins",
        { id: admins }
      );
      console.log(isRestaurant);
      if (!isRestaurant) {
        return res.status(400).json({
          message: "Restaurant does not exist",
        });
      }
      if (isRestaurant.admins.length > 0) {
        await Restaurant.removeFromCollection(restaurantId, "admins", admins);
        await Admin.removeFromCollection(admins, "restaurants", restaurantId);
        return res.status(200).json({ message: "admins removed successfully" });
      }
      return res.status(400).json({
        message: "Restaurant does not have any admins",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error.message,
      });
    }
  },
};
