import { ControllerArgs, HttpStatus } from '@/core';
import { StoreBranch, StoreBranchAdmin } from '@store/models';

export class DisableStoreBranchAdmin {
    constructor(private readonly dbStoreBranch: typeof StoreBranch, private readonly dbStoreAdmin: typeof StoreBranchAdmin) {}

    handle = async (payload: ControllerArgs<null>) => {
        return {
            code: HttpStatus.NO_CONTENT,
        };
    };
}

const disableStoreBranchAdminInstance = new DisableStoreBranchAdmin(StoreBranch, StoreBranchAdmin);

export default disableStoreBranchAdminInstance;
