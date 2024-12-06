import { toast } from 'react-toastify';
import { parseEther } from 'viem';
import { adminTokenAddress } from '../../utils/api';

const LaunchTokenPolygon = (address, sendTransaction, balance) => {
    return async () => {
        try {
            const adminAddress = await adminTokenAddress();

            if (!adminAddress?.address) {
                toast.error("Something went wrong, please try again!");
                return false;
            }

            const userBalance = balance ? parseFloat(balance) : 0;
            console.log("userBalance", userBalance)
            if (userBalance < 0.05) {
                toast.error("Insufficient balance in wallet!");
                return false;
            }

            const txResponse = await sendTransaction({
                to: adminAddress.address,
                value: parseEther("0.05"),
            });
            console.log("txt-respnse", txResponse);

            if (txResponse) {
                toast.success("Transaction Successful!");
                return true;
            }

            return false;
        } catch (error) {
            console.error("Error while transferring ETH:", error);
            toast.error(`Transaction Error: ${error.message}`);
            return false;
        }
    };
};

export default LaunchTokenPolygon;