"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Field = void 0;
class Field {
    constructor(builder, collection, name, type, schema, meta) {
        this.builder = builder;
        this.collection = collection;
        this.name = name;
        this.type = type;
        this.schema = schema === undefined ? {} : schema;
        this.meta = meta === undefined ? {} : meta;
    }
    default(value) {
        this.schema.default_value = value;
        return this;
    }
    nullable(value = true) {
        this.schema.is_nullable = value;
        return this;
    }
    notNullable() {
        this.schema.is_nullable = false;
        return this;
    }
    pk(value = true) {
        this.schema.is_primary_key = value;
        return this;
    }
    autoincrement(value = true) {
        this.schema.has_auto_increment = value;
        return this;
    }
    unique(value = true) {
        this.schema.is_unique = value;
        return this;
    }
    special(...special) {
        this.meta.special = special;
        return this;
    }
    width(value) {
        this.meta.width = value;
        return this;
    }
    required(value = true) {
        this.meta.required = value;
        return this;
    }
    readonly(value = true) {
        this.meta.readonly = value;
        return this;
    }
    hidden(value = true) {
        this.meta.hidden = value;
        return this;
    }
    interface(name, options) {
        this.meta.interface = name;
        this.meta.options = options;
        return this;
    }
    display(name, options) {
        this.meta.display = name;
        this.meta.display_options = options;
        return this;
    }
    translation(language, translation) {
        if (!Array.isArray(this.meta.translations)) {
            this.meta.translations = [];
        }
        this.meta.translations.push({ language, translation });
    }
    relation(related_collection = null) {
        return this.builder.relation(this.collection.name, this.name, related_collection);
    }
    render() {
        return {
            collection: this.collection.name,
            field: this.name,
            type: this.type,
            schema: this.schema,
            meta: this.meta
        };
    }
}
exports.Field = Field;
