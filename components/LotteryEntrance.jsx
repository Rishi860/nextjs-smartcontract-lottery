// have a function to call lottery function // moralis has a hook called useWeb3Contract
import { useWeb3Contract } from "react-moralis";
import { abi, contractAddress } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function lotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  // let entranceFee = "";
  const [entranceFee, setEntranceFee] = useState("0"); // 0 initial value and setEntranceFee function to change the vlaue of var entranceFee
  const [numPlayer, setNumPlayers] = useState("0");
  const [recentWinner, setRecentWinner] = useState("0");
  const raffleAddress = chainId in contractAddress ? contractAddress[chainId][0] : null;

  const dispatch = useNotification();

  // these are the way to interact with our functions in a contract
  const {
    runContractFunction: enterRaffle,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });
  // we need to read entrance fees to our raffle so we use another hook

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  async function updateUI() {
    const entranceFeeFromCall = (await getEntranceFee()).toString();
    const numPlayerFromCall = (await getNumberOfPlayers()).toString();
    const recentWinnerFromCall = await getRecentWinner();
    setEntranceFee(entranceFeeFromCall);
    setNumPlayers(numPlayerFromCall);
    console.log(recentWinnerFromCall);
    setRecentWinner(recentWinnerFromCall);
  }
  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const handleSuccess = async function (tx) {
    await tx.wait(1);
    handleNewNotification(tx);
    updateUI();
  };

  const handleNewNotification = function (tx) {
    dispatch({
      type: "info",
      message: "transaction complete",
      title: "Tx Notification",
      position: "topR",
      icon: "bell",
    });
  };
  // this entrance fee var is empty on start and useEffect changes that but the change in the var doesnt cause a re-render
  // so we need to make this var a hook so that re-rendering can happen. This is where useState will come
  return (
    <div className="p-5">
      Hi from lottery entrance js
      {raffleAddress ? (
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded ml-auto"
            onClick={async function () {
              await enterRaffle({
                onSuccess: handleSuccess, // this onSuccess justs check wether a tx is sent to wallet or not
                onError: (error) => {
                  console.log(error);
                },
              });
            }}
            disabled={isFetching || isLoading}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              <div>Enter Raffle</div>
            )}
          </button>
          <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
          <div>Number of Players: {numPlayer}</div>
          <div>Recent Winner: {recentWinner}</div>
        </div>
      ) : (
        <div>No raffle Address detected</div>
      )}
    </div>
  );
}
