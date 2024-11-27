import { useState } from "react";
import { useParams } from "react-router-dom";
import ethImg from "../../assets/icons/eth.png";
import solImg from "../../assets/icons/sol.webp";
import { BuyToken } from "../../utils/api";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { fetchTrades } from "../../features/tradesSlice";
import {
  buyTokensOnBlockchain,
  sellTokensOnBlockchain,
} from "./ether-trade-utils";

// eslint-disable-next-line react/prop-types
const PlaceTrade = ({ coinData }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [showSOGs, setShowSOGs] = useState(false);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tradeType, setTradeType] = useState("buy"); // Default trade type is "buy"

  const blockchainType = localStorage.getItem("blockchain") || "ETH"; // Default to ETH if not set

  const handleSwitchClick = () => {
    setShowSOGs(!showSOGs);
  };

  const handleTrade = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsLoading(true);

    try {
      if (blockchainType === "ETH") {
        const tokenAddress = '0x76148Cd0a2e51C54B2950a23Dd18aFDF98239e4F';
        // const tokenAddress = coinData?.token_address;

        if (!tokenAddress) {
          throw new Error("Token address is not available");
        }

        let response;

        if (tradeType === "buy") {
          response = await buyTokensOnBlockchain(tokenAddress, amount);
        } else if (tradeType === "sell") {
          response = await sellTokensOnBlockchain(tokenAddress, amount);
        }

        if (response?.success) {
          toast.success(
            `${tradeType === "buy" ? "Buy" : "Sell"} transaction successful`
          );

          // Update backend after successful blockchain transaction
          const apiResponse = await BuyToken({
            account_type: blockchainType.toLowerCase(),
            amount: parseFloat(amount),
            token_amount: 1,
            token_id: id,
            type: tradeType,
          });

          if (apiResponse?.status === 201) {
            toast.success(
              `${tradeType === "buy" ? "Buy" : "Sell"} saved successfully`
            );
            dispatch(fetchTrades(id)); // Fetch updated trades
          } else {
            throw new Error(
              `Failed to record ${tradeType} trade in the backend`
            );
          }
        } else {
          throw new Error(
            response?.error || `Failed to ${tradeType} tokens on blockchain`
          );
        }
      } else {
        // Non-ETH blockchain logic
        const apiResponse = await BuyToken({
          account_type: blockchainType.toLowerCase(),
          amount: parseFloat(amount),
          token_amount: 1,
          token_id: id,
          type: tradeType,
        });

        if (apiResponse?.status === 201) {
          toast.success(`${tradeType === "buy" ? "Buy" : "Sell"} successful`);
          dispatch(fetchTrades(id));
        } else {
          throw new Error(`Failed to ${tradeType} tokens`);
        }
      }
    } catch (error) {
      toast.error(error.message || `Error placing ${tradeType} trade`);
      console.error(`Error during ${tradeType}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border flex justify-center items-center w-full ">
      <div className="relative w-full border-t-[1px] border-t-[#fff] border-l-[5px] border-l-[#fff] border-r-[2px] border-r-[#353535] border-b-[2px] border-b-[#353535]">
        <div className="absolute top-0 left-0 h-[5px] w-full bg-white"></div>
        <div className="secondary-bg p-[14px]">
          <div className="h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]">
            <div className="h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]">
              <div className="w-full flex flex-col pb-4 pt-2">
                <div className="rounded">
                  <div className="flex gap-1 px-3">
                    <button
                      className={`text-[16px] SegoeUi font-normal text-left w-full px-3 py-2 rounded ${
                        tradeType === "buy"
                          ? "bg-[#7539F4] text-white border-2 border-[#ffffff]"
                          : "bg-[#5F16BC] text-white"
                      }`}
                      onClick={() => setTradeType("buy")}
                    >
                      Buy
                    </button>
                    <button
                      className={`text-[16px] SegoeUi font-normal text-left w-full px-3 py-2 rounded ${
                        tradeType === "sell"
                          ? "bg-[#7539F4] text-white border-2 border-[#ffffff]"
                          : "bg-[#5F16BC] text-white"
                      }`}
                      onClick={() => setTradeType("sell")}
                    >
                      Sell
                    </button>
                  </div>

                  <div className="flex justify-between gap-3 px-3 pt-[35px]">
                    <span
                      className="SegoeUi bg-[#4E496E] px-2 py-1 rounded text-xs text-[#9CA3AF] font-semibold cursor-pointer"
                      onClick={handleSwitchClick}
                    >
                      {showSOGs ? "Switch to ETH" : "Switch to SOL"}
                    </span>
                    <span className="SegoeUi bg-[#4E496E] px-2 py-1 rounded text-xs text-[#9CA3AF] font-semibold cursor-pointer">
                      Set max slippage
                    </span>
                  </div>

                  <div className="flex justify-between gap-3 px-3 pt-[15px]">
                    {!showSOGs && (
                      <div className="w-full Inter">
                        <div className="w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]">
                          <div className="flex w-full justify-between border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]">
                            <input
                              type="number"
                              name="amount"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              className="w-full px-2 py-3 pr-4"
                            />
                            <div className="w-fit flex items-center gap-1 bg-white">
                              <span className="text-black font-semibold text-sm SegoeUi">
                                {blockchainType === "ETH" ? "ETH" : "SOL"}
                              </span>
                              <img
                                src={blockchainType === "ETH" ? ethImg : solImg}
                                className="w-[30px] mr-5"
                                alt={blockchainType === "ETH" ? "ETH" : "SOL"}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  className="themeBtn Inter w-fit mt-5 mx-auto"
                  onClick={handleTrade}
                  disabled={isLoading}
                >
                  <span>{isLoading ? "Processing..." : "Trade"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceTrade;
