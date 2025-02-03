import express, { Request, Response, Router } from 'express';
import { ProviderParamType } from '@/game/types';
import { blingoService } from '@/game/blingo/service';

export const gameRouter: Router = (() => {
    const router = express.Router();
    router.post(`/testCheat`, async( req:Request, res:Response )=>{
        const cheatData = req.body;
        const serviceResponse = await blingoService.testCheat( cheatData );
        res.send( serviceResponse );
    });

    router.post('/get_launcher_url', async (req: Request, res: Response) => {
        const launcher : ProviderParamType = req.body;
        const response = await blingoService.provideLauncher( launcher );
        res.json( response );
    });

    router.post('/currentGame', async (req: Request, res: Response) => {
        const actionParams  = {
            action : "currentGame",
            body : req.body,
        };
        const response = await blingoService.handleAction( actionParams );
        res.json( response );
    });

    router.post('/startGame', async (req: Request, res: Response) => {
        // console.log("startGame ::", req.body);
        const actionParams  = {
            action : "startGame",
            body : req.body
        };
        const response = await blingoService.handleAction( actionParams );
        res.json( response );
    });

    router.post('/spin', async (req: Request, res: Response) => {
        const actionParams  = {
            action : "spin",
            body : req.body
        };
        const response = await blingoService.handleAction( actionParams );
        res.json( response );
    });

    router.post('/chooseCell', async (req: Request, res: Response) => {
        const actionParams  = {
            action : "chooseCell",
            body : req.body
        };
        const response = await blingoService.handleAction( actionParams );
        res.json( response );
    });

    router.post('/collect', async (req: Request, res: Response) => {
        const actionParams  = {
            action : "collect",
            body : req.body
        };
        const response = await blingoService.handleAction( actionParams );
        res.json( response );
    });
    
    return router;
})();

export const configRouter : Router = (() => {
    const router = express.Router();
    router.get('/operators/gr-test/integrations/attributes', async( req:Request, res:Response ) => {
        const operationParams = {
            action : 0
        }
        const response = await blingoService.handleOperation( operationParams );

        res.json( response );
    });
    router.get('/games/client/slingo-starburst/attributes', async( req:Request, res:Response ) => {
        const operationParams = {
            action : 1
        }
        const response = await blingoService.handleOperation( operationParams );
        res.json( response );
    });
    
    return router;
})();

export const cloudRouter : Router = (() => {
    const router = express.Router();

    router.post('/api/user/realityCheckDetails', async( req:Request, res:Response ) => {
        const operationParams = {
            action : 2
        }
        const response = await blingoService.handleOperation( operationParams );
        res.json( response );
    });
    return router;
})();

export const rgsRouter: Router = (() => {
    const router = express.Router();
    router.post('/user/login', async (req: Request, res: Response) => {
        const operationParams = {
            action : 3
        }
        const response = await blingoService.handleOperation( operationParams );

        res.json( response );
    });
    return router;
})();