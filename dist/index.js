"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = void 0;
const builder_1 = require("./builder");
function build(callback) {
    const builder = new builder_1.Builder();
    callback(builder);
    return builder;
}
exports.build = build;
