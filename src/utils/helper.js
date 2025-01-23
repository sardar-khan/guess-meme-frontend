export const selectedName = (blockchainType, isSoltoToken,tokenName) => {
    if (blockchainType === "ETH") {
        return isSoltoToken ? "ETH" :  tokenName ;
    } else {
        return isSoltoToken ? "SOL" :  tokenName;
    }
}

