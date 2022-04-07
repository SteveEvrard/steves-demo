<template>
    <div class="list-container">
        <div>
            <ListBox style="width:20vw" listStyle="height:25vh" v-model="selectedTokens" :options="nfts" :multiple="true" :filter="true" optionLabel="name">
                <template #header>
                    <div class="header">NFTs</div>
                </template>
                <template #option="token">
                    <div>
                        <div>{{displayNFT(token.option)}}</div>
                    </div>
                </template>                      
            </ListBox>
        </div>
        <div>
            <ListBox style="width:20vw" listStyle="height:25vh" v-model="selectedTokens" :options="erc20Tokens" :multiple="true" :filter="true" optionLabel="name">
                <template #header>
                    <div class="header">Tokens</div>
                </template>
                <template #option="token">
                    <div>
                        <div>{{displayERC20(token.option)}}</div>
                    </div>
                </template>                      
            </ListBox>
        </div>
        <div>
            <ListBox style="width:20vw" listStyle="height:30vh" :options="selectedTokens" :multiple="true" optionLabel="name">
                <template #header>
                    <div class="header">Selected</div>
                </template>
                <template #option="token: ERC20Token | NFT">
                    <div>
                        <div>
                            {{(token.option.contract_type == 'ERC1155' || token.option.contract_type == 'ERC721') ? displayNFT(token.option) : displayERC20(token.option)}} 
                        </div>
                    </div>
                </template>                      
            </ListBox>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useTokensStore } from '../stores/tokens';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import type NFT from '@/types/NFT';
import type ERC20Token from '@/types/ERC20Token';
import { ethers, BigNumber } from 'ethers';

const tokensStore = useTokensStore();
const { nfts, erc20Tokens } = storeToRefs(tokensStore);
const selectedNFTs = ref<NFT[]>([]);
const selectedTokens = ref<Array<ERC20Token | NFT>>([]);

const formatToken = (token: ERC20Token) => {
    return ethers.utils.formatUnits(BigNumber.from(token.balance), token.decimals)
}

const validateName = (token: ERC20Token | NFT) => {
    return token.name ? token.name : 'Unknown';
}

const displayNFT = (token: NFT) => {
    return `${validateName(token)}: ${token.token_id} (${token.contract_type})`;
}

const displayERC20 = (token: ERC20Token) => {
    return `${formatToken(token)} ${token.name}`;
}
</script>

<style>
.list-container {
    display: flex;
    justify-content: space-around;
}

.header {
    text-align: center;
    font-size: 2vw;
}
</style>