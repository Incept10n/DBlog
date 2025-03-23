import { toNano } from '@ton/core';
import { Dblog } from '../wrappers/Dblog';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const dblog = provider.open(await Dblog.fromInit());

    await dblog.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(dblog.address);

    // run methods on `dblog`
}
