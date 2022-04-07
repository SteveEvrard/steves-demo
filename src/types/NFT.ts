export default interface NFT {
    token_address: string,
    token_id: string,
    block_number_minted: string,
    owner_of: string,
    block_number: string,
    amount: string,
    contract_type: string,
    name: string,
    symbol: string,
    token_uri: string,
    metadata: string,
    synced_at: string,
    is_valid: number,
    syncing: number,
    frozen: number
}