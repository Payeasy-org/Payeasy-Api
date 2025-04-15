import { ControllerArgs, HttpStatus } from '@/core';
import { StoreBranch, StoreBranchAdmin } from '@store/models';

export class LoginStoreBranchAdmin {
    constructor(private readonly dbStoreBranch: typeof StoreBranch, private readonly dbStoreAdmin: typeof StoreBranchAdmin) {}

    handle = async (payload: ControllerArgs<null>) => {
        return {
            code: HttpStatus.OK,
        };
    };
}

const loginStoreBranchAdminInstance = new LoginStoreBranchAdmin(StoreBranch, StoreBranchAdmin);

export default loginStoreBranchAdminInstance;
