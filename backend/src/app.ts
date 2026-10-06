import express from "express";
import cookieParser from "cookie-parser";
import {errorHandler} from "./middleware/error.middleware.js"

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import preferencesRoutes from "./routes/preferences.routes.js";
import sourceRoutes from "./routes/sources.routes.js";

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());







app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/user", preferencesRoutes);
app.use("/api/sources", sourceRoutes);
app.use("/api/user/sources", sourceRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Server is running!",
    });
});


app.use(errorHandler);

export default app;