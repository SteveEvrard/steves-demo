export default interface ERC20Token {
    token_id: string,
    token_address: string,
    name: string,
    symbol: string,
    logo: string,
    thumbnail: string,
    decimals: string,
    balance: string
    contract_type: 'ERC20'
}