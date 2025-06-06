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

// src/routes/transactions.ts
var transactions_exports = {};
__export(transactions_exports, {
  transactionRoutes: () => transactionRoutes
});
module.exports = __toCommonJS(transactions_exports);
var import_zod2 = require("zod");
var import_crypto = require("crypto");

// src/database.ts
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
var knex = (0, import_knex.knex)(config2);

// src/middlewares/check-session-id-exists.ts
async function checkSessionIdExists(request, reply) {
  const sessionId = request.cookies.sessionId;
  if (!sessionId)
    reply.status(401).send({
      error: "Unauthorized"
    });
}

// src/routes/transactions.ts
function transactionRoutes(app) {
  app.get(
    "/",
    {
      preHandler: [checkSessionIdExists]
    },
    async (request, reply) => {
      const { sessionId } = request.cookies;
      const transactions = await knex("transactions").where("session_id", sessionId).select("*");
      return reply.status(200).send({ transactions });
    }
  );
  app.get(
    "/:id",
    {
      preHandler: [checkSessionIdExists]
    },
    async (request) => {
      const getTransactionParamsSchema = import_zod2.z.object({
        id: import_zod2.z.string().uuid()
      });
      const { id } = getTransactionParamsSchema.parse(request.params);
      const { sessionId } = request.cookies;
      const transaction = await knex("transactions").where({
        session_id: sessionId,
        id
      }).first();
      return { transaction };
    }
  );
  app.get(
    "/summary",
    {
      preHandler: [checkSessionIdExists]
    },
    async (request) => {
      const { session_id } = request.cookies;
      const summary = await knex("transactions").sum("amount", { as: "amount" }).first();
      return { summary };
    }
  );
  app.post(
    "/",
    async (request, reply) => {
      const createTransactionBodySchema = import_zod2.z.object({
        title: import_zod2.z.string(),
        amount: import_zod2.z.number(),
        type: import_zod2.z.enum(["credit", "debit"])
      });
      const { title, amount, type } = createTransactionBodySchema.parse(
        request.body
      );
      let sessionId = request.cookies.sessionId;
      if (!sessionId) {
        sessionId = (0, import_crypto.randomUUID)();
        reply.cookie("sessionId", sessionId, {
          path: "/",
          // Indica que o cooki dura 7 dias.
          //  60 = 1seg, 60 = 1 hora, 24 horas, 7 dias
          maxAge: 60 * 60 * 24 * 7
          // 7 dias
        });
      }
      await knex("transactions").insert({
        id: (0, import_crypto.randomUUID)(),
        title,
        amount: type == "debit" ? amount : amount * -1,
        session_id: sessionId
      });
      return reply.status(201).send();
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  transactionRoutes
});
