"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = void 0;
const field_1 = require("./field");
function date_special(field, on_create, on_updated) {
    const special = [];
    if (on_create) {
        special.push("date-created");
    }
    if (on_updated) {
        special.push("date-updated");
    }
    if (special.length) {
        field.special(...special);
    }
    return field;
}
class Collection {
    constructor(builder, name, schema, meta, fields) {
        this.builder = builder;
        this.name = name;
        this.schema = schema === undefined ? {} : schema;
        this.meta = meta === undefined ? {} : meta;
        this.fields = fields === undefined ? [] : fields;
    }
    findField(field) {
        return this.fields.find(({ name }) => name === field);
    }
    findPrimaryKey() {
        return this.fields.find((field) => field.schema.is_primary_key === true);
    }
    hidden(value = true) {
        this.meta.hidden = value;
        return this;
    }
    singleton(value = true) {
        this.meta.singleton = value;
        return this;
    }
    icon(value) {
        this.meta.icon = value;
        return this;
    }
    color(value) {
        this.meta.color = value;
        return this;
    }
    sort(field) {
        this.meta.sort_field = field;
        return this;
    }
    archive(field, archive = "archived", unarchive = "draft", filter = true) {
        this.meta.archive_field = field;
        this.meta.archive_value = archive;
        this.meta.unarchive_value = unarchive;
        this.meta.archive_app_filter = filter;
        return this;
    }
    accountability(value) {
        this.meta.accountability = value;
        return this;
    }
    translation(language, translation, singular, plural) {
        if (!Array.isArray(this.meta.translations)) {
            this.meta.translations = [];
        }
        this.meta.translations.push({ language, translation, singular, plural });
        return this;
    }
    field(name, type, schema, meta) {
        const field = new field_1.Field(this.builder, this, name, type, schema, meta);
        this.fields.push(field);
        return field;
    }
    relation(field, related_collection = null) {
        this.builder.relation(this.name, field, related_collection);
        return this;
    }
    primary_key(name, type) {
        const field = this.field(name, type).notNullable().pk();
        if (type === "integer") {
            return field.autoincrement();
        }
        else if (type === "uuid") {
            return field.special("uuid");
        }
        else {
            return field;
        }
    }
    user_created(name, options = { template: "{{avatar.$thumbnail}} {{first_name}} {{last_name}}", on_delete: "SET NULL" }) {
        const { template, on_delete } = options;
        const field = this.uuid(name, "user").interface("select-dropdown-m2o", { template }).display("user");
        field.relation("directus_users").on_delete(on_delete);
        return field;
    }
    role_created(name, options = { template: "{{name}}", on_delete: "SET NULL" }) {
        const { template, on_delete } = options;
        const field = this.uuid(name, "role")
            .interface("select-dropdown-m2o", { template })
            .display("related-values", { template });
        field.relation("directus_roles").on_delete(on_delete);
        return field;
    }
    user_updated(name, options = { template: "{{avatar.$thumbnail}} {{first_name}} {{last_name}}", on_delete: "SET NULL" }) {
        const { template, on_delete } = options;
        const field = this.uuid(name, null, "user").interface("select-dropdown-m2o", { template }).display("user");
        field.relation("directus_users").on_delete("SET NULL");
        return field;
    }
    role_updated(name, options = { template: "{{name}}", on_delete: "SET NULL" }) {
        const { template, on_delete } = options;
        const field = this.uuid(name, null, "role")
            .interface("select-dropdown-m2o", { template })
            .display("related-values", { template });
        field.relation("directus_roles").on_delete(on_delete);
        return field;
    }
    date_created(name) {
        return this.timestamp(name, true).interface("datetime").display("datetime", { relative: true });
    }
    date_updated(name) {
        return this.timestamp(name, false, true).interface("datetime").display("datetime", { relative: true });
    }
    string(name, max_length = 255) {
        return this.field(name, "string", { max_length: max_length });
    }
    text(name) {
        return this.field(name, "text");
    }
    boolean(name) {
        return this.field(name, "boolean").special("boolean");
    }
    integer(name, precision = 32) {
        return this.field(name, "integer", { numeric_precision: precision });
    }
    bigInteger(name, precision = 64) {
        return this.field(name, "bigInteger", { numeric_precision: precision });
    }
    float(name, precision = 10, scale = 5) {
        return this.field(name, "float", {
            numeric_precision: precision,
            numeric_scale: scale
        });
    }
    decimal(name, precision = 10, scale = 5) {
        return this.field(name, "decimal", {
            numeric_precision: precision,
            numeric_scale: scale
        });
    }
    datetime(name, on_create = false, on_updated = false) {
        return date_special(this.field(name, "datetime"), on_create, on_updated);
    }
    timestamp(name, on_create = false, on_updated = false) {
        return date_special(this.field(name, "timestamp"), on_create, on_updated);
    }
    date(name, on_create = false, on_updated = false) {
        return date_special(this.field(name, "date"), on_create, on_updated);
    }
    time(name, on_create = false, on_updated = false) {
        return date_special(this.field(name, "time"), on_create, on_updated);
    }
    json(name) {
        return this.field(name, "json").special("json");
    }
    csv(name) {
        return this.field(name, "csv").special("csv");
    }
    uuid(name, on_create = null, on_update = null) {
        const field = this.field(name, "uuid");
        const special = [];
        if (on_create) {
            const options = {
                uuid: "uuid",
                user: "user-created",
                role: "role-created"
            };
            const value = options[on_create];
            special.push(value);
        }
        if (on_update) {
            const options = {
                user: "user-updated",
                role: "role-updated"
            };
            const value = options[on_update];
            special.push(value);
        }
        if (special.length) {
            field.special(...special);
        }
        return field;
    }
    hash(name) {
        return this.field(name, "hash").special("hash");
    }
    geometryPoint(name) {
        return this.field(name, "geometry.Point");
    }
    geometryLineString(name) {
        return this.field(name, "geometry.LineString");
    }
    geometryPolygon(name) {
        return this.field(name, "geometry.Polygon");
    }
    geometryMultiPoint(name) {
        return this.field(name, "geometry.MultiPoint");
    }
    geometryMultiLineString(name) {
        return this.field(name, "geometry.MultiLineString");
    }
    geometryMultiPolygon(name) {
        return this.field(name, "geometry.MultiPolygon");
    }
    file(name) {
        const field = this.field(name, "uuid").special("file").interface("file").display("file");
        field.relation("directus_files").on_delete("SET NULL");
        return field;
    }
    image(name) {
        const field = this.field(name, "uuid").special("file").interface("file-image").display("image");
        field.relation("directus_files").on_delete("SET NULL");
        return field;
    }
    foreign(name, related_collection, related_field, options) {
        const collection = this.builder.findCollection(related_collection);
        if (!collection) {
            throw Error("Collection not exists");
        }
        const primary_key = collection.findPrimaryKey();
        if (!primary_key) {
            throw Error("Collection hasn't primary key");
        }
        const { template } = options;
        const field = this.field(name, primary_key.type)
            .interface("select-dropdown-m2o", { template })
            .display("related-values", { template });
        const { sort_field, junction_field, one_deselect_action, on_delete } = options;
        const relation = field.relation(related_collection);
        if (related_field) {
            relation.one_field(related_field);
        }
        if (junction_field) {
            relation.junction_field(junction_field);
        }
        if (sort_field) {
            relation.sort_field(sort_field);
        }
        if (one_deselect_action) {
            relation.one_deselect_action(one_deselect_action);
        }
        if (on_delete) {
            relation.on_delete(on_delete);
        }
        return field;
    }
    o2m(name, options) {
        const { template } = options;
        return this.field(name, "alias")
            .special("o2m")
            .interface("list-o2m", { template })
            .display("related-values", { template });
    }
    m2m(name, options) {
        const { template } = options;
        return this.field(name, "alias")
            .special("m2m")
            .interface("list-m2m", { template })
            .display("related-values", { template });
    }
    render() {
        return {
            collection: this.name,
            schema: this.schema,
            meta: this.meta,
            fields: this.fields.map((field) => field.render())
        };
    }
}
exports.Collection = Collection;
