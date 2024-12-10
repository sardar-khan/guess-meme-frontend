// const { Keypair, PublicKey, Transaction, sendAndConfirmTransaction } = require("@solana/web3.js");
// const { connection, feeRecipient, mintaddy, program, programId, wallet, } = require("./config");
// const { getAccount, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } = require("@solana/spl-token");
// const { Buy_createTransactionInstruction, b, lx_global } = require("./utils");
// const { Buy_createTransactionInstruction, b, lx_global } = require("./utils");

import { Keypair, PublicKey, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
// import { connection, feeRecipient, IDL1, mintaddy, SELLSLIPPAGE, wallet } from "./config";
import { connection, provider,feeRecipient, IDL1, SELLSLIPPAGE, wallet } from "./config";
import { getAccount, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { Buy_createTransactionInstruction, b, fetchLiquidityPool, lx_global } from "./utils";
import BN from "bn.js";
import { createAssociatedTokenAccountInstruction } from "@solana/spl-token";
import { Program } from "@coral-xyz/anchor";
import * as buffer from 'buffer'



function decodeLiquidityPool(data) {
    if (!data || data.length < 32) {
        throw new Error("Invalid liquidity pool data");
    }

    // Convert the binary data into BigInt or numbers as per layout
    const virtualSolReserves = new BN(data.slice(0, 8), "le");
    const virtualTokenReserves = new BN(data.slice(8, 16), "le");
    const realTokenReserves = new BN(data.slice(16, 24), "le");
    const feeBasisPoints = new BN(data.slice(24, 32), "le");

    // Return as a structured object
    return {
        virtualSolReserves,
        virtualTokenReserves,
        realTokenReserves,
        feeBasisPoints,
    };
}
// const bs58 = require("bs58");
// const userPublickey = new PublicKey("GMjT1392P2XMgMwQJEvQFsjJrrFW6symXjerkUvzinLV");

async function buy(walletProvider, amount, mintaddy) {
    console.log("amount for sol", Number(amount) * 10 ** 6);

    console.log(walletProvider, "wallet Provider");
    const programId = new PublicKey("7jFsWYwonXMUWicDFkR7vfCudb8pm8feyzAi535DmsVh");

    console.log("mintaddy", mintaddy);
    // const buy_value = "0.1"; // Just for setting high slippage basically
    const tokenamt = Number(amount) * 10 ** 6; // Remaining token amount based on calling ts-node retrieve.ts

    const [S] = PublicKey.findProgramAddressSync(
        [Buffer.from("mint-authority")],
        programId
    );
    const [C] = PublicKey.findProgramAddressSync(
        [Buffer.from("bonding-curve"), mintaddy.toBuffer()],
        programId
    );

    const program = new Program(IDL1, programId, walletProvider);

    console.log("Mint authority: " + S.toBase58());
    console.log("Bonding curve: " + C.toBase58());

    const [O] = PublicKey.findProgramAddressSync(
        [Buffer.from("global")],
        programId
    );
    console.log(O, "Global PDA");

    let atains;
    const r = b(mintaddy, walletProvider.publicKey, false);
    let hasAta = false;
    try {
        const res = await getAccount(connection, r);
    } catch (error) {
        hasAta = true
        atains = Buy_createTransactionInstruction(
            walletProvider.publicKey,
            r,
            walletProvider.publicKey,
            mintaddy
        );
    }

    const a = new BN(Math.floor(1e9 * parseFloat(amount)));

    let o = {
        solAmount: a,
    };
    let buyTx
    if (hasAta) {

        buyTx = await program.methods
            .buy(
                new BN(tokenamt),
                o.solAmount.add(a.mul(new BN(Math.floor(10 * 999))).div(new BN(1e3)))
            )
            .accounts({
                global: O,
                feeRecipient: feeRecipient,
                mint: mintaddy,
                bondingCurve: C,
                associatedBondingCurve: b(mintaddy, C, true),
                associatedUser: r,
                user: walletProvider.publicKey,
                systemProgram: new PublicKey("11111111111111111111111111111111"),
                tokenProgram: new PublicKey(
                    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
                ),
                rent: new PublicKey("SysvarRent111111111111111111111111111111111"),
            })
            .preInstructions([atains])
            .transaction();
    } else {

        buyTx = await program.methods
            .buy(
                new BN(tokenamt),
                o.solAmount.add(a.mul(new BN(Math.floor(10 * 999))).div(new BN(1e3)))
            )
            .accounts({
                global: O,
                feeRecipient: feeRecipient,
                mint: mintaddy,
                bondingCurve: C,
                associatedBondingCurve: b(mintaddy, C, true),
                associatedUser: r,
                user: walletProvider.publicKey,
                systemProgram: new PublicKey("11111111111111111111111111111111"),
                tokenProgram: new PublicKey(
                    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
                ),
                rent: new PublicKey("SysvarRent111111111111111111111111111111111"),
            })
            // .preInstructions([atains])
            .transaction();
    }

    // Fetch recentBlockhash

    buyTx.feePayer = walletProvider.publicKey;
    buyTx.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;

    const signature = await walletProvider.signAndSendTransaction(buyTx);

    console.log("Transaction signature", signature);
    return signature
}


async function sell(walletProvider) {
    const totalvaluenum = 50;
    let sell_value = totalvaluenum.toString();
    const programId = new PublicKey("7jFsWYwonXMUWicDFkR7vfCudb8pm8feyzAi535DmsVh");
    const program = new Program(IDL1, programId, walletProvider);

    console.log("Owner balance: " + sell_value);

    const [S] = PublicKey.findProgramAddressSync(
        [Buffer.from("mint-authority")],
        programId
    );
    const [C] = PublicKey.findProgramAddressSync(
        [Buffer.from("bonding-curve"), mintaddy.toBuffer()],
        programId
    );

    console.log("Mint authority: " + S.toBase58());

    console.log("Bonding curve: " + C.toBase58());

    const B = b(mintaddy, C, !0);

    const MPL_TOKEN_METADATA_PROGRAM_ID =
        "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";

    const E = new PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID);
    const [O] = PublicKey.findProgramAddressSync(
        [Buffer.from("global")],
        programId
    );

    const r = b(mintaddy, walletProvider.publicKey, !1);

    let a = new BN(0);
    let v = 0;
    let j = SELLSLIPPAGE; // slippage
    let k = {
        feeBasisPoints: new BN(0),
    };

    async function sellQuote(e) {
        let liquidityPool = await fetchLiquidityPool(C, program);
        console.log(liquidityPool.data, "pool")
        const decodedPool = decodeLiquidityPool(liquidityPool.data);
        console.log(decodedPool, "Decoded Liquidity Pool", decodedPool.virtualSolReserves.toString(), decodedPool.virtualTokenReserves.toString());


        let y = (e) => e.mul(k.feeBasisPoints).div(new BN(1e4));
        // if (e.eq(new BN(0)) || !sellQuote) return new BN(0);

        let a = e
            .mul(decodedPool.virtualSolReserves)
            .div(decodedPool.virtualTokenReserves.add(e));

        let r = y(a);

        return a.sub(r);
    }

    let el = new BN(Math.floor(parseFloat(sell_value) || 0).toString()).mul(
        new BN("1000000")
    );

    a = await sellQuote(el);
    // console.log(el.toNumber(), a.toNumber())

    let total = a.sub(a.mul(new BN(Math.floor(10 * j))).div(new BN(1e3)));

    console.log(total.toString(), "total", el.toString(), "innnnnnnnnnnnnn");

    let sellTx = await program.methods
        .sell(el, total)
        .accounts({
            global: O,
            feeRecipient: feeRecipient,
            mint: mintaddy,
            bondingCurve: C,
            associatedBondingCurve: B,
            associatedUser: r,
            user: wallet.publicKey,
            systemProgram: new PublicKey("11111111111111111111111111111111"),
            tokenProgram: new PublicKey(
                "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            ),
            rent: new PublicKey("SysvarRent111111111111111111111111111111111"),
        })
        .transaction();
    console.log(sellTx, "sellTx")
    // Fetch recentBlockhash

    sellTx.feePayer = walletProvider.publicKey;
    sellTx.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;

    const signature = await walletProvider.signAndSendTransaction(sellTx);

    console.log("Transaction signature", signature);
}




 const TokenPriceCalculations = async (taddress, amount) => {
    try {
        console.log("token calculations",taddress)
        const tokenamt = tokenToSmallestUnit(parseInt(amount), 6)
        console.log("ammunt",tokenamt);

        window.Buffer = buffer.Buffer
      
        //console.log('connection', connection)

        const programId = new PublicKey(
            '7jFsWYwonXMUWicDFkR7vfCudb8pm8feyzAi535DmsVh',
        )
       
        const program = new Program(IDL1, programId, provider)
        const tokenAddress = new PublicKey(taddress)
        console.log("info-usessss",program,tokenAddress,programId)
                const data = await retrieveTokenInfo(program, programId, tokenAddress)
console.log("dataklklkl",data)
        //token price buy
        const tokenPriceInLamport =
            parseFloat(tokenamt * parseFloat(data?.virtualSolReserves)) /
            parseFloat(parseFloat(data?.virtualTokenReserves) - tokenamt)
        const tokenPriceInLamportSell =
            parseFloat(tokenamt * parseFloat(data?.virtualSolReserves)) /
            parseFloat(parseFloat(data?.virtualTokenReserves) + tokenamt)
        const tokenPriceInSol = convertScientificToDecimal(
            parseFloat(tokenPriceInLamport / 1000000000),
        )
        const tokenPriceInSolSell = convertScientificToDecimal(
            parseFloat(tokenPriceInLamportSell / 1000000000),
        )

        // token per 1 SOL calculations
        const consttokenPriceInLamport =
            parseFloat(1000000 * parseFloat(data?.virtualSolReserves)) /
            parseFloat(parseFloat(data?.virtualTokenReserves) + 1000000)
        const consttokenPriceInLamportSell =
            parseFloat(1000000 * parseFloat(data?.virtualSolReserves)) /
            parseFloat(parseFloat(data?.virtualTokenReserves) - 1000000)
        // console.log('token-price-in-lamport', tokenPriceInLamport)
        const consttokenPriceInSol = convertScientificToDecimal(
            parseFloat(consttokenPriceInLamport / 1000000000),
        )
        const consttokenPriceInSolSell = convertScientificToDecimal(
            parseFloat(consttokenPriceInLamportSell / 1000000000),
        )
        return {
            //tokenInfo: data,
            tokenPriceInSol: tokenPriceInSol,
            sellTokenPriceInSol: tokenPriceInSolSell,
            onetokenPriceInSol: consttokenPriceInSol,
            sellTokenPer1Sol: consttokenPriceInSolSell,
            tokenPer1Sol: 1 / parseFloat(consttokenPriceInSol),

            //solPer1Token:parseFloat(1/tokenAgainstSol)
        }
    } catch (error) {
        console.log('error while fetching sell token price', error)
    }
}

const reteriveTokenDetails = async (walletProvider, taddress) => {
    try {
        window.Buffer = buffer.Buffer
        console.log("provider",walletProvider);
        const programId = new PublicKey(
            '7jFsWYwonXMUWicDFkR7vfCudb8pm8feyzAi535DmsVh',
        )
        const program = new Program(IDL1, programId, provider)
        console.log("program",program.account.bondingCurve);
        const tokenAddress = new PublicKey(taddress)
        console.log("tokenAddress",tokenAddress);
        const [C] = PublicKey.findProgramAddressSync(
            [Buffer.from('bonding-curve'), tokenAddress.toBuffer()],
            programId,
        )
        console.log("c",C)
        

        const r = await program.account.bondingCurve.fetch(C)
        console.log("r",r)

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

        console.log('virtual rese', formattedOutput)
        return formattedOutput
    } catch (error) {
        console.log("error while retreving token details", error)
    }

}

 const retrieveTokenInfo = async (program, programId, mintaddy) => {
   
    window.Buffer = buffer.Buffer
    const [C] = PublicKey.findProgramAddressSync(
        [Buffer.from('bonding-curve'), mintaddy.toBuffer()],
        programId,
    )

    const r = await program.account.bondingCurve.fetch(C)
console.log("rrrrrr",r)
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

    console.log('virtual reseves', formattedOutput)
    return formattedOutput
}


function convertScientificToDecimal(scientificNotation) {
    // Convert scientific notation to string
    let scientificString = scientificNotation.toString()

    // Split the string into coefficient and exponent parts
    let parts = scientificString.toLowerCase().split('e')
    let coefficient = parts[0]
    let exponent = parseInt(parts[1], 10)

    // If there's no exponent, return the original scientific notation string
    if (!exponent) return scientificString

    // Adjust coefficient length to match the required precision
    let precision = Math.max(0, -exponent - coefficient.length + 2)
    let adjustedCoefficient = (
        exponent < 0
            ? '0.' + '0'.repeat(-exponent - 1) + coefficient.replace('.', '')
            : coefficient.slice(0, exponent + 1) +
              '.' +
              coefficient.slice(exponent + 1)
    ).replace(/\.?0+$/, '')

    // Return the adjusted coefficient with sign
    return (scientificNotation < 0 ? '-' : '') + adjustedCoefficient
}
function tokenToSmallestUnit(tokenAmount, decimals) {
    return tokenAmount * Math.pow(10, decimals)
}

export { buy, sell, reteriveTokenDetails,TokenPriceCalculations }