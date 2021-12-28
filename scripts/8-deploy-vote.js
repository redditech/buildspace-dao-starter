import sdk from "./1-initialize-sdk.js";

//Grab the app module address.
const appModule = sdk.getAppModule(
    "0xd348542F9f9f861DA6c401E57D6160a2cbBA1C72"
);

(async () => {
    try {
        const voteModule = await appModule.deployVoteModule({
            // Governance contract name
            name: "Weird Breakfast DAO Proposal",

            // location of governance token, the ERC-20 contract
            votingTokenAddress: "0x2C93cB3e419D3AA383fD909B40b9bfAD7666f2E0",

            // After a proposal is created, when can members start voting?
            // For now set this to immediately.
            proposalStartWaitTimeInSeconds: 0,

            // How long do members have to vote on a proposal when it's created?
            // Here, we set it to 24 hours (86400 seconds)
            proposalVotingTimeInSeconds: 24 * 60 * 60,

            // The quorum
            votingQuorumFraction: 0,
            
            // What's the minimum # of tokens a user needs to be allowd to create a proposal?
            // Currently set to 0, so no tokens are required for a user to be allowed
            // to create a proposal
            minimumNumberOfTokensNeededToPropose: "0",
        });

        console.log(
            "✅ Successfully deployed vote module, address:",
            voteModule.address,
        );
    } catch (err) {
        console.error("Failed to deploy vote module", err);
    }
})();