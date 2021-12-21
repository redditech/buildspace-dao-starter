import {useEffect, useMemo, useState} from "react";

// import thirdweb
import {useWeb3} from "@3rdweb/hooks";

import { ThirdwebSDK } from "@3rdweb/sdk";

// We instantiate the sdk on Rinkeby.
const sdk = new ThirdwebSDK("rinkeby");

// We can grab a reference to our ERC-1155 contract
const bundleDropModule = sdk.getBundleDropModule(
  "0x7499b893FD8A2f6d74C05770E65F1344d01605C0"
)

const App = () => {
  // Use the connectWallet hook thirdweb gives us
  const {connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address:", address)

  // The signer is required to sign transactions on the blockchain.
  // Without it we can only read data, not write.
  const signer = provider ? provider.getSigner() : undefined;

  // State variable for us to know if user has our NFT.
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

  // isClaiming lets us easily keep a loading state whiel the NFT is minting
  const [isClaiming, setIsClaiming] = useState(false);

  // interaction useEffect
  useEffect(() => {
    // We pass the signer to the sdk, which enables us to interact with
    // our deployed contract!
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  useEffect(()=>{
    // If they don't have a connected wallet, exit
    if (!address) {
      return;
    }

    //Check if the user has the NFT by using bundleDropModule.balanceOf
    return bundleDropModule
      .balanceOf(address, "0")
      .then((balance) => {
        // If balance is greater than 0, they have our NFT!
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 this user has a membership NFT!");
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.")
        }
      })
      .catch((error)=> {
        setHasClaimedNFT(false);
        console.error("failed to nft balance", error);
      });

  },[address]);

  // This is the case where the user hasn't connected their wallet
  // to your web app. Let them call connectWallet.

  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to Weird Breakfasts DAO</h1>
        <button onClick={() => connectWallet("injected")} className="btn-hero">
          Connect your wallet
        </button>
      </div>
    );
  }

  // This is the case where we have the user's address
  // which means they've connected their wallet to our site

  const mintNft = () => {
    setIsClaiming(true);
    // Call bundleDropModule.claim("0", 1) to mint NFT to user's wallet.
    bundleDropModule
    .claim("0", 1)
    .catch((err) => {
      console.error("failed to claim", err);
      setIsClaiming(false);
    })
    .finally(() => {
      // Stop loading state
      setIsClaiming(false);
      // Set claim state.
      setHasClaimedNFT(true);
      // Show user their fancy new NFT!
      console.log(`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`
      );
    });
  }

  return (
    <div className="landing">
      <h1>👀 Have you minted your weird breakfast ingredients NFT yet?  </h1>
      <button
        disabled={isClaiming}
        onClick={() => mintNft()}
      >{isClaiming ? "Minting..." : "Mint your NFT (FREE)"}</button>
    </div>
  );
};

export default App;
