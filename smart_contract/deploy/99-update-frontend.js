const { ethers, network } = require("hardhat")
const fs = require("fs")
    const FRONTEND_ADDRESSES_FILE = "../client/src/constants/contractAddress.json";
    const FRONTEND_ABI_FILE = "../client/src/constants/abi.json";
    
module.exports = async function(){
    if(process.env.UPDATE_FRONTEND){
        console.log("updating Frontend....")
        updateContractAddress()
        updateAbi()
        console.log("Frontend updated!")
    }
}

async function updateContractAddress () {
    const raffle = await ethers.getContract("Raffle")
    const chainId = network.config.chainId.toString()
    const currentAddress = JSON.parse(fs.readFileSync(FRONTEND_ADDRESSES_FILE,"utf-8"))
    if(chainId in currentAddress){
        if(!currentAddress[chainId].includes(raffle.address)){
            currentAddress[chainId].push(raffle.address)
        }
    }
    else{
        currentAddress[chainId] = [raffle.address]
    }
    fs.writeFileSync(FRONTEND_ADDRESSES_FILE,JSON.stringify(currentAddress))
}

const updateAbi = async() => {
    const raffle  = await ethers.getContract("Raffle")
    fs.writeFileSync(FRONTEND_ABI_FILE, raffle.interface.format(ethers.utils.FormatTypes.json))
}
module.exports.tags = ["all", "frontend"]