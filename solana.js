// Solana wallet integration for Solvr
// Uses Phantom wallet and Solana Devnet

const SOLANA_NETWORK = 'https://api.devnet.solana.com'

// Check if Phantom is installed
export function isPhantomInstalled() {
  return window.solana && window.solana.isPhantom
}

// Connect to Phantom wallet
export async function connectWallet() {
  if (!isPhantomInstalled()) {
    throw new Error('Phantom wallet is not installed. Please install it from phantom.app')
  }

  const response = await window.solana.connect()
  return response.publicKey.toString()
}

// Get current connected wallet address
export function getConnectedWallet() {
  if (!isPhantomInstalled()) return null
  if (!window.solana.isConnected) return null
  return window.solana.publicKey?.toString() || null
}

// Send SOL from connected wallet to a recipient address
export async function sendSOL(recipientAddress, amountSOL) {
  if (!isPhantomInstalled()) {
    throw new Error('Phantom wallet not installed')
  }

  if (!window.solana.isConnected) {
    await window.solana.connect()
  }

  // Load Solana web3
  const solanaWeb3 = window.solanaWeb3

  const connection = new solanaWeb3.Connection(SOLANA_NETWORK, 'confirmed')

  const fromPubkey = window.solana.publicKey
  const toPubkey = new solanaWeb3.PublicKey(recipientAddress)

  // Convert SOL to lamports (1 SOL = 1,000,000,000 lamports)
  const lamports = Math.round(amountSOL * solanaWeb3.LAMPORTS_PER_SOL)

  // Create transaction
  const transaction = new solanaWeb3.Transaction().add(
    solanaWeb3.SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports
    })
  )

  // Get recent blockhash
  const { blockhash } = await connection.getLatestBlockhash()
  transaction.recentBlockhash = blockhash
  transaction.feePayer = fromPubkey

  // Sign and send transaction via Phantom
  const { signature } = await window.solana.signAndSendTransaction(transaction)

  // Wait for confirmation
  await connection.confirmTransaction(signature, 'confirmed')

  return signature
}