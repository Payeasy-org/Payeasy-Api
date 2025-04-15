import { ControllerArgs, HttpStatus } from '@/core';
import { Store, StoreBranch } from '@store/models';

export class CreateStoreBranch {
    constructor(private readonly dbStore: typeof Store, private readonly dbStoreBranch: typeof StoreBranch) {}

    handle = async (payload: ControllerArgs<null>) => {
        return {
            code: HttpStatus.CREATED,
        };
    };
}

const createStoreBranchInstance = new CreateStoreBranch(Store, StoreBranch);

export default createStoreBranchInstance;
