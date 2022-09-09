"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Builder = void 0;
const axios_1 = require("axios");
const collection_1 = require("./collection");
const relation_1 = require("./relation");
class Builder {
    constructor() {
        this.collections = [];
        this.relations = [];
    }
    collection(name) {
        const collection = new collection_1.Collection(this, name);
        this.collections.push(collection);
        return collection;
    }
    findCollection(collection) {
        return this.collections.find(({ name }) => name === collection);
    }
    findField(field, collection) {
        var _a;
        return (_a = this.findCollection(collection)) === null || _a === void 0 ? void 0 : _a.findField(field);
    }
    relation(collection, field, related_collection = null) {
        const relation = new relation_1.Relation(this, collection, field, related_collection);
        this.relations.push(relation);
        return relation;
    }
    render() {
        return {
            collections: this.collections.map((collection) => collection.render()),
            relations: this.relations.map((relation) => relation.render())
        };
    }
    fetch(baseURL, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const directus = axios_1.default.create({ baseURL });
            const { access_token } = yield directus.post("/auth/login", { email, password }).then(({ data: { data } }) => data);
            directus.defaults.headers.common = {
                Authorization: `Bearer ${access_token}`
            };
            const { collections, relations } = this.render();
            const then = ({ data: { data } }) => data;
            const error = ({ response: { data } }) => data;
            const result = {
                collections: yield directus.post("collections", collections).then(then).catch(error),
                relations: yield Promise.all(relations.map((relation) => directus.post("relations", relation).then(then).catch(error)))
            };
            yield directus.post("/utils/cache/clear");
            return result;
        });
    }
}
exports.Builder = Builder;
