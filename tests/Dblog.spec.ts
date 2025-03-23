import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Dblog } from '../wrappers/Dblog';
import '@ton/test-utils';

describe('Dblog', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let dblog: SandboxContract<Dblog>;
    let wallet1: SandboxContract<TreasuryContract>;
    let wallet2: SandboxContract<TreasuryContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        dblog = blockchain.openContract(await Dblog.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await dblog.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            null
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

    it('should create a post and send it to SMC', async () => {
        wallet1 = await blockchain.treasury('wallet1');
        wallet2 = await blockchain.treasury('wallet2');

        const sendResult = await dblog.send(
            wallet1.getSender(),
            {
                value: toNano(0.05)
            },
            {
                $$type: "AddPost",
                textOfPost: {
                    $$type: 'Post', 
                    text: "How to make cookies"
                }
            }
        )

        const sendAnotherResult = await dblog.send(
            wallet2.getSender(),
            {
                value: toNano(0.05)
            },
            {
                $$type: "AddPost",
                textOfPost: {
                    $$type: 'Post', 
                    text: "heheheheh"
                }
            }
        )

        expect(sendResult.transactions).toHaveTransaction({
            from: wallet1.address,
            to: dblog.address,
            success: true
        })

        const getAllPosts = await dblog.getAllPosts();
        console.log(getAllPosts);

        const getCurrentNumberOfPosts = await dblog.getCurrentNumberOfPosts(); 
        console.log(getCurrentNumberOfPosts);
    });












});
