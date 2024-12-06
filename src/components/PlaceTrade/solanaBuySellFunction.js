// const { Keypair, PublicKey, Transaction, sendAndConfirmTransaction } = require("@solana/web3.js");
// const { connection, feeRecipient, mintaddy, program, programId, wallet, } = require("./config");
// const { getAccount, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } = require("@solana/spl-token");
// const { Buy_createTransactionInstruction, b, lx_global } = require("./utils");
// const { Buy_createTransactionInstruction, b, lx_global } = require("./utils");

import { Keypair, PublicKey, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
// import { connection, feeRecipient, IDL1, mintaddy, SELLSLIPPAGE, wallet } from "./config";
import { connection, feeRecipient, IDL1, SELLSLIPPAGE, wallet } from "./config";
import { getAccount, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { Buy_createTransactionInstruction, b, fetchLiquidityPool, lx_global } from "./utils";
import BN from "bn.js";
import { createAssociatedTokenAccountInstruction } from "@solana/spl-token";
import { Program } from "@coral-xyz/anchor";



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



export { buy, sell }