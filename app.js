const express = require("express"); // Utilisation d'Express

const dotenv = require("dotenv").config(); // Gère les variables d'environnement (planque les données sensibles)
const path = require("path"); // Manipule les chemins de fichier

const helmet = require("helmet"); // Sécurité : Configure les headers
const cors = require("cors"); //
const morgan = require("morgan");
const mongooseExpressErrorHandler = require("mongoose-express-error-handler");

const mongoose = require("mongoose");

const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

const app = express();

mongoose.set("strictQuery", true);
mongoose
    .connect(`${process.env.MONGODBSRV}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

const db = mongoose.connection;
db.on("error", (error) => console.error(error));

app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));
app.use(mongooseExpressErrorHandler);
app.use(morgan("combined"));
app.use(cors());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

module.exports = app;
