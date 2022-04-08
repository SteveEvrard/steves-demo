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
            <ListBox v-if="!processing" style="width: 20vw" listStyle="height:25vh" :options="selectedTokens" :multiple="true" optionLabel="name">
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
            <ProgressSpinner v-if="processing" style="width: 20vw" strokeWidth="5"/>
            <p v-if="processing" class="loading-text">Processing Transaction Now...</p>
            <Button v-if="!processing" @click="bundleTokens" :disabled="selectedTokens.length < 1 || selectedTokens.length >= 11" style="width: 20vw; margin-top: 1vw; text-align: center;">Bundle Tokens</Button>
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
import type Asset from '@/types/Asset';
import { ethers, BigNumber } from 'ethers';
import { useToast } from "primevue/usetoast";
import { ContractWithSigner } from '@/ethereum/ethers.ts';
import { useUserStore } from '@/stores/user';
import { checkERC20Approval, checkNFTApproval } from '@/ethereum/ContractUtil';

const requiresApproval = ref<boolean>(false);
const userStore = useUserStore();
const tokensStore = useTokensStore();
const { nfts, erc20Tokens } = storeToRefs(tokensStore);
const { account } = storeToRefs(userStore);
const selectedTokens = ref<Array<ERC20Token | NFT>>([]);
const toast = useToast();
const processing = ref<boolean>(false);

const bundleTokens = () => {
    requiresApproval.value = false;
    processing.value = true;
    const tokenBundle: Asset[] = selectedTokens.value.map((token: NFT | ERC20Token) => {
        token.contract_type == 'ERC20' ? checkERC20Approval(token, account.value) : checkNFTApproval(token, account.value);
        return createAsset(token);
    });
    if(!requiresApproval.value) {
        ContractWithSigner.create(tokenBundle)
            .then(() => subscribeToContractBundle())
            .catch(() => {
                selectedTokens.value = []
                processing.value = false;
            });
    }
}

const createAsset = (token: NFT | ERC20Token) => {
    if(token.contract_type != 'ERC20') {
        const asset: Asset = {
            assetAddress: token.token_address,
            category: token.contract_type == 'ERC721' ? 1 : 2,
            amount: 1,
            id: Number(token.token_id)
        };
        return asset;
    } else {
        const asset: Asset = {
            assetAddress: token.token_address,
            category: 0,
            amount: BigNumber.from(token.balance).toBigInt(),
            id: Number(token.token_id)
        };
        return asset;
    }
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
    if(selectedTokens.value.length > 10) {
        toast.add({severity: 'warn', summary: 'Warning', detail: 'Can only bundle up to 10 assets. Unselect current assets to add more.', life: 3000});
    }
}

const subscribeToContractBundle = () => {
  ContractWithSigner.on(ContractWithSigner.filters.BundleCreated(null, account.value), () => {
    selectedTokens.value = [];
    toast.add({severity: 'success', summary: 'Success!', detail: 'Bundle successfully created on the blockchain!', life: 3000})
    processing.value = false;
  })
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

.loading-text {
    text-align: center;
    color: #00ffe0;
}
</style>