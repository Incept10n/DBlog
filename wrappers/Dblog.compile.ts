import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/dblog.tact',
    options: {
        debug: true,
    },
};
