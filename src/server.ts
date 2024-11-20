import cors from "cors";
import * as path from 'path';
import helmet from "helmet";
import express, { type Express } from "express";
import { pino } from "pino";

import errorHandler from "@/common/middleware/errorHandler";
import { env } from "@/common/utils/envConfig";
import { connect } from '@/common/models';
import * as Routers from "@/game/router";

const logger = pino({ name: "server start" });
const app: Express = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.get("/blingo", async( req, res) => {
    res.render( "blingo/blingo" );
});

connect(String(process.env.DBNAME)).then(async (loaded) => {
    if (loaded) {
        app.set("trust proxy", true);
        app.use(cors("*" as cors.CorsOptions));
        app.use(helmet());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use("/rgs", Routers.rgsRouter);
        app.use("/api/gamestudio/rogue/starburst", Routers.gameRouter);
        app.use("/gamecloud-servlets", Routers.cloudRouter);
        app.use("/config-hub", Routers.configRouter);
        // gamecloud-servlets/api/user/realityCheckDetails

        app.use(errorHandler());
    }
});

export { app, logger };
