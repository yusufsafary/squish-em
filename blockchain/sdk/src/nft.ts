import { Connection, PublicKey } from "@solana/web3.js";
import type { BlobSkin } from "./types";

/** Devnet program ID — replace after mainnet deploy */
export const NFT_PROGRAM_ID = new PublicKey(
  "SQUISH_NFT_PROGRAM_ID_REPLACE_AFTER_DEPLOY"
);

/**
 * Fetch all blob skin NFTs owned by a wallet
 */
export async function getOwnedSkins(
  connection: Connection,
  walletAddress: PublicKey
): Promise<BlobSkin[]> {
  // TODO: query Metaplex DAS API for NFTs in the SQUISH collection
  // Using Helius DAS: https://docs.helius.dev/compression-and-das-api
  const response = await fetch(connection.rpcEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "squish-nft-query",
      method: "getAssetsByOwner",
      params: {
        ownerAddress: walletAddress.toBase58(),
        page: 1,
        limit: 1000,
      },
    }),
  });

  const json = await response.json();
  // Filter for SQUISH collection NFTs and map to BlobSkin
  return (json.result?.items ?? [])
    .filter((asset: any) => asset.grouping?.some(
      (g: any) => g.group_key === "collection" && g.group_value === "SQUISH_COLLECTION_MINT"
    ))
    .map((asset: any, index: number) => ({
      id: index,
      name: asset.content?.metadata?.name ?? "Unknown Skin",
      rarity: asset.content?.metadata?.attributes?.find(
        (a: any) => a.trait_type === "Rarity"
      )?.value ?? "Common",
      mintAddress: new PublicKey(asset.id),
      imageUri: asset.content?.links?.image ?? "",
      price: 0,
    }));
}

/** All available blob skins (including unowned) */
export const ALL_SKINS: Omit<BlobSkin, "mintAddress">[] = [
  { id: 0, name: "Classic Blob", rarity: "Common", imageUri: "", price: 0 },
  { id: 1, name: "Neon Blob", rarity: "Rare", imageUri: "", price: 100 },
  { id: 2, name: "Galaxy Blob", rarity: "Epic", imageUri: "", price: 500 },
  { id: 3, name: "Golden Blob", rarity: "Legendary", imageUri: "", price: 2000 },
  { id: 4, name: "Candy Blob", rarity: "Common", imageUri: "", price: 50 },
  { id: 5, name: "Cyber Blob", rarity: "Rare", imageUri: "", price: 150 },
  { id: 6, name: "Shadow Blob", rarity: "Epic", imageUri: "", price: 600 },
  { id: 7, name: "Rainbow Blob", rarity: "Legendary", imageUri: "", price: 2500 },
];
