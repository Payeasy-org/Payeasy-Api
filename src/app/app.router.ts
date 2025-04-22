


import { storeRouter } from '@/api/shopping/router/store.router';
import { cartRouter } from '@/api/shopping/router/cart.router';
import { storeBaseRouter } from '@/api/store/router';
import { userRouter } from '@/api/user';
import { HttpStatus } from '@/core';
import { Router } from 'express';
import { tunnelerRouter } from '@/api/tunneler/routes/tunneler.routes';
import { cartPaymentRouter } from '@/api/financial/router/payment.router';
import { receiptRouter } from '@/api/financial/router/receipt.router';
import { storePaymentRouter } from '@/api/financial/router/store.router';

export const appRouter = Router();

// appRouter.use("/webhook", webhookRouter)


appRouter.use("/cart", cartRouter) //DONE

appRouter.use("/store", storeRouter) // DONE

appRouter.use("/payment", cartPaymentRouter)

appRouter.use("/payment",storePaymentRouter)
appRouter.use("/payment",receiptRouter)

//tunneler


//get store
appRouter.use('/tunneler', tunnelerRouter);




appRouter.use('/user', userRouter);
appRouter.use('/store', storeBaseRouter);


// appRouter.use("/notifications", notificationRouter) // DONE

appRouter.get('/health', (_, res) => {
    res.status(HttpStatus.OK).json({
        message: 'Api up',
        version: '1.0',
    });
});
