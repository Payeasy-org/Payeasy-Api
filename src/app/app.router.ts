
import { tunnelerRouter } from '@/api/tunneler';

import { storeRouter } from '@/api/store';
import { storeBaseRouter } from '@/api/store/router';
import { userRouter } from '@/api/user';
import { HttpStatus } from '@/core';
import { Router } from 'express';

export const appRouter = Router();

// appRouter.use("/webhook", webhookRouter)

// appRouter.use("/product", productRouter)

// appRouter.use("/shopping", shoppingRouter) // DONE

// appRouter.use("/payment", paymentRouter)

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
