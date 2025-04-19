import { checkoutRouter, searchRetailrRouter, searchStoreRouter,cartRouter } from '@/api/tunneler';


import { userRouter } from '@/api/user';
import { HttpStatus } from '@/core';
import { Router } from 'express';

export const appRouter = Router();

// appRouter.use("/webhook", webhookRouter)

// appRouter.use("/product", productRouter)

// appRouter.use("/shopping", shoppingRouter) // DONE

// appRouter.use("/payment", paymentRouter)
appRouter.use('/shopping', checkoutRouter)
appRouter.use('/product', searchRetailrRouter)
appRouter.use('/tunneler', searchStoreRouter)
appRouter.use('/cart',cartRouter)

appRouter.use('/user', userRouter);


// appRouter.use("/notifications", notificationRouter) // DONE

appRouter.get('/health', (_, res) => {
    res.status(HttpStatus.OK).json({
        message: 'Api up',
        version: '1.0',
    });
});
