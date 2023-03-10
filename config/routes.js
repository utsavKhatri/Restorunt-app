/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
"POST /admin/login": "AdminController.login",
"POST /admin/signup": "AdminController.signup",
"POST /admin/logout": "AdminController.logout",
"GET /admin/dashboard": "AdminController.home",
"POST /admin/create/restaurant": "RestaurantController.createRestaurant",
"POST /admin/restaurant/add/admin": "RestaurantController.addAdmins",
"POST /admin/restaurant/remove/admin": "RestaurantController.removeAdmins",
"GET /admin/restaurant/dashboard": "RestaurantController.home",

};
