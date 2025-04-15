import { ControllerArgs, HttpStatus } from '@/core';
import { Store, StoreBranch } from '@store/models';

export class GetStoreBranchRevenueInsights {
    constructor(private readonly dbStore: typeof Store, private readonly dbStoreBranch: typeof StoreBranch) {}

    handle = async (payload: ControllerArgs<null>) => {
        return {
            code: HttpStatus.OK,
        };
    };
}

const getStoreBranchRevenueInsightsInstance = new GetStoreBranchRevenueInsights(Store, StoreBranch);

export default getStoreBranchRevenueInsightsInstance;
