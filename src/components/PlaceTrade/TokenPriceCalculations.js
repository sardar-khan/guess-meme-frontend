
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction, clusterApiUrl, sendAndConfirmTransaction } from "@solana/web3.js";
// import { connection, feeRecipient, IDL1, mintaddy, SELLSLIPPAGE, wallet } from "./config";
import { connection, provider, feeRecipient, IDL1, SELLSLIPPAGE, wallet } from "./config";
import { getAccount, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { Buy_createTransactionInstruction, b, fetchLiquidityPool, lx_global } from "./utils";
import BN from "bn.js";
import { createAssociatedTokenAccountInstruction } from "@solana/spl-token";
import { AnchorProvider, Program, web3 } from "@coral-xyz/anchor";
import * as buffer from 'buffer'
import { toast } from "react-toastify";
import { getAssociatedTokenAddressSync } from '@solana/spl-token'
//import { getBuySellInSolBuy, getBuySellInTokens, getBuySellInTokensBuy, retrieveTokenInfo } from "./TokenPriceCalculations";

export const getBuySellInSolBuy =(amount,k,virtualSolReserves,virtualTokenReserves)=>{
    try{

        const tokenAmountBN = BigInt(Math.floor(amount * 1_000_000)); // Assuming 6 decimal tokens

        console.log("Tokens in smallest unit:", tokenAmountBN);

        // SOL price for given tokens
        const buySolAgainstTokens = Math.abs(Number(
            virtualSolReserves - (k / (virtualTokenReserves - tokenAmountBN))
        ));
        const sellSolAgainstTokens = Math.abs(Number(
            (k / (virtualTokenReserves + tokenAmountBN)) - virtualSolReserves
        ));
        console.log("priceeeexx", {
            tokensbuy: buySolAgainstTokens / 1_000_000_000, // Convert lamports to SOL
            tokensell: sellSolAgainstTokens / 1_000_000_000, // Convert lamports to SOL
        })
        return {
            tokensbuy: buySolAgainstTokens / 1_000_000_000, // Convert lamports to SOL
            tokensell: sellSolAgainstTokens / 1_000_000_000, // Convert lamports to SOL
        };
    }catch(error){
        console.log("error while buysell sol conversion",error)
    }
}

export const getBuySellInTokensBuy=(amount,k,virtualSolReserves,virtualTokenReserves)=>{
    try{
        const oneSOLInLamports = BigInt(Math.floor(amount * LAMPORTS_PER_SOL));
           

        // Tokens per 1 SOL
        const buyTokensAgainstSol = Number(
            virtualTokenReserves - (k / (virtualSolReserves + oneSOLInLamports))
        );
        const sellTokensAgainstSol = Number(
            (k / (virtualSolReserves - oneSOLInLamports)) - virtualTokenReserves
        );
        const tokensbuy = buyTokensAgainstSol / 1000000
        const tokensell = sellTokensAgainstSol / 1000000


        //Sol per 1 token Calculation
        const tokenAmountBN = BigInt(Math.floor(amount * 1000_000));
        const buySolAgainstTokens = Math.abs(Number(
            virtualSolReserves - (k / (virtualTokenReserves - tokenAmountBN))
        ));
        const sellSolAgainstTokens = Math.abs(Number(
            (k / (virtualTokenReserves + tokenAmountBN)) - virtualSolReserves
        ));




        const tokenPriceInSol = buySolAgainstTokens / 1_000_000_000;
        const sellTokenPriceInSol = sellSolAgainstTokens/1_000_000_000;
        

       
       

        console.log({
            tokenPriceInSol,
            sellTokenPriceInSol,
            tokensbuy,
            tokensell
        });
        console.log("priceeee", {
            tokenPriceInSol,
            sellTokenPriceInSol,
            tokensbuy,
            tokensell
        })

        return {
            tokenPriceInSol,
            sellTokenPriceInSol,
            tokensbuy,
            tokensell
        };

    }catch(error){
        console.log("error while calculating getBuySellInTokens",error)
    }
}
export const retrieveTokenInfo = async (program, programId, mintaddy, isDeployed) => {

    console.log("is ths okay", program, programId, mintaddy, isDeployed)
    if (isDeployed) {

        window.Buffer = buffer.Buffer
        const [C] = PublicKey.findProgramAddressSync(
            [Buffer.from('bonding-curve'), mintaddy.toBuffer()],
            programId,
        )

        const r = await program.account.bondingCurve.fetch(C)
        console.log("rrrrrr", r)
        const {
            virtualTokenReserves,
            virtualSolReserves,
            realTokenReserves,
            tokenTotalSupply,
            complete = false, // Default value if not present
        } = r

        // Convert BN objects to strings
        const virtualTokenReservesStr = virtualTokenReserves.toString()
        const virtualSolReservesStr = virtualSolReserves.toString()
        const realTokenReservesStr = realTokenReserves.toString()
        const tokenTotalSupplyStr = tokenTotalSupply.toString()

        // Logging the specific properties in a formatted string
        const formattedOutput = {
            virtualTokenReserves: virtualTokenReservesStr,
            virtualSolReserves: virtualSolReservesStr,
            realTokenReserves: realTokenReservesStr,
            tokenTotalSupply: tokenTotalSupplyStr,
            remainingTokens: parseFloat(realTokenReservesStr / 1000000),
            totalTokens: parseFloat(tokenTotalSupplyStr / 1000000),
            complete: complete,
        }

        console.log('virtual reseverrrs', formattedOutput)
        return formattedOutput
    } else {
        const formattedOutput = {
            virtualTokenReserves: "1200000000000000",
            virtualSolReserves: "30000000000",
            realTokenReserves: "800000000000000",
            tokenTotalSupply: "1000000000000000",
            remainingTokens: 800000000,
            totalTokens: 1000000000,
            complete: false,
        }


        console.log('virtual reseves', formattedOutput)
        return formattedOutput
    }

}