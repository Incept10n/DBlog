import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Dblog } from '../wrappers/Dblog';
import '@ton/test-utils';

describe('Dblog', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let dblog: SandboxContract<Dblog>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        dblog = blockchain.openContract(await Dblog.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await dblog.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: dblog.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and dblog are ready to use
    });
});
