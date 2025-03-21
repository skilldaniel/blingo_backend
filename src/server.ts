import cors from "cors";
import * as path from 'path';
import helmet from "helmet";
import express, { type Express } from "express";
import { pino } from "pino";

import errorHandler from "@/common/middleware/errorHandler";
import { connect } from '@/common/models';
import * as Routers from "@/game/router";

const logger = pino({ name: "server start" });
const app: Express = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.get("/slingo", async( req, res) => {
    console.log(`here?`)
    res.render( "slingo/index" );
});

connect(String(process.env.DBNAME)).then(async (loaded) => {
    if (loaded) {
        app.set("trust proxy", true);
        app.use(cors("*" as cors.CorsOptions));
        app.use(helmet());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use("/rgs", Routers.rgsRouter);
        app.use("/config-hub", Routers.configRouter);
        app.use("/gamecloud-servlets", Routers.cloudRouter);
        app.use("/api/gamestudio/rogue/starburst", Routers.gameRouter);

        app.use(errorHandler());
    }
});

export { app, logger };
