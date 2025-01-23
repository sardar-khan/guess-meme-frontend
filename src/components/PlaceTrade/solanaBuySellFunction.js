// const { Keypair, PublicKey, Transaction, sendAndConfirmTransaction } = require("@solana/web3.js");
// const { connection, feeRecipient, mintaddy, program, programId, wallet, } = require("./config");
// const { getAccount, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } = require("@solana/spl-token");
// const { Buy_createTransactionInstruction, b, lx_global } = require("./utils");
// const { Buy_createTransactionInstruction, b, lx_global } = require("./utils");

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
import { getBuySellInSolBuy, getBuySellInTokensBuy, retrieveTokenInfo } from "./TokenPriceCalculations";



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

async function buy(walletProvider, amount, mintaddy, maxSlippage, priorityFee) {
    console.log("amount for sol", Number(amount) * 10 ** 6);
    const buy_value = maxSlippage ? maxSlippage?.toString() : '10'
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

    const a = new BN(Math.floor(1e9 * parseFloat(buy_value)));

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


async function sellcoin(walletProvider, amount, mintaddy) {
    const totalvaluenum = 50;
    let sell_value = amount.toString();
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

const sell = async (
    walletProvider,
    tokenAmount,
    taddress,
    wallet,
    maxSlippage,
    priorityFree,
) => {
    try {
        window.Buffer = buffer.Buffer
        if (tokenAmount <= 0) {
            return {
                error: 'Please enter a valid amount!',
                data: null,
                success: false,
            }
        }
        if (!taddress) {
            return {
                error: 'Token address is missing!',
                data: null,
                success: false,
            }
        }
        const SELLSLIPPAGE = '10'
        const totalvaluenum = tokenAmount
        let sell_value = totalvaluenum.toString()

        console.log('Owner balance: ' + sell_value)
        const connection = new Connection(
            clusterApiUrl('devnet', true),
            'confirmed',
        )
        console.log('connection', connection)
        const mintaddy = new PublicKey(taddress)

        const programId = new PublicKey(
            '7jFsWYwonXMUWicDFkR7vfCudb8pm8feyzAi535DmsVh',
        )
        const feeRecipient = new PublicKey(
            'GTwY38pfmivyecwZtevaT14N3WDHMQebrrWjt2i48E29',
        )
        const provider = new AnchorProvider(connection, walletProvider, {
            commitment: 'confirmed',
        })
        const program = new Program(IDL1, programId, provider)

        const [S] = PublicKey.findProgramAddressSync(
            [Buffer.from('mint-authority')],
            programId,
        )
        const [C] = PublicKey.findProgramAddressSync(
            [Buffer.from('bonding-curve'), mintaddy.toBuffer()],
            programId,
        )

        console.log('Mint authority: ' + S.toBase58())

        console.log('Bonding curve: ' + C.toBase58())

        const B = b(mintaddy, C, !0)

        const MPL_TOKEN_METADATA_PROGRAM_ID =
            'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'

        const E = new PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID)
        const [O] = PublicKey.findProgramAddressSync(
            [Buffer.from('global')],
            programId,
        )

        const r = b(mintaddy, walletProvider.publicKey, !1)

        let a = new BN(0)
        let v = 0
        let j = SELLSLIPPAGE // slippage
        let k = {
            feeBasisPoints: new BN(0),
        }

        async function sellQuote(e) {
            let liquidityPool = await fetchLiquidityPool(C.toString(), program)

            let y = (e) => e.mul(k.feeBasisPoints).div(new BN(1e4))
            // if (e.eq(new BN(0)) || !sellQuote) return new BN(0);

            let a = e
                .mul(liquidityPool.virtualSolReserves)
                .div(liquidityPool.virtualTokenReserves.add(e))

            let r = y(a)

            return a.sub(r)
        }

        let el = new BN(Math.floor(parseFloat(sell_value) || 0).toString()).mul(
            new BN('1000000'),
        )

        a = await sellQuote(el)
        // console.log(el.toNumber(), a.toNumber())

        let total = a.sub(a.mul(new BN(Math.floor(10 * j))).div(new BN(1e3)))

        console.log(total)

        let sellTx = await program.methods
            .sell(el, total)
            .accounts({
                global: O,
                feeRecipient: feeRecipient,
                mint: mintaddy,
                bondingCurve: C,
                associatedBondingCurve: B,
                associatedUser: r,
                user: walletProvider.publicKey,
                systemProgram: new PublicKey(
                    '11111111111111111111111111111111',
                ),
                tokenProgram: new PublicKey(
                    'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
                ),
                rent: new PublicKey(
                    'SysvarRent111111111111111111111111111111111',
                ),
            })
            .transaction();
        sellTx.feePayer = walletProvider.publicKey;
        sellTx.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;

        const signature = await walletProvider.signAndSendTransaction(sellTx);
        // console.log('Sell transaction signature: ', sellTx,signature)
        return {
            error: false,
            data: signature,
            success: true,
        }
    } catch (error) {
        console.log('error while selling tokens', error)
        return {
            error: error.message,
            data: null,
            success: false,
        }
    }
}

async function fetchLiquidityPool1(pda, program) {
    try {
        const liquidityPool = await program.account.someAccountType.fetch(pda);
        return liquidityPool;
    } catch (error) {
        console.error('Error fetching liquidity pool:', error);
        throw new Error('Liquidity pool account not found or is not initialized.');
    }
}

const TokenPriceCalculations = async (taddress, amount, isSolToToken, isDeployed) => {
    // console.log("not-okay", taddress, amount, isSolToToken, isDeployed)
    window.Buffer = buffer.Buffer
    if (isDeployed) {

        const tokenAddress = new PublicKey(taddress)
        const programId = new PublicKey(
            '7jFsWYwonXMUWicDFkR7vfCudb8pm8feyzAi535DmsVh',
        )

        const program = new Program(IDL1, programId, provider)
        const data = await retrieveTokenInfo(program, programId, tokenAddress, isDeployed);

        const virtualSolReserves = BigInt(data?.virtualSolReserves);
        const virtualTokenReserves = BigInt(data?.virtualTokenReserves);

        const k = virtualSolReserves * virtualTokenReserves;

        if (isSolToToken) {
            const pricesInToken = getBuySellInTokensBuy(amount, k, virtualSolReserves, virtualTokenReserves)
            return pricesInToken
        } else {
            const PriceInSol = getBuySellInSolBuy(amount, k, virtualSolReserves, virtualTokenReserves);
            return PriceInSol;
        }
    } else {

        const data = await retrieveTokenInfo("", "", "", isDeployed);

        const virtualSolReserves = BigInt(data?.virtualSolReserves);
        const virtualTokenReserves = BigInt(data?.virtualTokenReserves);

        const k = virtualSolReserves * virtualTokenReserves;

        if (isSolToToken) {
            const pricesInToken = getBuySellInTokensBuy(amount, k, virtualSolReserves, virtualTokenReserves)
            return pricesInToken
        } else {
            const PriceInSol = getBuySellInSolBuy(amount, k, virtualSolReserves, virtualTokenReserves);
            return PriceInSol;
        }

    }
};

const PUMP_PROGRAM_ADDRESS = new PublicKey("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P");

function getBondingCurveAddress(mintAddress) {
    //const mintAddress = new PublicKey("5bDLmgxe2heUdosBWM1pYiKvfgT8kL2kbAa19bHwpump");
    const [bondingCurve] = PublicKey.findProgramAddressSync(
        [Buffer.from("bonding-curve"), mintAddress.toBytes()],
        PUMP_PROGRAM_ADDRESS
    );



    console.log("address", bondingCurve?.toBase58())
    return bondingCurve;
}
async function getBondingCurveInfo() {
    try {
        const mintAddress = "5bDLmgxe2heUdosBWM1pYiKvfgT8kL2kbAa19bHwpump";
        // Get bonding curve address
        const bondingCurveAddress = getBondingCurveAddress(new PublicKey(mintAddress));

        // Fetch account info
        const accountInfo = await connection.getAccountInfo(bondingCurveAddress);

        if (!accountInfo || !accountInfo.data) {
            throw new Error('Bonding curve account not found');
        }

        // Parse the account data
        const data = accountInfo.data;
        let offset = 8; // Skip discriminator

        // Helper function to read u64
        const readU64 = (buffer, offset) => {
            return BigInt('0x' + buffer.slice(offset, offset + 8).reverse().toString('hex')).toString();
        };

        // Parse all fields
        const virtualTokenReserves = readU64(data, offset);
        offset += 8;

        const virtualSolReserves = readU64(data, offset);
        offset += 8;

        const realTokenReserves = readU64(data, offset);
        offset += 8;

        const tokenTotalSupply = readU64(data, offset);
        offset += 8;

        // Calculate remaining and total tokens in millions/billions for readability
        const remainingTokens = Number(realTokenReserves) / 1_000_000; // Adjust divisor based on your token decimals
        const totalTokens = Number(tokenTotalSupply) / 1_000_000;

        return {
            virtualTokenReserves,
            virtualSolReserves,
            realTokenReserves,
            tokenTotalSupply,
            remainingTokens,
            totalTokens,
            complete: remainingTokens === 0
        };
    } catch (error) {
        console.error('Error fetching bonding curve info:', error);
        throw error;
    }
}

const getBondingCurveAddressOfPUMP = async () => {
    try {
        const PUMP_PROGRAM_ADDRESS = new PublicKey("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P");

        function getBondingCurveAddress(mintAddress) {
            const [bondingCurve] = PublicKey.findProgramAddressSync([Buffer.from("bonding-curve"), mintAddress.toBytes()], PUMP_PROGRAM_ADDRESS);
            return bondingCurve;
        }

        function getAssociatedBondingCurveAddress(bondingCurveAddress, mintAddress) {
            const [associatedBondingCurve] =
                PublicKey.findProgramAddressSync([bondingCurveAddress.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mintAddress.toBuffer()], ASSOCIATED_TOKEN_PROGRAM_ID);
            return associatedBondingCurve;
        }
    } catch (error) {

    }
}

const PUMPFUNTOKENINFO = async (program, programId, mintaddy, isDeployed) => {

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



const reteriveTokenDetails = async (walletProvider, taddress) => {
    try {
        window.Buffer = buffer.Buffer
        console.log("provider", walletProvider);
        const programId = new PublicKey(
            '7jFsWYwonXMUWicDFkR7vfCudb8pm8feyzAi535DmsVh',
        )
        const program = new Program(IDL1, programId, provider)
        console.log("program", program.account.bondingCurve);
        const tokenAddress = new PublicKey(taddress)
        console.log("tokenAddress", tokenAddress);
        const [C] = PublicKey.findProgramAddressSync(
            [Buffer.from('bonding-curve'), tokenAddress.toBuffer()],
            programId,
        )
        console.log("c", C)


        const r = await program.account.bondingCurve.fetch(C)
        console.log("r", r)

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





const calculateBondingCurveProgress = async (taddress, isDeployed) => {

    window.Buffer = buffer.Buffer

    const mintaddy = new PublicKey(taddress)
    const programId = new PublicKey(
        '7jFsWYwonXMUWicDFkR7vfCudb8pm8feyzAi535DmsVh',
    )

    const program = new Program(IDL1, programId, provider)
    const calculateBondingCurveProgress = (remainingTokens, initialRealTokenReserves) => {
        // Calculate the Bonding Curve Progress
        console.log("sakass", remainingTokens, initialRealTokenReserves)
        return ((initialRealTokenReserves - remainingTokens) * 100) / initialRealTokenReserves;
    };

    if (isDeployed) {
        window.Buffer = buffer.Buffer;
        const [C] = PublicKey.findProgramAddressSync(
            [Buffer.from('bonding-curve'), mintaddy.toBuffer()],
            programId,
        );

        const r = await program.account.bondingCurve.fetch(C);
        console.log("rrrrrr", r);

        const {
            virtualTokenReserves,
            virtualSolReserves,
            realTokenReserves,
            tokenTotalSupply,
            complete = false, // Default value if not present
        } = r;

        // Convert BN objects to strings
        const virtualTokenReservesStr = virtualTokenReserves.toString();
        const virtualSolReservesStr = virtualSolReserves.toString();
        const realTokenReservesStr = realTokenReserves.toString();
        const tokenTotalSupplyStr = tokenTotalSupply.toString();

        // Remaining tokens in normal units
        const remainingTokens = parseFloat(realTokenReservesStr / 1000000);
        const totalTokens = parseFloat(tokenTotalSupplyStr / 1000000);

        // Initial real token reserves based on your logic
        const initialRealTokenReserves = 800_000_000; // Fixed initial reserve from your requirements
        const bondingCurveProgress = calculateBondingCurveProgress(remainingTokens, initialRealTokenReserves);

        // Logging the specific properties in a formatted string
        const formattedOutput = {
            virtualTokenReserves: virtualTokenReservesStr,
            virtualSolReserves: virtualSolReservesStr,
            realTokenReserves: realTokenReservesStr,
            tokenTotalSupply: tokenTotalSupplyStr,
            remainingTokens: remainingTokens,
            totalTokens: totalTokens,
            bondingCurveProgress: bondingCurveProgress.toFixed(2), // Add bonding curve progress
            complete: complete,
        };

        console.log('virtual reserves', formattedOutput);
        return formattedOutput;
    } else {
        const virtualTokenReserves = "1200000000000000";
        const virtualSolReserves = "30000000000";
        const realTokenReserves = "800000000000000";
        const tokenTotalSupply = "1000000000000000";

        // Remaining tokens in normal units
        const remainingTokens = 800_000_000;
        const totalTokens = 1_000_000_000;

        // Initial real token reserves based on your logic
        const initialRealTokenReserves = 800_000_000; // Fixed initial reserve from your requirements
        const bondingCurveProgress = calculateBondingCurveProgress(remainingTokens, initialRealTokenReserves);

        // Logging the specific properties in a formatted string
        const formattedOutput = {
            virtualTokenReserves: virtualTokenReserves,
            virtualSolReserves: virtualSolReserves,
            realTokenReserves: realTokenReserves,
            tokenTotalSupply: tokenTotalSupply,
            remainingTokens: remainingTokens,
            totalTokens: totalTokens,
            bondingCurveProgress: bondingCurveProgress.toFixed(2), // Add bonding curve progress
            complete: false,
        };

        console.log('virtual reserves', formattedOutput);
        return formattedOutput;
    }
};



function convertScientificToDecimal(scientificNotation) {
    // Handle non-numeric or null inputs
    if (scientificNotation == null || isNaN(scientificNotation)) {
        return scientificNotation;
    }

    // Convert scientific notation to string
    let scientificString = scientificNotation.toString();

    // Split the string into coefficient and exponent parts
    let parts = scientificString.toLowerCase().split('e');
    let coefficient = parts[0];
    let exponent = parts[1] ? parseInt(parts[1], 10) : 0;

    // If there's no exponent, return the original scientific notation string
    if (!exponent) return scientificString;

    // Adjust coefficient length to match the required precision
    let precision = Math.max(0, -exponent - coefficient.length + 2);
    let adjustedCoefficient = (
        exponent < 0
            ? '0.' + '0'.repeat(Math.abs(exponent) - 1) + coefficient.replace('.', '')
            : coefficient.slice(0, exponent + 1) +
            (coefficient.length > exponent + 1 ?
                '.' + coefficient.slice(exponent + 1) : '')
    ).replace(/\.?0+$/, '');

    // Return the adjusted coefficient with sign
    return (scientificNotation < 0 ? '-' : '') + adjustedCoefficient;
}
// const convertScientificToDecimal = (num) => {
//     return num.toLocaleString('fullwide', { useGrouping: false });
// };
function tokenToSmallestUnit(tokenAmount, decimals) {
    return tokenAmount * Math.pow(10, decimals)
}


const reterieveUserSolanaBalance = async (walletProvider) => {
    try {
        const balance = await connection.getBalance(walletProvider.publicKey)
        return balance
    } catch (error) {
        console.log('error while fetching user balance', error)
    }
}


const launchSolToken = async (
    name,
    symbol,
    image,
    buyPercentage,
    amount,
    walletProvider,
    appconnection,
    setIsCreatingCoin

) => {
    console.log("props", name, symbol, image, buyPercentage, amount)
    // console.log('buyPercentage in func', buyPercentage, name, symbol, image)
    // if ((!name, !symbol, !image)) {
    //     return toast.error('Please fill out all the feilds')
    // }
    window.Buffer = buffer.Buffer

    //setLoading(true)

    try {

        // const connection = new web3.Connection(
        //     web3.clusterApiUrl('devnet', true),
        //     'confirmed',
        // )
        // console.log('connection', connection)
        const tokenamt = Number(amount) * 10 ** 6;
        const programId = new PublicKey(
            '7jFsWYwonXMUWicDFkR7vfCudb8pm8feyzAi535DmsVh',
        )
        // const provider = new AnchorProvider(connection, walletProvider, {
        //     commitment: 'confirmed',
        // })
        const program = new Program(IDL1, programId, walletProvider)

        // Constants for SOL and Token decimals
        const SOL_DECIMALS = 9;
        const TOKEN_DECIMALS = 6;

        const maxSlippage = '10'
        const buy_value = maxSlippage?.toString()

        // Compute scaling factors
        const solFactor = new BN(10).pow(new BN(SOL_DECIMALS)); // 10^9 for SOL
        const tokenFactor = new BN(10).pow(new BN(TOKEN_DECIMALS)); // 10^6 for Token

        // Adjusted token parameters
        const tokenTotalSupply = new BN(1000000000).mul(tokenFactor); // 1 billion tokens, adjusted for 6 decimals
        const tokenMargin = new BN(200000000).mul(tokenFactor); // Margin adjusted for token decimals
        const initialVirtualTokenReserves = tokenTotalSupply.add(tokenMargin);
        const initialRealTokenReserves = tokenTotalSupply.mul(new BN(80)).div(new BN(100)); // 80% of total supply

        const token_key = Keypair.generate();
        console.log("Token address (public key):", token_key.publicKey.toBase58());
        console.log("SOL Decimals:", SOL_DECIMALS);
        console.log("Token Decimals:", TOKEN_DECIMALS);
        console.log("Initial Real Token Reserves:", initialRealTokenReserves.toString());
        console.log("Initial Virtual Token Reserves:", initialVirtualTokenReserves.toString());

        // Derive addresses
        const [S] = PublicKey.findProgramAddressSync(
            [Buffer.from("mint-authority")],
            programId
        );
        console.log("Mint authority:", S.toBase58());

        const [C] = PublicKey.findProgramAddressSync(
            [Buffer.from("bonding-curve"), token_key.publicKey.toBuffer()],
            programId
        );
        console.log("Bonding curve:", C.toBase58());

        const B = b(token_key.publicKey, C, true);
        console.log("Associated Bonding Curve Address:", B.toBase58());

        const MPL_TOKEN_METADATA_PROGRAM_ID = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
        const E = new PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID);

        const [O] = PublicKey.findProgramAddressSync(
            [Buffer.from("global")],
            programId
        );

        const [D] = PublicKey.findProgramAddressSync(
            [Buffer.from("metadata"), E.toBuffer(), token_key.publicKey.toBuffer()],
            E
        );

        //console.log("Token Supply (adjusted for decimals):", tokenTotalSupply.toString(), max_supply * tokenFactor);
        // Create transaction
        const tx = await program.methods
            .create(
                name,
                symbol,
                image,
                100, // Adjust max_supply for token decimals
                initialRealTokenReserves,
                initialVirtualTokenReserves,
                tokenTotalSupply
            )
            .accounts({
                mint: token_key.publicKey,
                mintAuthority: S,
                bondingCurve: C,
                associatedBondingCurve: B,
                global: O,
                mplTokenMetadata: E,
                metadata: D,
                user: walletProvider.publicKey,
                systemProgram: new PublicKey("11111111111111111111111111111111"),
                tokenProgram: new PublicKey(
                    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
                ),
                rent: new PublicKey("SysvarRent111111111111111111111111111111111"),
            })
            .signers([token_key])
            .transaction();


        let atains;
        const r = b(token_key.publicKey, walletProvider.publicKey, false);
        let hasAta = false;
        try {
            const res = await getAccount(connection, r);
        } catch (error) {
            hasAta = true
            atains = Buy_createTransactionInstruction(
                walletProvider.publicKey,
                r,
                walletProvider.publicKey,
                token_key.publicKey
            );
        }

        const a = new BN(Math.floor(1e9 * parseFloat(buy_value)));

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
                    mint: token_key.publicKey,
                    bondingCurve: C,
                    associatedBondingCurve: b(token_key.publicKey, C, true),
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
                    mint: token_key.publicKey,
                    bondingCurve: C,
                    associatedBondingCurve: b(token_key.publicKey, C, true),
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





        const transaction = new web3.Transaction().add(tx);
        transaction.add(buyTx);
        transaction.feePayer = walletProvider.publicKey;
        transaction.recentBlockhash = (await appconnection.getLatestBlockhash('confirmed')).blockhash;
        transaction.partialSign(token_key);


        const signedTransaction = await walletProvider.signTransaction(transaction); // signTransaction for custom signing
        const signature = await connection.sendRawTransaction(signedTransaction.serialize());
        console.log("signature of token", signature);
        await connection.confirmTransaction(signature, 'confirmed');
        return {
            success: true,
            hash: signature,
            token_address: token_key.publicKey.toBase58(),
            bonding_curve: B.toBase58(),
        };
    } catch (err) {
        //setLoading(false)
        setIsCreatingCoin(false)
        console.log('Error while creating coin', err)
        if (err.message.includes('User rejected the request')) {
            toast.error('Transaction request was rejected by the user.')
        } else {
            toast.error('Something went wrong. Please try again.')
        }

        return {
            success: false,
            token_address: null,
            tx_hash: null,
            bonding_curve: null,
        }
    }
}

export { buy, launchSolToken, getBondingCurveAddress, getBondingCurveInfo, calculateBondingCurveProgress, sell, reteriveTokenDetails, TokenPriceCalculations, reterieveUserSolanaBalance }