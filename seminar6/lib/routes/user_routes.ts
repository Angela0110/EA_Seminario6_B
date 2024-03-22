import { Application, Request, Response } from 'express';
import { UserController } from '../controllers/userController';

export class UserRoutes {

    private user_controller: UserController = new UserController();

    public route(app: Application) {
        
        app.post('/user', (req: Request, res: Response) => {
            this.user_controller.create_user(req, res);
        });

        app.get('/user/', (req: Request, res: Response) => {
            this.user_controller.getAll(req, res);
        });

        app.get('/user/:id', (req: Request, res: Response) => {
            this.user_controller.get_user(req, res);
        });


        app.put('/user/:id', (req: Request, res: Response) => {
            this.user_controller.update_user(req, res);
        });

        app.delete('/user/:id', (req: Request, res: Response) => {
            this.user_controller.delete_user(req, res);
        });

    }
}