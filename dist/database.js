"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/database.ts
var database_exports = {};
__export(database_exports, {
  default: () => database_default,
  knex: () => knex
});
module.exports = __toCommonJS(database_exports);
var import_knex = require("knex");

// src/env/index.ts
var import_dotenv = require("dotenv");
var import_zod = require("zod");
if (process.env.NODE_ENV == "test") {
  (0, import_dotenv.config)({ path: ".env.test" });
} else {
  (0, import_dotenv.config)();
}
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(
    [
      "develop",
      "test",
      "prod"
    ]
  ).default("develop"),
  DATABASE_CLIENT: import_zod.z.string(),
  DATABASE_URL: import_zod.z.string(),
  MIGRATIONS_URL: import_zod.z.string(),
  PORT: import_zod.z.number().default(3333)
});
var _env = envSchema.safeParse(process.env);
if (_env.success === false) {
  console.error("Invalid enviroment variables!\n", _env.error.format);
  throw new Error("Invalid enviroment variables");
}
var env = _env.data;

// src/database.ts
var config2 = {
  client: env.DATABASE_CLIENT,
  connection: {
    filename: env.DATABASE_URL
  },
  // Faz com que todos os valores do banco por padrão sejam nulos
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: env.MIGRATIONS_URL
  }
};
var database_default = config2;
var knex = (0, import_knex.knex)(config2);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  knex
});
