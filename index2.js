const express = require('express');
const app = express();
const web3 = require('@solana/web3.js');
const Tx = require('ethereumjs-tx').Transaction;
const cors = require('cors');
const schedule = require('node-schedule');
const fs = require('fs');
const splToken = require('@solana/spl-token');

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
const { AccountLayout, getAssociatedTokenAddress, Token, TOKEN_PROGRAM_ID,createAssociatedTokenAccountInstruction , mintTo ,createTransferInstruction , transfer, getOrCreateAssociatedTokenAccount, TOKEN_2022_PROGRAM_ID } = require("@solana/spl-token");

const bs58 = require('bs58');
async function main() {
    // Connect to the Solana devnet cluster
    const connection = new web3.Connection(web3.clusterApiUrl('mainnet-beta'), 'confirmed');

    // Sender's wallet
    const privateKeyA = "38fcAU8m9Vd4uvRQJhHke4c7UiqN6j4JiLdLt2QpU5sGdgXwGi4Fp83Q7GJMbCEdt8dXnTv6mtqmFt2dq7SXr2kr";
    const decodedPrivateKey = bs58.decode(privateKeyA);
    // const senderSecretKey = new Uint8Array([...]); // Insert your secret key array here
    const senderWallet = Keypair.fromSecretKey(decodedPrivateKey);

    // Receiver's wallet address
    const receiverAddress = new PublicKey('8xpkMJkyhXMP2vydfQJKxZHZgyhSvqdjsqhQf23XBxvy'); // Insert the receiver's public address here

    // The token mint address
    const mintPublicKey = new PublicKey('4gvyfKDGRJcuqD7PTzsbnqwk2bsgEdgF7kSy45rJjZN8'); // Insert the token mint address here

    // Create the token class
    const senderTokenAccountAddress = await getAssociatedTokenAddress(
        mintPublicKey,
        senderWallet.publicKey
    );
    const receiverTokenAccountAddress = await getAssociatedTokenAddress(
        mintPublicKey,
        receiverAddress
    );

    // Create the transfer instruction
    const receiverAccountInfo = await connection.getAccountInfo(receiverTokenAccountAddress);
    const transaction = new web3.Transaction();

    if (!receiverAccountInfo) {
        // Create the receiver's token account if it does not exist
        transaction.add(createAssociatedTokenAccountInstruction(
            senderWallet.publicKey, // Payer of the transaction fees
            receiverTokenAccountAddress, // Account to be created
            receiverAddress, // Owner of the new account
            mintPublicKey // Mint for the new account
        ));
    }

    // Add the transfer instruction to the transaction
    transaction.add(createTransferInstruction(
        senderTokenAccountAddress, // From account
        receiverTokenAccountAddress, // To account
        senderWallet.publicKey, // Owner of the from account
        1000, // Amount
        [], // No multisignature
        TOKEN_2022_PROGRAM_ID
    ));

    // Sign and send the transaction
    const signature = await web3.sendAndConfirmTransaction(connection, transaction, [senderWallet]);
    console.log(`Transaction successful with signature: ${signature}`);
}

main().catch(err => {
    console.error(err);
});