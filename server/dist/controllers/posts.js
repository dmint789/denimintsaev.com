"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var post_1 = __importDefault(require("../models/post"));
var getAllPosts = function (req, res) {
    console.log('Getting all posts');
    post_1["default"].find()
        .exec()
        .then(function (results) {
        return res.status(200).json({
            posts: results
        });
    })["catch"](function (err) {
        return res.status(500).json({
            message: err.message
        });
    });
};
exports["default"] = { getAllPosts: getAllPosts };
//# sourceMappingURL=posts.js.map