import { ControllerArgs, HttpStatus } from '@/core';
import { StoreBranch, StoreBranchAdmin } from '@store/models';

export class GetStoreBranchAdmins {
    constructor(private readonly dbStoreBranch: typeof StoreBranch, private readonly dbStoreAdmin: typeof StoreBranchAdmin) {}

    handle = async (payload: ControllerArgs<null>) => {
        return {
            code: HttpStatus.OK,
        };
    };
}

const getStoreBranchAdminsInstance = new GetStoreBranchAdmins(StoreBranch, StoreBranchAdmin);

export default getStoreBranchAdminsInstance;
