import { createContext, useContext, useEffect, useState } from "react";
import { fetchUsdPrice, fetchUsdPriceEth } from "../utils/helper";

const WalletContext = createContext(undefined)

export const WalletApi = ({ children }) => {

    const [block_chain, setBlock_chain] = useState(localStorage.getItem('blockchain'))
    const [solInUsd, setSolInUsd] = useState(undefined)
    const [ethInUsd, setEthInUsd] = useState(undefined)
    const fetchSolPriceInUsd = async () => {
        try {
            const priceInUsd = await fetchUsdPrice();
            setSolInUsd(priceInUsd);

        } catch (error) {
            console.log("error in fetching sol price in usd:", error)
        }
    }

    const fetchEthPriceInUsd = async () => {
        try {
             const priceInUsd = await fetchUsdPriceEth();
            setEthInUsd(priceInUsd);

        } catch (error) {
            console.log("error in fetching eth price in usd:", error)
        }
    }

    useEffect(() => {
        const currentBlockChain = localStorage.getItem('blockchain')
        if (currentBlockChain === 'SOL') {
            fetchSolPriceInUsd()
        } else {
            fetchEthPriceInUsd()
        }

        setBlock_chain(currentBlockChain)

    }, [block_chain, localStorage.getItem('blockchain')])

    return (
        <WalletContext.Provider value={{ block_chain, setBlock_chain,solInUsd, ethInUsd}}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWalletContext = () => useContext(WalletContext);


export default WalletContext;