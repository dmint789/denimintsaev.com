"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var cors_1 = __importDefault(require("cors"));
var posts_1 = __importDefault(require("./routes/posts"));
var other_1 = require("./routes/other");
var random_1 = __importDefault(require("./models/random"));
var app = (0, express_1["default"])();
// Middleware
app.use((0, cors_1["default"])());
app.use(express_1["default"].json()); // Handles json data
app.use(express_1["default"].urlencoded({ extended: true })); // Handles url encoded data
// Static files (path is relative to the directory from which the node process is launched)
app.use('/api', express_1["default"].static('public'));
// Routes
app.get('/api/get_collective_clicks', other_1.getCollectiveClicks);
app.post('/api/increment_counter', other_1.incrementButtonClicks);
app.use('/api/posts', posts_1["default"]);
// Database
var dbURI = process.env.MONGODB_URI || 'mongodb://mongoadmindev:mongoadmindev123@localhost:27017/admin';
var options = {
    dbName: 'denimintsaev',
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true,
    socketTimeoutMS: 30000,
    serverSelectionTimeoutMS: 40000
};
mongoose_1["default"]
    .connect(dbURI, options)
    .then(function () { return console.log('Connected to the DB'); })["catch"](function (err) { return console.log(err); });
// DB initialization
random_1["default"].find()
    .then(function (results) {
    if (results.length === 0) {
        console.log('There are no results, initializing DB');
        random_1["default"].create({}, function (err) { return console.log(err); });
    }
    else {
        console.log('Results', results);
    }
})["catch"](function (err) { return console.log(err); });
// Start server
var PORT = process.env.BACKEND_PORT || 5000;
app.listen(PORT, function () { return console.log("Server is listening on port ".concat(PORT)); });
// export default app;
//# sourceMappingURL=main.js.map