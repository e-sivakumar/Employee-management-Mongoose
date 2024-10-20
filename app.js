const express = require("express");
const db = require("./db");
const httpContext = require("express-http-context");
const employeeRouter = require("./router/employeeRouter");
const adminRouter = require("./router/adminRouter");
const swaggerUi = require("swagger-ui-express")

const swaggerDocument = require("./config/swagger.json");

require("dotenv").config();

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  swaggerOptions: {
    defaultModelsExpandDepth: -1
  }
})
)

app.use(express.json());
app.use(httpContext.middleware);

app.use("/employee", employeeRouter);
app.use("/admin", adminRouter)

app.use((req, res)=>{
  res.status(404).send({message:"URL not found"});
})

db()
  .then(() => {})
  .catch((err) => console.log("database error", err));

console.log("port", process.env.PORT);

app.listen(process.env.PORT, () => console.log("port running"));
