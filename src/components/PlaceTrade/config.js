import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Keypair, Connection, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import IDL1 from "./solIdl.json"; // Ensure the JSON file is accessible in your build

const programId = new PublicKey(
    "7jFsWYwonXMUWicDFkR7vfCudb8pm8feyzAi535DmsVh"
);

const RPC_URL = "https://api.devnet.solana.com";
const connection = new Connection(RPC_URL, "confirmed");

const feeRecipient = new PublicKey(
    "GTwY38pfmivyecwZtevaT14N3WDHMQebrrWjt2i48E29"
);

const SELLSLIPPAGE = 50;

const mintaddy = new PublicKey(
    "qVsZ9LG4pp2cKRuCDkXrL3RDZPGFK6vLyZUGSQQJ2Uj"
);

// Replace with your private key
const DEV_KEY = "4Suo836P86rZ1n3ZMdCXn5R7YEerQg5D3s862WsdatJYdccPsPmEr1TYuqfsJqVrqF8HAbBdxbaYVqXfWCcgXeKo";

// Create a Keypair from the secret key
const keypair = Keypair.fromSecretKey(bs58.decode(DEV_KEY));

// Implement a wallet that provides a `publicKey` and `signTransaction` method
const wallet = {
    publicKey: keypair.publicKey,
    signTransaction: async (tx) => {
        tx.partialSign(keypair);
        return tx;
    },
    signAllTransactions: async (txs) => {
        txs.forEach((tx) => tx.partialSign(keypair));
        return txs;
    },
};

const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
});

const program = new Program(IDL1, programId, provider);

export {
    programId,
    connection,
    feeRecipient,
    SELLSLIPPAGE,
    mintaddy,
    wallet,
    provider,
    program,
};
