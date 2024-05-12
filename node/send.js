async (req, res) => {
    try {
      const { privateKey, recipientAddress, tokenAddress, amount } = req.body;
      const connection = new Connection(process.env.SOL_NETWORK, "confirmed");
      const key = privateKey;
      const privateKeyUint8Array = bs58.decode(key);
      const senderKeyPair = Keypair.fromSecretKey(privateKeyUint8Array);
  
      const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        senderKeyPair,
        new PublicKey(tokenAddress),
        senderKeyPair.publicKey
      );
      const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        senderKeyPair,
        new PublicKey(tokenAddress),
        new PublicKey(recipientAddress)
      );
      const signature = await transfer(
        connection,
        senderKeyPair,
        senderTokenAccount.address,
        recipientTokenAccount.address,
        senderKeyPair.publicKey,
        amount 
      );
      res.json(signature);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };