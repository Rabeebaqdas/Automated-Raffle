import React, { useEffect, useState } from 'react'
import { useWeb3Contract } from 'react-moralis'
import { abi, contractAddresses } from "../constants"
import { useMoralis } from 'react-moralis'
import { ethers } from "ethers"
import { useNotification } from 'web3uikit'
const LotteryEntrance = () => {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const [entranceFee, setEntranceFees] = useState("0")
    const [players, setPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const dispatch = useNotification()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const { runContractFunction: enterRaffle , isLoading ,isFetching } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee
    })
  
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {}
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {}
    })

    const { runContractFunction: getEnteranceFees } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEnteranceFees",
        params: {}
    })
    async function updateUi() {
        const fees = (await getEnteranceFees()).toString()
        const player = (await getNumberOfPlayers()).toString()
        const winner = await getRecentWinner()
        setRecentWinner(winner)
        setPlayers(player)
        setEntranceFees(fees)
        

    }
    const handleSuccess = async (tx) =>{
        await tx.wait(1)
        handleNotification(tx)
        updateUi()
    }

    const handleNotification = () =>{
        dispatch({
            type:"info",
            message:"Transaction Complete!",
            title:"Tx Notification",
            position:"topR",
            icon:"bell"
        })
    }

    const enter = async() =>{
        await enterRaffle({
            onSuccess: handleSuccess,
            onError:(error) => console.log(error)
        });
    }


    useEffect(() => {
        if (getEnteranceFees) {

          
            updateUi()
        }
    }, [isWeb3Enabled])
    return (
        <div className='p-5'>
            <h1 className='py-4 px-4 font-bold text-3xl'>Lottery</h1>
            {raffleAddress ? (
                
            <div>
                <button onClick={enter} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto" disabled = {isLoading || isFetching} >
                    {
                        isLoading || isFetching ?
                        <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        :
                        "Enter Raffle"
                    }
                </button>
           <div> Enterance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
           <div>Players : {players}</div>
           <div> Recent Winner : {recentWinner}</div>
        </div>  
        
            )
            :
            (<div>No Raffle Address Deteched</div>)                
            }
        </div>
    )
}

export default LotteryEntrance;