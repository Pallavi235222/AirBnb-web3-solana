import * as anchor from '@project-serum/anchor'
import { useEffect, useMemo, useState} from 'react'
import { AIRBNB_PROGRAM_PUBKEY } from '../constants/index';
import airbnbIDL from '../constants/airbnb.json'
import { SystemProgram } from '@solana/web3.js';
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey'
import { useAnchorWallet, useConnection, useWallet} from '@solana/wallet-adapter-react'
import { authorFilter } from '../utils'
import { PublicKey } from '@solana/web3.js';
import { set } from 'date-fns'
import { tr} from 'date-fns/locale'

export const useAirbnb = () => {

    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const  anchorWallet  = useAnchorWallet();

    const [initialized, setInitialized] = useState(false);
    const[transactionPending, setTransactionPending] = useState(false);

    const program = useMemo(()=> {
        if(anchorWallet) {
            const provider = new anchor.AnchorProvider(anchorWallet, anchor.AnchorProvider.defaultOptions())

            return new anchor.Program(airbnbIDL, AIRBNB_PROGRAM_PUBKEY, provider)
        }
    }, [connection, anchorWallet])

    // When we load app we want to get All of the accounts
    //  First check if there is a userProfile account exists
    // If exists load all AIRBNB ACCOUNTS
    // DOES NOT exist, intializeUser

    useEffect(() => {
        const start = async  () => {
            if(program && publicKey && !transactionPending) {
                try{
                    console.log("tryblock")
                    const [profilePda, profileBump] = await findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
                    const profileAccount = await program.account.userProfile.fetch(profilePda)
                    console.log("tryblock 2")
                    
                    if(profileAccount) {
                        setInitialized(true);
                        console.log("LOAD AIRBNBS");
                    } else {
                        setInitialized(false)
                        console.log("error if")
                    }
                }catch(error){
                    console.log(error)
                    console.log("error 2")
                }
            }
        }

        start()
    }, [publicKey, program, transactionPending])

    const initializeUser = async () => {
        if(program && publicKey) {
            try{
                setTransactionPending(true)
                const [profilePda] =findProgramAddressSync([utf8.encode ('USER_STATE'), publicKey.toBuffer()], program.programId)

                const tx = await program.methods
                .initializeUser()
                .account({
                    userProfile: profilePda,
                    authority: publicKey,
                    systemProgram: SystemProgram.programId,
                },)
                .rpc()
                setInitialized(true)
                console.log("no error");
            }catch (err) {
                console.log(err)
                console.log("error 2")
                
            } finally {
                setTransactionPending(false)
            }
        }
    }
    return{initialized, initializeUser}
}
