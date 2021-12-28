import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// This is our governance contract
const voteModule = sdk.getVoteModule(
    "0x5ec9DAAe2E6451b7Cc4ACa71d95D5d1923164045"
);

// This is our ERC-20 contract
const tokenModule = sdk.getTokenModule(
    "0x2C93cB3e419D3AA383fD909B40b9bfAD7666f2E0"
);

(async () => {
    try {
        const amount = 420_000;

        // Create proposal to mint 420,000 new tokens to the treasury.

        await voteModule.propose(
            "Should the DAO mint an additional " + amount + " tokens into the treasury?",
            [
                {
                    // our nativeToken is ETH. nativeTokenValue is the amount of ETH
                    // we want to send in this proposal. In this case, we're sending
                    // 0 ETH. We're just minting new tokens to the treasury.
                    // So, set to 0.
                    nativeTokenValue: 0,
                    transactionData: tokenModule.contract.interface.encodeFunctionData(
                        // We are doing a mint! And we're minting to the
                        // voteModule, which is
                        // acting as our treasury.
                        "mint",
                        [
                            voteModule.address,
                            ethers.utils.parseUnits(amount.toString(), 18),
                        ]
                    ),
                    // Our token module that actually executes the mint.
                    toAddress: tokenModule.address
                }
            ]
        );
        console.log("✅ Successfully created proposal to mint tokens");
    } catch (error) {
        console.error("failed to create first proposal", error);
        process.exit(1);
    }

    try {
        const amount = 6_900;
        // Create proposal to transfer ourselves 6,900 tokens for being awesome
        await voteModule.propose(
            "Should the DAO transfer " +
            amount + " tokens from the treasury to " +
            process.env.WALLET_ADDRESS + " for being awesome?",
            [
                {
                    // Again we're sending ourselves 0 ETH. Just sending our own token.
                    nativeTokenValue: 0,
                    transactionData: tokenModule.contract.interface.encodeFunctionData(
                        // We're doing a transfer from the treasury to our wallet.
                        "transfer",
                        [
                            process.env.WALLET_ADDRESS,
                            ethers.utils.parseUnits(amount.toString(), 18)
                        ]
                    ),
                    toAddress: tokenModule.address,
                }
            ]
        );

        console.log(
            "✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!"
        );
    } catch (error) {
        console.error("failed to create second proposal", error);
    }
})();