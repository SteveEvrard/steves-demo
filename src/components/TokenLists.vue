<template>
    <div class="list-container">
        <div>
            <ListBox @click="checkAssetCount()" style="width: 20vw" listStyle="height:25vh" v-model="selectedTokens" :options="nfts" :multiple="true" :filter="true" optionLabel="name">
                <template #header>
                    <div class="header">NFTs</div>
                </template>
                <template :style="[selectedTokens.length >= 10 ? {'pointer-events': 'none'} : {}]" #option="token">
                    <div>
                        <div>{{displayNFT(token.option)}}</div>
                    </div>
                </template>                      
            </ListBox>
        </div>
        <div>
            <ListBox @click="checkAssetCount()" style="width: 20vw" listStyle="height:25vh" v-model="selectedTokens" :options="erc20Tokens" :multiple="true" :filter="true" optionLabel="name">
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
            <ListBox style="width: 20vw" listStyle="height:25vh" :options="selectedTokens" :multiple="true" optionLabel="name">
                <template #header>
                    <div class="header">{{selectedTokens.length}} Selected</div>
                </template>
                <template #option="token: ERC20Token | NFT">
                    <div>
                        <div>
                            {{(token.option.contract_type == 'ERC1155' || token.option.contract_type == 'ERC721') ? displayNFT(token.option) : displayERC20(token.option)}} 
                        </div>
                    </div>
                </template>                      
            </ListBox>
            <Button :disabled="selectedTokens.length < 1 || selectedTokens.length >= 11" style="width: 20vw; margin-top: 1vw; text-align: center;">Bundle Tokens</Button>
        </div>
    </div>
    <div>
        <Toast position="bottom-center" />
    </div>
</template>

<script setup lang="ts">
import { useTokensStore } from '../stores/tokens';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import type NFT from '@/types/NFT';
import type ERC20Token from '@/types/ERC20Token';
import { ethers, BigNumber } from 'ethers';
import { useToast } from "primevue/usetoast";

const tokensStore = useTokensStore();
const { nfts, erc20Tokens } = storeToRefs(tokensStore);
const selectedTokens = ref<Array<ERC20Token | NFT>>([]);
const toast = useToast();

const checkDisabled = () => {
    if(selectedTokens.value.length < 10) {
        return false;
    }
    return true;
}

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

const checkAssetCount = () => {
    if(selectedTokens.value.length >= 10) {
        toast.add({severity: 'warn', summary: 'Warning', detail: 'Can only bundle up to 10 assets. Unselect current assets to add more.', life: 3000});
    }
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

.button {
    
}
</style>