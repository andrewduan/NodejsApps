import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';  
import * as mongoose from 'mongoose';
import * as cors from 'cors';
import Controller from './interfaces/controllerInterface';
import errorMiddleware from './middlewares/exceptionMiddleware';
 
class App {
  public app: express.Application;
 
  constructor(controllers: Controller[]) {
    this.app = express();
    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeCors();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }
 
  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }

  private initializeCors(){
    this.app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "http://localhost:3000");
      res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
      res.header("Access-Control-Allow-Headers", "Content-Type, Accept");
      res.header("Access-Control-Allow-Credentials", "true");
      next();
    });
  }
 
  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cookieParser())
  }
 
  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }
  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
 
  private connectToTheDatabase() {
    const {
      MONGO_USER,
      MONGO_PASSWORD,
      MONGO_PATH,
    } = process.env;
    console.log(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`);
    
    mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`,{ useNewUrlParser: true, useUnifiedTopology: true  });
  }
}
 
export default App;