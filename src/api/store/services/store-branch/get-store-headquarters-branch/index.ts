import { ControllerArgs, HttpStatus } from '@/core';
import { Store, StoreBranch } from '@store/models';

export class GetStoreHeadquartersBranch {
    constructor(private readonly dbStore: typeof Store, private readonly dbStoreBranch: typeof StoreBranch) {}

    handle = async (payload: ControllerArgs<null>) => {
        return {
            code: HttpStatus.OK,
        };
    };
}

const getStoreHeadquartersBranchInstance = new GetStoreHeadquartersBranch(Store, StoreBranch);

export default getStoreHeadquartersBranchInstance;
