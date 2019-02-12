const Nimiq = require("@nimiq/core");

(() => {
    //Reference: https://raw.githubusercontent.com/bitcoin/bips/master/bip-0032/derivation.png
    //Entropy also known as MasterSeed in reference image. This entropy is the result of a RNG.
    const entropy = Nimiq.Entropy.generate();
    //Mnemonic version of the entropy.
    const mnemonic = entropy.toMnemonic();
    //Master aka MasterNode in reference image. It's the privatekey derived from the entropy. Password salt as parameter. Is a string. Entrypoint for new accounts.
    const master = entropy.toExtendedPrivateKey('');

    //IMPORTANT: NEVER USE THESE 24 WORDS FOR PERSONAL USE! ONLY FOR TESTING PURPOSES.
    const exampleEntropyMnemonic = [ 'insane', 'mixed', 'health', 'squeeze', 'physical', 'trust', 'pipe', 'possible', 'garage', 'hero', 'flock', 'stand', 'profit', 'power', 'tooth', 'review', 'note', 'camera', 'express', 'vicious', 'clock', 'machine', 'entire', 'heavy' ];
    const exampleEntropy = Nimiq.MnemonicUtils.mnemonicToEntropy(exampleEntropyMnemonic);
    const exampleMasterNode = exampleEntropy.toExtendedPrivateKey('');

    /*  
        IMPORTANT: according the BIP32 standard the official path is: m / purpose' / coin_type' / account' / change / address_index.
        Nimiq doesn't have the change level.

        Account:
        This level splits the key space into independent user identities, so the wallet never mixes the coins across different accounts.
        Software should prevent a creation of an account if a previous account does not have a transaction history (meaning none of its addresses have been used before).
        Software needs to discover all used accounts after importing the seed from an external source. Such an algorithm is described in "Account discovery" chapter. (https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki#account-discovery)

        Address index:
        Addresses are numbered from index 0 in sequentially increasing manner. This number is used as child index in BIP32 derivation.

        A valid Nimiq path: m/44'/242'/0'/0'
        m   -> masternode (entrypoint).
        44  -> means it's a coin (constant value).
        242 -> means it's Nimiq (constant value, https://github.com/satoshilabs/slips/blob/master/slip-0044.md).
        0   -> Account number. One masternode can have multiple accounts.
        0   -> Wallet index of account. One account can have multiple wallets.

                                 --> Account 0 ---> wallet 0 ---> wallet 1 ... wallet n
                                /
        entropy ---> masternode ---> Account 1 ---> wallet 0 ---> wallet 1 ... wallet n
                              | \
                              |  --> Account 2 ---> wallet 0 ---> wallet 1 ... wallet n
                              |
                               ----> Account n ---> wallet 0 ---> wallet 1 ... wallet n

        References:
        https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
        https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
        https://github.com/satoshilabs/slips/blob/master/slip-0044.md

    */

    const AccountZeroWalletZero = exampleMasterNode.derivePath("m/44'/242'/0'/0'");
    const AccountZeroWalletOne  = exampleMasterNode.derivePath("m/44'/242'/0'/1'");
    const AccountOneWalletZero  = exampleMasterNode.derivePath("m/44'/242'/1'/0'");
    console.log(`Account: 0, wallet: 0. ${AccountZeroWalletZero.toAddress().toUserFriendlyAddress()}`);
    console.log(`Account: 0, wallet: 1. ${AccountZeroWalletOne.toAddress().toUserFriendlyAddress()}`);
    console.log(`Account: 1, wallet: 0. ${AccountOneWalletZero.toAddress().toUserFriendlyAddress()}`);
})()