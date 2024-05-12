const express = require('express');
const app = express();
const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const cors = require('cors');
const schedule = require('node-schedule');
const fs = require('fs');

const {
    Connection,
    Keypair,
    TransactionInstruction,
    Transaction,
    sendAndConfirmTransaction,
    LAMPORTS_PER_SOL,
    SystemProgram,
    PublicKey,
    Base58,
  } = require('@solana/web3.js');
const { AccountLayout, getAssociatedTokenAddress, Token, TOKEN_PROGRAM_ID, mintTo , transfer, getOrCreateAssociatedTokenAccount, TOKEN_2022_PROGRAM_ID } = require("@solana/spl-token");

const bs58 = require('bs58');
app.use(cors());
// Initialize Web3 with your preferred provider (e.g., Infura)
const web3 = new Web3('https://bsc-dataseed.binance.org/');

// Set up your private key and sender address
const privateKey = '' //// here you need to put your key
const senderAddress = '0xb3b6F71A72a47A6EE7deF98381c1035cB1187B82';

// Define the ERC-20 token contract address and ABI
const tokenContractAddress = '0x9ceEAa2C9d33783d6B9B8288a94E40cd405c34E2';
const tokenContractAddressUSDT = '0x55d398326f99059fF775485246999027B3197955';
var InitialPirce = 50000000;
var totalSold = 0;
var stage = 0;
var priceArray = [62.5,37.04,26.32]
// At a price of $0.00000002, you can buy 50,000,000 tokens.
// At a price of $0.00000004, you can buy 25,000,000 tokens.
// At a price of $0.00000008, you can buy 12,500,000 tokens.
// At a price of $0.00000016, you can buy 6,250,000 tokens
app.get('/transferPresale', async (req, res) => {
    console.log("here")
    const url = 'https://api.coingecko.com/api/v3/coins/solana/tickers';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    'x-cg-demo-api-key': 'CG-RPf3jkXUkEqber64GrJY1aS7	'
  }
};
let solanaprice = 0;

  try {
    const response = await fetch(url, options);
    const tickerData = await response.json();
    console.log(tickerData.tickers[0].last);
    solanaprice = tickerData.tickers[0].last;
  } catch (error) {
    console.error('Error fetching ticker data:', error);
  }
    const privateKeyA = "38fcAU8m9Vd4uvRQJhHke4c7UiqN6j4JiLdLt2QpU5sGdgXwGi4Fp83Q7GJMbCEdt8dXnTv6mtqmFt2dq7SXr2kr";
    const decodedPrivateKey = bs58.decode(privateKeyA);

    const pvtKey = '[213,218,80,47,103,227,244,68,234,201,77,127,36,102,244,25,221,182,63,169,118,37,251,113,164,162,18,79,44,201,97,36,13,229,158,67,119,64,6,7,155,37,160,69,141,144,255,75,54,117,16,52,72,2,25,185,35,12,115,93,144,115,56,215]'
        try {
            const recipientAddress = req.query.recipientAddress;
            const tokenAddress = '4jVWzFX3UZXqbUjnWKVFvufC8bMsF1spo2oUd6xW3meT';
            const amountSOL = req.query.amount;
            // let amount = amountSOL * 50000000;
            let amount = amountSOL * (priceArray[stage] * solanaprice);

          const connection = new Connection('https://api.mainnet-beta.solana.com', "confirmed");
        //   const privateKeyUint8Array = bs58.decode(key);
          // const senderKeyPair = Keypair.fromSecretKey(
          //   new Uint8Array(JSON.parse(pvtKey))
          // );
          const senderKeyPair = Keypair.fromSecretKey(decodedPrivateKey);

          console.log( senderKeyPair.publicKey)
          console.log(TOKEN_PROGRAM_ID)
      console.log("yahan")
          const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            senderKeyPair,
            new PublicKey(tokenAddress),
            senderKeyPair.publicKey,
            'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
            );
         amount = amount * 1000000;
      console.log("yahan1")
          
          const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            senderKeyPair,
            new PublicKey(tokenAddress),
            new PublicKey(recipientAddress)
          );
      console.log("yahan2")

          const signature = await transfer(
            connection,
            senderKeyPair,
            senderTokenAccount.address,
            recipientTokenAccount.address,
            senderKeyPair.publicKey,
            amount
          );
          res.json(signature);
        }   
 catch (error) {
    console.error('Error transferring tokens:', error);
    res.status(500).json({
        error: 'Error transferring tokens'
    });
}
});
app.get('/blockhash', async (req, res) => {
  console.log("here")
  const pvtKey = '[213,218,80,47,103,227,244,68,234,201,77,127,36,102,244,25,221,182,63,169,118,37,251,113,164,162,18,79,44,201,97,36,13,229,158,67,119,64,6,7,155,37,160,69,141,144,255,75,54,117,16,52,72,2,25,185,35,12,115,93,144,115,56,215]'
      try {
          const recipientAddress = req.query.recipientAddress;
          const tokenAddress = '8HhMc1niSAM6cTBgbH6r7sevR2zsbe2FLu3CjAbLrwn3';
          const amountSOL = req.query.amount;
          const amount = amountSOL * InitialPirce;

        const connection = new Connection('https://api.mainnet-beta.solana.com', "confirmed");
        let hash = await connection.getLatestBlockhash();
        console.log("blockhash", hash);
        res.json(hash);
      }   
catch (error) {
  console.error('Error transferring tokens:', error);
  res.status(500).json({
      error: 'Error transferring tokens'
  });
}
});
// Function to check if a wallet address exists in the JSON file
// Function to check if a wallet address exists in the JSON file
const checkWalletExistence = (walletAddress) => {
  console.log(walletAddress)
  try {
      const data = fs.readFileSync('wallets.json', 'utf8');
      if (!data) {
          // File is empty, return null
          return null;
      }
      const wallets = JSON.parse(data);
      return wallets.find(wallet => wallet.address === walletAddress);
  } catch (error) {
      if (error.code === 'ENOENT') {
          // File does not exist, return null
          return null;
      } else {
          // Other parsing errors
          throw error;
      }
  }
};



// Function to add a wallet address with token amount
const addWallet = (walletAddress, tokenAmount, referral) => {
  const data = fs.readFileSync('wallets.json', 'utf8');
  const wallets = JSON.parse(data);
  const existingWallet = wallets.find(wallet => wallet.address === walletAddress);

  if (!existingWallet) {
      // Wallet does not exist, add it
      const newWallet = {
          address: walletAddress,
          tokens: tokenAmount
      };
      wallets.push(newWallet);
  } else {
      // Wallet exists, update token amount
      existingWallet.tokens += tokenAmount;
  }

  // Check for referral
  if (referral) {
      const referralWallet = wallets.find(wallet => wallet.address === referral);
      if (referralWallet) {
          referralWallet.tokens += 10;
      } else {
          // If referral doesn't exist, add it with 10 tokens
          wallets.push({ address: referral, tokens: 10 });
      }
  }

  // Write updated data back to the file
  fs.writeFileSync('wallets.json', JSON.stringify(wallets, null, 2));
};

// API endpoint to add a wallet
app.get('/wallet', (req, res) => {
  // const { address, referral } = req.body;
  const address = req.query.address;
  const referral = req.query.referral;

  const tokenAmount = 100;

  if (!address) {
      return res.status(400).json({ error: 'Wallet address is required' });
  }

  const existingWallet = checkWalletExistence(address);
  if (!existingWallet) {
      addWallet(address, tokenAmount, referral);
      res.status(201).json({ message: 'Wallet added successfully' });
  } else {
    res.status(201).json({ message: 'Already Joined' });
  }
});
app.get('/price', async (req, res) => {
  console.log("here")
      try {
        const url = 'https://api.coingecko.com/api/v3/coins/solana/tickers';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    'x-cg-demo-api-key': 'CG-RPf3jkXUkEqber64GrJY1aS7	'
  }
};
let solanaprice = 0;


    const response = await fetch(url, options);
    const tickerData = await response.json();
    console.log(tickerData.tickers[0].last);
    solanaprice = tickerData.tickers[0].last;

        let amount = 1 * (priceArray[stage] * solanaprice);

        res.json(amount);
      }   
catch (error) {
  console.error('Error transferring tokens:', error);
  res.status(500).json({
      error: 'Error transferring tokens'
  });
}
});
app.get('/holdings', (req, res) => {
  const address  = req.query.address;

  if (!address) {
      return res.status(400).json({ error: 'Wallet address is required' });
  }

  const wallet = checkWalletExistence(address);
  if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
  }

  res.json({ address: wallet.address, holdings: wallet.tokens });
});
//const PORT = process.env.PORT || 3000;
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});let data = "Initial Value";
let changeCount = 0; // To keep track of how many times the data has been changed

const changeData = () => {
    data = `New Value ${new Date().toISOString()}`; // Change data to something new, here just an example with the current timestamp
    console.log(`Data changed to: ${InitialPirce}`);
    changeCount++;

    if(changeCount == 1 )
    {
      InitialPirce = 25000000;
      
      
    }
    else if (changeCount == 2)
    {
      InitialPirce = 12500000;
    }
    else{
      InitialPirce = 6250000;
    }
    if (changeCount >= 4) {
        console.log("Data has been changed 4 times. No more changes will be made.");
        job.cancel(); // Stop the job after changing the data 4 times
    }
};
async function livepirce()
{
  const url = 'https://api.coingecko.com/api/v3/coins/solana/tickers';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-cg-demo-api-key': 'CG-RPf3jkXUkEqber64GrJY1aS7	'
    }
  };
  
  
    try {
      const response = await fetch(url, options);
      const tickerData = await response.json();
      console.log(tickerData.tickers[0].last);
    } catch (error) {
      console.error('Error fetching ticker data:', error);
    }
}
livepirce();
// Schedule the job to run every 7 days
const job = schedule.scheduleJob('0 0 */7 * *', changeData);

console.log("Job scheduled to change data every 7 days.");
