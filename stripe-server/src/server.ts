import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import { config } from './config/config';
import Logging from './library/Logging';
import Stripe from 'stripe';

const router = express();

const stripe = new Stripe(config.stripe.stripe_key, {
  apiVersion: '2022-11-15',
});

/** Only start the server of mongo connects */
const StartServer = () => {
  router.use((req: Request, res: Response, next: NextFunction) => {
    /** Log the Request */
    Logging.info(
      `Incoming --> Method : [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`
    );

    res.on('finish', () => {
      /** Log the Response */
      Logging.info(
        `Outgoing --> Method : [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`
      );
    });

    next();
  });

  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());

  /** Rules of our API */
  router.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method == 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
      return res.status(200).json({});
    }

    next();
  });

  /** Health check */
  router.get('/health', (req: Request, res: Response, next: NextFunction) =>
    res.status(200).json({ message: 'Testing!!!' })
  );

  router.post(
    '/api/checkout',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const session = await stripe.checkout.sessions.create({
          // line_items: req.body.items.map((item: any) => ({
          //   price_data: {
          //     currency: 'usd',
          //     product_data: {
          //       name: item.name,
          //     },
          //     unit_amount: item.price * 100,
          //   },
          //   quantity: 1,
          // })),

          line_items: [
            {
              price_data: {
                currency: 'usd',
                unit_amount: 500,
                product_data: { name: 'Transaction Name' },
              },
              quantity: 1,
            },
          ],
          cancel_url: 'http://localhost:4200',
          success_url: 'http://localhost:4200',
          mode: 'payment',
        });

        res.status(200).json(session);
      } catch (error) {
        res.status(400).json({ message: error });
      }
    }
  );

  /** Error Handling */
  router.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error('<--Not Found-->');
    Logging.error(error);

    return res.status(404).json({ message: error });
  });

  http
    .createServer(router)
    .listen(config.server.port, () =>
      Logging.info(`<-- Server is running on PORT: ${config.server.port} -->`)
    );
};

StartServer();
