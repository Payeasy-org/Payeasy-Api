import { ControllerArgs, HttpStatus } from '@/core';
import { Store, StoreBranch } from '@store/models';

export class GetStoreBranchCustomerOverview {
    constructor(private readonly dbStore: typeof Store, private readonly dbStoreBranch: typeof StoreBranch) {}

    handle = async (payload: ControllerArgs<null>) => {
        return {
            code: HttpStatus.OK,
        };
    };
}

const getStoreBranchCustomerOverviewInstance = new GetStoreBranchCustomerOverview(Store, StoreBranch);

export default getStoreBranchCustomerOverviewInstance;
