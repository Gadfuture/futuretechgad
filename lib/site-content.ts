import type { Route } from "next";

export const navigation: Array<{ href: Route; label: string }> = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Mine" },
  { href: "/learn/crypto", label: "Markets" },
  { href: "/contact", label: "Support" }
];

export const supportedAssets = ["BTC", "USDT", "LTC", "BNB", "ETH", "TRX"];

export const serviceCategories = [
  "Wallet Setup Support",
  "Blockchain Education Session",
  "Meme Coin Launch Consultation",
  "Token Branding and Strategy",
  "Network Selection Guidance",
  "General Business Inquiry"
];

export const cryptoEducationArticle = `
Cryptocurrency is a form of digital value that moves across computer networks without relying on a traditional bank to update balances. Instead of one company controlling the ledger, many blockchains distribute the record of transactions across a network of independent computers. Each transaction is grouped into blocks, confirmed by the network, and then preserved as part of a permanent history. This is one reason cryptocurrency attracts attention from builders, traders, and businesses: it allows value and data to move on systems that remain visible and verifiable to anyone using the chain.

There are two broad groups people usually talk about: coins and tokens. Coins such as Bitcoin or Solana run on their own blockchain. Tokens such as many forms of USDT operate on an existing blockchain like Ethereum, Tron, or Solana. This difference matters because the network determines which wallet standard to use, how fees are paid, how quickly transfers settle, and which tools support the asset. Sending a token on the wrong network is one of the most common mistakes new users make, so any serious crypto business should teach users to confirm the asset name and the chain before transacting.

Wallets are the tools people use to hold and move crypto. A wallet might be a browser extension, mobile app, hardware device, or custodial service. The wallet does not literally store coins inside an app; instead, it secures the keys that allow the owner to control on-chain assets. Public wallet addresses are like destinations that others can send assets to, while private keys or seed phrases prove ownership. Good wallet hygiene is essential. Users should never share private keys, should back up recovery phrases offline, and should verify that they are interacting with legitimate websites or applications.

Crypto markets also move quickly. Prices can be volatile, transaction fees can change depending on network activity, and different blockchains offer different tradeoffs between speed, decentralization, and cost. Stablecoins such as USDT aim to reduce price volatility by tracking fiat value, but they still depend on network infrastructure, wallet compatibility, and issuer trust. That is why education matters. People need to understand not just the name of a coin, but the underlying network, the risk profile, the transaction process, and the service provider they are dealing with.

For businesses, cryptocurrency can power new products, communities, fundraising models, and payment experiments. For individuals, it opens doors to digital ownership, borderless transfers, and participation in web3 ecosystems. But it should be approached carefully. The best path is to learn the basics, move slowly, verify addresses and links, and work with providers that communicate clearly and avoid unrealistic promises. A professional crypto platform should help clients understand how blockchains work, how to select the right network, and how to stay secure while exploring the space.
`;

export const transferEducationArticle = `
A real blockchain transfer begins when a wallet holder creates a transaction and signs it with the private key that controls the funds. The transaction includes important details such as the recipient wallet address, the amount, and the network being used. On many chains it also includes a fee, sometimes called gas, which pays validators or miners to process the transaction. Once the user confirms it in the wallet, the transaction is broadcast to the network and waits to be included in a block.

Every blockchain has its own confirmation process. On Bitcoin, users often wait for several confirmations because each new block increases confidence that the transaction is permanently settled. On faster networks such as Solana or Tron, confirmation times can be much shorter, but users still need to make sure the transfer is final and visible on a block explorer. The exact number of confirmations a service requires may vary, which is why recipients often ask users to wait until the explorer shows the transfer as complete before treating it as settled.

Network selection is a crucial part of the process. An asset label like USDT is not enough by itself, because USDT may exist on more than one blockchain. A wallet address that works for one chain may not be valid for another, and even when an address format looks similar, the receiving service may support only specific networks. Before sending any transaction, users should confirm the asset, the destination address, and the network in at least two places. A small test transfer is often a smart way to verify compatibility before moving a larger amount.

Fees also affect the user experience. Ethereum-based transfers may cost more during busy periods, while other chains may offer lower fees but different wallet tooling or liquidity. Understanding the network helps users choose the right balance of speed, convenience, and cost. It also helps businesses explain why one transfer may settle in minutes while another takes longer or costs more.

The most important takeaway is that real blockchain transfers are transparent and verifiable. They do not depend on hidden balances, off-ledger promises, or unexplained delays. A user should be able to view the transaction hash on a public explorer, confirm the sending and receiving addresses, and track the confirmation status directly from the chain. Good crypto platforms teach clients how to use those tools so they can make informed, safe decisions.
`;
