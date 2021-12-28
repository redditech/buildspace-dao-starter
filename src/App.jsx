import {ethers} from "ethers";

import { useEffect, useMemo, useState } from "react";

// import thirdweb
import { useWeb3 } from "@3rdweb/hooks";

import { ThirdwebSDK } from "@3rdweb/sdk";

// We instantiate the sdk on Rinkeby.
const sdk = new ThirdwebSDK("rinkeby");

// We can grab a reference to our ERC-1155 contract
const bundleDropModule = sdk.getBundleDropModule(
  "0x7499b893FD8A2f6d74C05770E65F1344d01605C0"
);

// get token address
const tokenModule = sdk.getTokenModule(
  "0x2C93cB3e419D3AA383fD909B40b9bfAD7666f2E0"
);


const App = () => {
  // Use the connectWallet hook thirdweb gives us
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address:", address)

  // The signer is required to sign transactions on the blockchain.
  // Without it we can only read data, not write.
  const signer = provider ? provider.getSigner() : undefined;

  // State variable for us to know if user has our NFT.
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

  // isClaiming lets us easily keep a loading state whiel the NFT is minting
  const [isClaiming, setIsClaiming] = useState(false);

  // Holds the amount of token each member has in state
  const [memberTokenAmounts, setMemberTokenAmounts] = useState({});
  // The array holding all of our member addresses
  const [memberAddresses, setMemberAddresses] = useState([]);

  // A fancy function to shorten someone's wallet address, no need to show the whole thing.
  const shortenAddress = (str) => {
    return str.substring(0,6) + "..." + str.substring(str.length -4);
  };

  // This useEffect grabs all the addresses of our members holding the NFT.
  useEffect(() => {
    if (!hasClaimedNFT){
      return;
    }

    // Just like we did with 7-airdrop-token.js file, grab the users who hold
    // our NFT with tokenId 0
    bundleDropModule
      .getAllClaimerAddresses("0")
      .then((addresses) => {
        console.log("🚀 Members addresses", addresses);
        setMemberAddresses(addresses);
      })
      .catch((err) => {
        console.error("failed to get member list", err);
      });
  }, [hasClaimedNFT]);

  // This useEffect grabs the # of tokens each member holds.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // Grab all the balances
    tokenModule
      .getAllHolderBalances()
      .then((amounts) => {
        console.log("👜 Amounts", amounts);
        setMemberTokenAmounts(amounts);
      })
      .catch((err) => {
        console.error("failed to get token amounts", err);
      });
  }, [hasClaimedNFT])

  // Now, we combine the memberAddresses and memberTokenAmounts into a single array
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(
          // If the address isn't in memmberTokenAmounts, it means they don't
          // hold any of our token
          memberTokenAmounts[address] || 0,
        )
      }
    })
  }, [memberAddresses, memberTokenAmounts]);

  // interaction useEffect
  useEffect(() => {
    // We pass the signer to the sdk, which enables us to interact with
    // our deployed contract!
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  useEffect(() => {
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
      .catch((error) => {
        setHasClaimedNFT(false);
        console.error("failed to nft balance", error);
      });

  }, [address]);

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

  // If the user has already claimed their membership NFT!
  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>🍪Weird Breakfasts DAO Member Page</h1>
        <p>Congratulations for being a member, what weird breakfast have you had lately?</p>
        <div>
          <div>
            <h2>Members List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

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
