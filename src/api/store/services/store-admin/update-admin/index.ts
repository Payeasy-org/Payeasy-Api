import { ControllerArgs, HttpStatus } from '@/core';
import { StoreBranch, StoreBranchAdmin } from '@store/models';

export class UpdateStoreBranchAdmin {
    constructor(private readonly dbStoreBranch: typeof StoreBranch, private readonly dbStoreAdmin: typeof StoreBranchAdmin) {}

    handle = async (payload: ControllerArgs<null>) => {
        return {
            code: HttpStatus.OK,
        };
    };
}

const updateStoreBranchAdminInstance = new UpdateStoreBranchAdmin(StoreBranch, StoreBranchAdmin);

export default updateStoreBranchAdminInstance;
