import { HttpStatus } from '@/core';
import { Router } from 'express';
import { authRouter } from '@/api/auth/router/auth.router';
import { userRouter } from '@/api/user';

export const appRouter = Router();

// appRouter.use("/webhook", webhookRouter)

appRouter.use('/auth', authRouter); // DONE

// appRouter.use("/product", productRouter)

// appRouter.use("/shopping", shoppingRouter) // DONE

// appRouter.use("/payment", paymentRouter)

appRouter.use('/user', userRouter);

// appRouter.use("/notifications", notificationRouter) // DONE

appRouter.get('/health', (_, res) => {
    res.status(HttpStatus.OK).json({
        message: 'Api up',
        version: '1.0',
    });
});
