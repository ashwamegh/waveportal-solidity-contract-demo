// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    /**
        This is a solidity event which will emit the new waves with the details needed
     */
    event NewWave(address indexed from, uint256 timestamp, string message);

    /**
     * A struct is basically a custom datatype where we can customize what we want to hold inside it.
     * Here we are declaring a Struct for the structure for a Wave
     */
    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    /*
     * Declaring a variable waves that lets me store an array of structs.
     * This is what lets me hold all the waves anyone ever sends to me!
     */
    Wave[] waves;

    constructor() {
        console.log("Taking you inside WavePortal contract");
    }

    /**
     * This function requires a message to be sent by the user who are invoking this
     */
    function wave(string memory _message) public {
        totalWaves += 1;
        console.log("%s has waved us w/ message %s", msg.sender, _message);

        // Pushing the new wave inside our waves []
        waves.push(Wave(msg.sender, _message, block.timestamp));

        emit NewWave(msg.sender, block.timestamp, _message);
    }

    /*
     * This function will return the struct array, waves, to us.
     * This will make it easy to retrieve the waves from our website!
     */
    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves.", totalWaves);
        return totalWaves;
    }
}
