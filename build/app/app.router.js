"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const core_1 = require("@/core");
const express_1 = require("express");
const auth_router_1 = require("@/api/auth/router/auth.router");
const user_1 = require("@/api/user");
exports.appRouter = (0, express_1.Router)();
// appRouter.use("/webhook", webhookRouter)
exports.appRouter.use('/auth', auth_router_1.authRouter); // DONE
// appRouter.use("/product", productRouter)
// appRouter.use("/shopping", shoppingRouter) // DONE
// appRouter.use("/payment", paymentRouter)
exports.appRouter.use('/user', user_1.userRouter);
// appRouter.use("/notifications", notificationRouter) // DONE
exports.appRouter.get('/health', (_, res) => {
    res.status(core_1.HttpStatus.OK).json({
        message: 'Api up',
        version: '1.0',
    });
});
