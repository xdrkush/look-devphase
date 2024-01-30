import { Flipper } from '@/typings/Flipper';
import { ContractType, DevPhase, RuntimeContext, TxHandler } from '@devphase/service';
import * as PhalaSdk from '@phala/sdk';


export default async function(
    runtimeContext : RuntimeContext,
    devPhase : DevPhase
) {
    const asAccount : string = 'alice';
    
    const keyringPair : any = typeof asAccount === 'string'
        ? devPhase.accounts[asAccount]
        : asAccount;
    
    const cert = await PhalaSdk.signCertificate({ pair: keyringPair });
    
    
    const flipperFactory : Flipper.Factory = await devPhase.getFactory('flipper', {
        contractType: ContractType.InkCode,
    });
    
    // upload contract code
    await flipperFactory.deploy({
        autoDeposit: true,
        asAccount,
    });
    
    // instantiate
    const contract : Flipper.Contract = await flipperFactory.instantiate(
        'new',
        [ false ],
        { asAccount }
    );
    
    console.log(
        'Contract ID:',
        contract.address.toHex()
    );
    
    // check value
    // {
    //     const value = await contract.query.get(keyringPair.address, { cert });
    //     console.log(value.output.toHuman());
    // }
    //
    // // exec tx
    // const result = await TxHandler.handle(
    //     contract.tx.flip({}),
    //     keyringPair,
    //     true
    // );
    // console.log(result.status.toHuman());
    //
    // // check value again
    // {
    //     const value = await contract.query.get(keyringPair.address, { cert });
    //     console.log(value.output.toHuman());
    // }
}
