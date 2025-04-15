import { ControllerArgs, HttpStatus } from '@/core';
import { StoreBranch, StoreBranchAdmin } from '@store/models';

export class CreateStoreBranchAdmin {
    constructor(private readonly dbStoreBranch: typeof StoreBranch, private readonly dbStoreAdmin: typeof StoreBranchAdmin) {}

    handle = async (payload: ControllerArgs<null>) => {
        return {
            code: HttpStatus.CREATED,
        };
    };
}

const createStoreBranchAdminInstance = new CreateStoreBranchAdmin(StoreBranch, StoreBranchAdmin);

export default createStoreBranchAdminInstance;
