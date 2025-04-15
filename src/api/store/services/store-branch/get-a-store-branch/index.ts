import { ControllerArgs, HttpStatus } from '@/core';
import { Store, StoreBranch } from '@store/models';

export class GetStoreBranch {
    constructor(private readonly dbStore: typeof Store, private readonly dbStoreBranch: typeof StoreBranch) {}

    handle = async (payload: ControllerArgs<null>) => {
        return {
            code: HttpStatus.OK,
        };
    };
}

const getStoreBranchInstance = new GetStoreBranch(Store, StoreBranch);

export default getStoreBranchInstance;
