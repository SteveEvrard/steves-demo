import { ethers } from "ethers";
import TokenBundler from './TokenBundler.json';

export const provider = window.ethereum ? new ethers.providers.Web3Provider(window.ethereum) : null;

export const contractAddress = '0xd6d6ba13fDe7DF9cb4014c372fAE713854D4e84c';

export const signer = provider ? provider.getSigner() : null;

export const Contract = new ethers.Contract(contractAddress, TokenBundler, provider);
export const ContractWithSigner = Contract.connect(signer);