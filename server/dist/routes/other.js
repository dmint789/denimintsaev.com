"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.incrementButtonClicks = exports.getCollectiveClicks = void 0;
var random_1 = __importDefault(require("../models/random"));
var getCollectiveClicks = function (req, res) {
    console.log('Getting collective counter clicks');
    random_1["default"].findOne()
        .exec()
        .then(function (results) {
        return res.status(200).json({ clicks: results === null || results === void 0 ? void 0 : results.collectiveCounterClicks });
    })["catch"](function (err) { return res.status(500).json({ message: err.message }); });
};
exports.getCollectiveClicks = getCollectiveClicks;
var incrementButtonClicks = function (req, res) {
    random_1["default"].findOne()
        .exec()
        .then(function (results) {
        var newClicks = Number(results === null || results === void 0 ? void 0 : results.collectiveCounterClicks) + 1;
        console.log("Incrementing collective counter clicks to ".concat(newClicks));
        random_1["default"].updateOne({}, { collectiveCounterClicks: newClicks })
            .then(function () {
            return res.status(200).json({ clicks: newClicks });
        })["catch"](function (err) { return res.status(500).json({ message: err.message }); });
    })["catch"](function (err) { return res.status(500).json({ message: err.message }); });
};
exports.incrementButtonClicks = incrementButtonClicks;
//# sourceMappingURL=other.js.map