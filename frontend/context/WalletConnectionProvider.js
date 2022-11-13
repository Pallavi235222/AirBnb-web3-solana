import { ConnectionProvider, WalletProvider} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter} from "@solana/wallet-adapter-wallets";
import { useMemo } from "react";
const connection = "https://frosty-small-spring.solana-devnet.discover.quiknode.pro/4660428cadbd4cdf18186fe3cd9ff42d6ab490e4/"

const WalletConnectionProvider = ({children}) => {
    const endpoint = useMemo(()=> connection, [])

    const wallets = useMemo(()=> [new PhantomWalletAdapter()], [])

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}

export default WalletConnectionProvider