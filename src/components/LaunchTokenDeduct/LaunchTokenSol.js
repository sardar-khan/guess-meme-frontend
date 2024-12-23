import { SystemProgram, PublicKey, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useAppKitConnection } from '@reown/appkit-adapter-solana/react';
import { useAppKitProvider } from '@reown/appkit/react';
import { adminSolAddress, LaunchTokenSolValue } from '../../services/config';
import { toast } from 'react-toastify';
import {connection} from '../PlaceTrade/config'



const LaunchTokenSol = () => {
   // const { connection } = useAppKitConnection();
    const { walletProvider } = useAppKitProvider('solana');


    const handleLaunchToken = async (amount) => {


        console.log("amountsol", amount)
        try {
            console.log("Initiating SOL transfer...",connection);

            // Static recipient address
            const RECIPIENT_ADDRESS = new PublicKey(adminSolAddress);

            // Amount to send (0.03 SOL)
            const plusAmount = parseFloat(amount) + 0.03;
            console.log("LaunchTokenSolValue", LaunchTokenSolValue)


            const AMOUNT_TO_SEND = amount === undefined || null ? LaunchTokenSolValue * LAMPORTS_PER_SOL : plusAmount * LAMPORTS_PER_SOL;
            // const AMOUNT_TO_SEND = LaunchTokenSolValue * LAMPORTS_PER_SOL;
            console.log("AMOUNT_TO_SEND", AMOUNT_TO_SEND)
            // Check wallet balance
            const getBalanceWithRetry = async (connection, publicKey, retries = 3) => {
                for (let attempt = 0; attempt < retries; attempt++) {
                    try {
                        console.log("conneeee",connection,publicKey)
                        const bal = await connection.getBalance(publicKey);
                        console.log("balance",bal)
                        return bal
                    } catch (error) {
                        console.error(`Failed to fetch balance (Attempt ${attempt + 1}):`, error);
                        if (attempt === retries - 1) throw new Error("Failed to fetch balance after retries.");
                        await sleep(1000); // Retry after 1 second
                    }
                }
            };
            const balance = await getBalanceWithRetry(connection, walletProvider.publicKey);

            // const balance = await connection.getBalance(walletProvider.publicKey);
            if (balance < AMOUNT_TO_SEND) {
                toast.error("Insufficient balance in your wallet.");
                return false;
            }

            // Create transfer instruction
            const transferInstruction = SystemProgram.transfer({
                fromPubkey: walletProvider.publicKey,
                toPubkey: RECIPIENT_ADDRESS,
                lamports: AMOUNT_TO_SEND
            });

            // Create and send transaction
            const tx = new Transaction().add(transferInstruction);
            tx.feePayer = walletProvider.publicKey;

            // Get latest blockhash
            const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
            tx.recentBlockhash = blockhash;

            // Sign and send transaction
            const signedTx = await walletProvider.signTransaction(tx);
            const txHash = await connection.sendRawTransaction(signedTx.serialize());
            console.log("Transaction Hash:", txHash);

            // Enhanced transaction status checking
            const MAX_RETRIES = 10;
            for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
                try {
                    const { value: statuses } = await connection.getSignatureStatuses([txHash]);

                    console.log("Raw statuses:", JSON.stringify(statuses));

                    // Detailed logging of status
                    if (!statuses || statuses.length === 0) {
                        console.log(`Attempt ${attempt + 1}: No status found for transaction`);
                        await sleep(2000);
                        continue;
                    }

                    const status = statuses[0];

                    // More detailed status checking
                    if (!status) {
                        console.log(`Attempt ${attempt + 1}: Status is null`);
                        await sleep(2000);
                        continue;
                    }

                    console.log("Full status object:", JSON.stringify(status));

                    // Check for transaction success
                    if (status.confirmationStatus === 'confirmed' || status.confirmationStatus === 'finalized') {
                        console.log(`Transaction confirmed on attempt ${attempt + 1}`);
                        console.log(`Explorer Link: https://explorer.solana.com/tx/${txHash}?cluster=devnet`);
                        return true;
                    }

                    // Log any errors
                    if (status.err) {
                        console.error("Transaction error:", status.err);
                        toast.error(`Transaction failed: ${JSON.stringify(status.err)}`);
                        return false;
                    }

                    // Wait before next attempt
                    await sleep(2000);
                } catch (statusError) {
                    console.error(`Error checking transaction status (Attempt ${attempt + 1}):`, statusError);
                    await sleep(2000);
                }
            }

            // If we've exhausted retries
            toast.error("Failed to confirm transaction after multiple attempts");
            return false;

        } catch (error) {
            console.error("Error while transferring SOL:", error);
            toast.error(`Transaction Error: ${error.message}`);
            return false;
        }
    };

    return handleLaunchToken;
};

// Helper function to sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export default LaunchTokenSol;


// // LaunchTokenSol.js
// import { SystemProgram, PublicKey, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
// import { useAppKitConnection } from '@reown/appkit-adapter-solana/react';
// import { useAppKitProvider } from '@reown/appkit/react';
// import { adminSolAddress } from '../../services/config';
// import { toast } from 'react-toastify';

// // Helper function to sleep
// const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// const LaunchTokenSol = () => {
//     const { connection } = useAppKitConnection();
//     const { walletProvider } = useAppKitProvider('solana');

//     const handleLaunchToken = async () => {
//         try {
//             console.log("Initiating SOL transfer...");

//             // Static recipient address
//             const RECIPIENT_ADDRESS = new PublicKey(adminSolAddress);

//             // Amount to send (0.03 SOL)
//             const AMOUNT_TO_SEND = 0.03 * LAMPORTS_PER_SOL;

//             console.log("Connection:", connection);
//             console.log("Wallet Provider:", walletProvider);

//             // Check wallet balance
//             const balance = await connection.getBalance(walletProvider.publicKey);
//             if (balance < AMOUNT_TO_SEND) {
//                 toast.error("Insufficient balance in your wallet.");
//                 throw new Error('Not enough SOL in wallet to complete the transaction.');
//             }

//             // Create transfer instruction
//             const transferInstruction = SystemProgram.transfer({
//                 fromPubkey: walletProvider.publicKey,
//                 toPubkey: RECIPIENT_ADDRESS,
//                 lamports: AMOUNT_TO_SEND
//             });

//             // Create and send transaction
//             const tx = new Transaction().add(transferInstruction);
//             tx.feePayer = walletProvider.publicKey;
//             tx.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;

//             const txHash = await walletProvider.signAndSendTransaction(tx);
//             console.log("Transaction Hash:", txHash);

//             // Check transaction status
//             let txSuccess = false;
//             const START_TIME = new Date();

//             while (!txSuccess) {
//                 const { value: statuses } = await connection.getSignatureStatuses([txHash]);
//                 console.log("statusesstatusesstatuses", statuses)
//                 // if (!statuses || !statuses[0]) {
//                 //     console.error("No valid signature status found.");
//                 //     throw new Error('Failed to retrieve transaction signature status.');
//                 // }

//                 const status = statuses[0];

//                 // if (status.err) {
//                 //     console.error("Transaction error:", status.err);
//                 //     throw new Error(`Transaction failed: ${JSON.stringify(status.err)}`);
//                 // }

//                 if (status.confirmationStatus === 'confirmed' || status.confirmationStatus === 'finalized') {
//                     txSuccess = true;
//                     const endTime = new Date();
//                     const elapsed = (endTime.getTime() - START_TIME.getTime()) / 1000;
//                     console.log(`Transaction confirmed in ${elapsed} seconds.`);
//                     console.log(`Explorer Link: https://explorer.solana.com/tx/${txHash}?cluster=devnet`);
//                     return true; // Return success
//                 }

//                 // Retry after 2.5 seconds
//                 await sleep(2500);
//             }
//         } catch (error) {
//             console.error("Error while transferring SOL:", error);
//             // toast.error(`Transaction Error: ${error.message}`);
//             return false; // Return failure
//         }
//     };


//     return handleLaunchToken
// };

// export default LaunchTokenSol;
