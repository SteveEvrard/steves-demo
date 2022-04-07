import http from '@/http-common';

class TokenService {
    getAllERC20Tokens(address: string): Promise<any> {
        return http.get(`/${address}/erc20?chain=rinkeby`);
    }

    getAllNFTs(address: string): Promise<any> {
        return http.get(`/${address}/nft?chain=rinkeby&format=decimal`);
    }
}

export default new TokenService();