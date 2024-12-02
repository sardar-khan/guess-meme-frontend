// handleLaunchToken.js
import { SystemProgram, PublicKey, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useAppKitConnection } from '@reown/appkit-adapter-solana/react';
import { useAppKitProvider } from '@reown/appkit/react';
import { adminSolAddress } from '../../services/config';
import { toast } from 'react-toastify';

// Helper function to sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const LaunchTokenEth = () => {
    const { connection } = useAppKitConnection();
    const { walletProvider } = useAppKitProvider('solana');

    const handleLaunchToken = async () => {
        try {
            console.log("Initiating SOL transfer...");

            // Static recipient address
            const RECIPIENT_ADDRESS = new PublicKey(adminSolAddress);

            // Amount to send (0.03 SOL)
            const AMOUNT_TO_SEND = 0.03 * LAMPORTS_PER_SOL;

            console.log("Connection:", connection);
            console.log("Wallet Provider:", walletProvider);

            // Check wallet balance
            const balance = await connection.getBalance(walletProvider.publicKey);
            if (balance < AMOUNT_TO_SEND) {
                toast.error("Insufficient balance in your wallet.");
                throw new Error('Not enough SOL in wallet to complete the transaction.');
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
            tx.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;

            const txHash = await walletProvider.signAndSendTransaction(tx);
            console.log("Transaction Hash:", txHash);

            // Check transaction status
            let txSuccess = false;
            const START_TIME = new Date();

            while (!txSuccess) {
                const { value: statuses } = await connection.getSignatureStatuses([txHash]);
                if (!statuses || !statuses[0]) {
                    console.error("No valid signature status found.");
                    throw new Error('Failed to retrieve transaction signature status.');
                }

                const status = statuses[0];

                if (status.err) {
                    console.error("Transaction error:", status.err);
                    throw new Error(`Transaction failed: ${JSON.stringify(status.err)}`);
                }

                if (status.confirmationStatus === 'confirmed' || status.confirmationStatus === 'finalized') {
                    txSuccess = true;
                    const endTime = new Date();
                    const elapsed = (endTime.getTime() - START_TIME.getTime()) / 1000;
                    console.log(`Transaction confirmed in ${elapsed} seconds.`);
                    console.log(`Explorer Link: https://explorer.solana.com/tx/${txHash}?cluster=devnet`);
                    return true; // Return success
                }

                // Retry after 2.5 seconds
                await sleep(2500);
            }
        } catch (error) {
            console.error("Error while transferring SOL:", error);
            toast.error(`Transaction Error: ${error.message}`);
            return false; // Return failure
        }
    };


    return handleLaunchToken
    
};

export default LaunchTokenEth;
