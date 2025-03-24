
import { initSdk } from './solLiquidityConfig'
import BN from 'bn.js'
import { isValidCpmm } from './solUtils'
import { NATIVE_MINT } from '@solana/spl-token'
import { CurveCalculator } from '@raydium-io/raydium-sdk-v2';

export const getRaydiumMarketCap = async (poolId,solInUsd, setMarketCap) => {
    try {
      const raydium = await initSdk();
  
      // SOL - USDC pool
      const inputAmount = new BN(1000);//token amount
      const inputMint = NATIVE_MINT.toBase58();
  
      let poolInfo;
      let poolKeys;
      let rpcData;
  
      if (raydium.cluster == 'mainnet') {
        console.log('raydium cluster:', raydium.cluster,poolId);
        // Note: API doesn't support fetching devnet pool info, so use RPC method instead
        const data = await raydium.api.fetchPoolById({ ids: poolId });
        console.log("pool-id",data)
        poolInfo = data[0];
        if (!isValidCpmm(poolInfo.programId)) throw new Error('Target pool is not a CPMM pool');
        rpcData = await raydium.cpmm.getRpcPoolInfo(poolInfo.id, true);
      } else {
        const data = await raydium.cpmm.getPoolInfoFromRpc(poolId);
        poolInfo = data.poolInfo;
        poolKeys = data.poolKeys;
        rpcData = data.rpcData;
      }
      console.log('raydium cluster 2:', raydium.cluster);
      if (inputMint !== poolInfo.mintA.address && inputMint !== poolInfo.mintB.address)
        throw new Error('Input mint does not match pool');
  
      const baseIn = inputMint === poolInfo.mintA.address;
  
      // Swap pool mintA for mintB
      const swapResult = CurveCalculator.swap(
        inputAmount,
        baseIn ? rpcData.baseReserve : rpcData.quoteReserve,
        baseIn ? rpcData.quoteReserve : rpcData.baseReserve,
        rpcData.configInfo?.tradeFeeRate
      );
  
      const price  = (swapResult.sourceAmountSwapped.toNumber())/(swapResult.destinationAmountSwapped.toNumber())
      const tokenPriceInUsdt = solInUsd?.solPrice *price;
      console.log("roken-price-in-usd",tokenPriceInUsdt)
      const marketCap = tokenPriceInUsdt * 1000000000
      setMarketCap(prevState => ({
          ...prevState,
          loading: false,
          data: marketCap
      }));
      console.log("price-from-swap",marketCap)
      console.log("Swap details:", {
        input: swapResult.sourceAmountSwapped.toNumber(),
        output: swapResult.destinationAmountSwapped.toNumber(),
        price:(swapResult.sourceAmountSwapped.toNumber())/(swapResult.destinationAmountSwapped.toNumber())
      });
  
    } catch (error) {
      console.error("Swap error:", error.message);
      setMarketCap(prevState => ({
        ...prevState,
        loading: false,
        data: ""
    }));
    }
  };
  

/** uncomment code below to execute */




// const swapTokens =async ()=>{
//      /**
//    * swapResult.sourceAmountSwapped -> input amount
//    * swapResult.destinationAmountSwapped -> output amount
//    * swapResult.tradeFee -> this swap fee, charge input mint
//    */

//   const { execute } = await raydium.cpmm.swap({
//     poolInfo,
//     poolKeys,
//     inputAmount,
//     swapResult,
//     slippage: 0.001, // range: 1 ~ 0.0001, means 100% ~ 0.01%
//     baseIn,
//     // optional: set up priority fee here
//     // computeBudgetConfig: {
//     //   units: 600000,
//     //   microLamports: 4659150,
//     // },

//     // optional: add transfer sol to tip account instruction. e.g sent tip to jito
//     // txTipConfig: {
//     //   address: new PublicKey('96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5'),
//     //   amount: new BN(10000000), // 0.01 sol
//     // },
//   })

//   printSimulateInfo()
//   // don't want to wait confirm, set sendAndConfirm to false or don't pass any params to execute
//   const { txId } = await execute({ sendAndConfirm: true })
//   console.log(`swapped: ${poolInfo.mintA.symbol} to ${poolInfo.mintB.symbol}:`, {
//     txId: `https://explorer.solana.com/tx/${txId}`,
//   })
//   process.exit() // if you don't want to end up node execution, comment this line
// }