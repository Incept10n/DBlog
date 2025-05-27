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
                // value: toNano(0.05)
                value: toNano(2)
            },
            {
                $$type: "AddPost",
                textOfPost: {
                    $$type: 'Post', 
                    text: "How to make cookies"
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

    it('should NOT withdraw TON from the contract', async () => {

        wallet1 = await blockchain.treasury('wallet1')
        
        const sendResult = await dblog.send(
            wallet1.getSender(),
            {
                value: toNano(10),
            },
            {
                $$type: 'AddPost',
                textOfPost: {
                    $$type: 'Post',
                    text: "This message with 10 TONs",
                }
            }
        )

        expect(sendResult.transactions).toHaveTransaction({
            from: wallet1.address,
            success: true
        })

        const balanceSMCbefore = await dblog.getBalance()

        const withdrawNotOwnerResult = await dblog.send(
            wallet1.getSender(),
            {
                value: toNano(0.05),
            },
            {
                $$type: 'WithDraw',
                amountToWithdraw: toNano(3)
            }
        )

        const balanceSMCafter = await dblog.getBalance()
        expect(Number(balanceSMCbefore)).toBeCloseTo(Number(balanceSMCafter))

        console.log(balanceSMCbefore)
        console.log(balanceSMCafter)

        expect(withdrawNotOwnerResult.transactions).toHaveTransaction({
            from: wallet1.address,
            success: false,
            exitCode: 132,
        })
    });

    it('should withdraw TON from the contract', async () => {

        const SMCowner = await dblog.getOwner();

        expect(String(SMCowner)).toBe(String(deployer.address))
        console.log(String(SMCowner))
        console.log(String(deployer.address))

        wallet1 = await blockchain.treasury('wallet1')
        
        const sendResult = await dblog.send(
            wallet1.getSender(),
            {
                value: toNano(10),
            },
            {
                $$type: 'AddPost',
                textOfPost: {
                    $$type: 'Post',
                    text: "This message with 10 TONs",
                }
            }
        )

        expect(sendResult.transactions).toHaveTransaction({
            from: wallet1.address,
            success: true
        })

        const balanceSMCbefore = await dblog.getBalance()

        const withdrawOwnerResult = await dblog.send(
            deployer.getSender(),
            {
                value: toNano(0.05),
            },
            {
                $$type: 'WithDraw',
                amountToWithdraw: toNano(3)
            }
        )

        const balanceSMCafter = await dblog.getBalance()
        expect(Number(balanceSMCbefore)).toBeGreaterThan(Number(balanceSMCafter))

        console.log(balanceSMCbefore)
        console.log(balanceSMCafter)

    });







});
