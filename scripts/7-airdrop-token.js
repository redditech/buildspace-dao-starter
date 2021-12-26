import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// Address of the ERC-1155 membership NFT contract
const bundleDropModule = sdk.getBundleDropModule(
    "0x7499b893FD8A2f6d74C05770E65F1344d01605C0"
);

// Address of the ERC-20 token contract
const tokenModule = sdk.getTokenModule(
    "0x2C93cB3e419D3AA383fD909B40b9bfAD7666f2E0"
);

    (async () => {
        try {
            //Grab all the addresses of people who own our membership NFT,
            // which has a tokenId of 0.
            const walletAddresses = await bundleDropModule.getAllClaimerAddresses("0");

            if (walletAddresses.length === 0) {
                console.log(
                    "NO NFTs have been claimed yet, maybe get some friends to claim your free NFTs!",
                );

                process.exit(0);
            }

            // Loop through the array of addresses.
            const airdropTargets = walletAddresses.map((address) => {
                // Pick a random # between 1000 and 10000.
                const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
                console.log("✅ Going to airdrop", randomAmount, "tokens to", address);

                // Set up the target.
                const airdropTarget = {
                    address,
                    // Remember, we need 18 decimal places!
                    amount : ethers.utils.parseUnits(randomAmount.toString(), 18)
                };

                return airdropTarget;
            });

            // Call transferBatch on all our airdrop targets
            console.log("🌈 Starting airdrop...");
            await tokenModule.transferBatch(airdropTargets);
            console.log("✅ Successfully airdropped tokens to all the holders of the NFT!");
        } catch (err) {
            console.error("Failed to airdrop tokens", ert);
        }
    })();