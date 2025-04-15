import { ControllerArgs, HttpStatus } from '@/core';
import { Store, StoreBranch } from '@store/models';

export class DeleteStoreBranch {
    constructor(private readonly dbStore: typeof Store, private readonly dbStoreBranch: typeof StoreBranch) {}

    handle = async (payload: ControllerArgs<null>) => {
        return {
            code: HttpStatus.NO_CONTENT,
        };
    };
}

const deleteStoreBranchInstance = new DeleteStoreBranch(Store, StoreBranch);

export default deleteStoreBranchInstance;
