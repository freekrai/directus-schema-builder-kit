"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Relation = void 0;
class Relation {
    constructor(builder, collection, field, related_collection = null, schema, meta) {
        this.builder = builder;
        this.collection = collection;
        this.field = field;
        this.related_collection = related_collection;
        this.schema = schema === undefined ? {} : schema;
        this.meta = meta === undefined ? {} : meta;
    }
    one_field(name) {
        this.meta.one_field = name;
        return this;
    }
    one_deselect_action(name) {
        this.meta.one_deselect_action = name;
        return this;
    }
    junction_field(name) {
        this.meta.junction_field = name;
        return this;
    }
    sort_field(name) {
        this.meta.sort_field = name;
        return this;
    }
    on_update(option) {
        this.schema.on_update = option;
        return this;
    }
    on_delete(option) {
        this.schema.on_delete = option;
        return this;
    }
    render() {
        return {
            collection: this.collection,
            field: this.field,
            related_collection: this.related_collection,
            schema: this.schema,
            meta: this.meta
        };
    }
}
exports.Relation = Relation;
