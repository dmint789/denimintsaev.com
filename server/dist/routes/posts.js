"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var posts_1 = __importDefault(require("../controllers/posts"));
var PostsRouter = express_1["default"].Router();
// GET .../posts
PostsRouter.get('/', posts_1["default"].getAllPosts);
exports["default"] = PostsRouter;
//# sourceMappingURL=posts.js.map