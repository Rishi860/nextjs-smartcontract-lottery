import { useMoralis } from "react-moralis";
import { useEffect } from "react"; // core react hook
// we are using it so that we dont have to re connect every time we reload

export default function Home() {
  // hooks are good for re-rendering our websites
  const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } = useMoralis(); // react hook to keep track of state in our application

  useEffect(() => {
    if(isWeb3Enabled) return
    if(typeof window !== "undefined"){
      if(window.localStorage.getItem("connected") === "injected"){
        enableWeb3();
      }
    }
    // enableWeb3()
  }, [isWeb3Enabled]); // blank dependancy array mean only one time run // no d array than run whenever something re renders

  useEffect(()=>{
    Moralis.onAccountChanged((account) => {
      console.log(`Account changes to ${account}`);
      if(account == null){
        window.localStorage.removeItem("connected");
        deactivateWeb3();
        console.log("NULL account found");
      }
    })
  }, [])

  return (
    <div>
      {account ? (
        <div>
          Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}
        </div>
      ) : (
        <button
          onClick={async () => {
            await enableWeb3();
            if(typeof window !== "undefined"){
              window.localStorage.setItem("connected", "injected");
            }
          }}
          disabled={isWeb3EnableLoading}
        >
          {" "}
          Connect{" "}
        </button>
      )}
    </div>
  );
}
