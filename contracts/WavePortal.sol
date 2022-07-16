// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    constructor() {
        console.log("We are inside my WavePortal contract");
    }

    function wave() public {
        totalWaves += 1;
        console.log("%s has waved us", msg.sender);
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves.", totalWaves);
        return totalWaves;
    }

    function unwave() public {
        if (totalWaves >= 0) {
            totalWaves -= 1;
            console.log("%s has unwaved us", msg.sender);
        }
    }
}
