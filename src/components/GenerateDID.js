import React from "react";
import { useContext, useState } from "react";
import Button from '@mui/joy/Button';
import web3 from '../utils/web3';
import Web3Context from "../utils/web3-context";
import CryptoJS from 'crypto-js';
import bs58 from 'bs58';
import sss from 'shamirs-secret-sharing';

export default function GenerateDID() {
    const web3Ctx = useContext(Web3Context);
    const account = web3Ctx.account;
    const [ipfsPath, setIpfsPath] = useState(null);

    // 上传IPFS
    async function uploadToIPFS(publicKey, share) {
        const didData = new FormData();
        didData.append("publicKey", publicKey);
        didData.append("share", share);
        const dataPost = await fetch(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmMzAwNWY0My03OGMyLTQxNDItYmRjYi1kZTgyNjNkOTcxNDEiLCJlbWFpbCI6InRyYW5jZW50cmFsNEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYzY0YWUyZjMxODE3ZGQ4NTc5NTkiLCJzY29wZWRLZXlTZWNyZXQiOiJkYmVlMTUzYTM0OWRmZWY5Y2M2MjA3OTgwN2U3ZTI2ZjZlZWEwZDNlYTZjMGM4NDVhOTc4ZGZkMjQ0MGU2MzFlIiwiaWF0IjoxNzExOTU1NDkyfQ.iJI2FAAPCbqTrKZqsA3-CnUqzc-ijPyF-6T3EbA0zf0`,
            },
            body: didData,
          }
        );
        const data = await dataPost.json();
        const ipfsPath = data.IpfsHash;
    }

    // 创建密钥，并由shamir秘密共享算法生成分片
    function generateKey () {
        const secretKey = web3.eth.accounts.create().privateKey;
        const publicKey = web3.eth.accounts.privateKeyToAccount(secretKey).address; // 公钥，上传至IPFS, Path记录至DID
        console.log(secretKey)
        const shares = sss.split(secretKey, { shares: 4, threshold: 2 })
        
        const share1 = shares[0].toString('hex')    // 上传IPFS，Path记录至DID
        const share2 = shares[1].toString('hex')    // 上传智能合约，由钱包加密，记录至DID
        const share3 = shares[2].toString('hex')    // 本地保存
        const share4 = shares[3].toString('hex')    // 本地保存
        console.log(share1, share2, share3, share4)

        // 上传publicKey和share1至IPFS

        
        const recovered = sss.combine(shares.slice(1, 3))
        console.log(recovered.toString()) // 'secret key'
    }
    generateKey();

    function generateBaseDidDocument(account) {
        //  Generate a new private key and recovery key

        const BaseDidDocument ={
            "@context": "https://w3id.org/did/v1",
            "publicKey": [
                {
                    "id": "did:msid:" + account + "#auth",
                    "type": "Secp256k1",
                    "ethAddress": account
                },
                {
                    "id": "did:msid:" + ipfsPath + "#rec",
                    "type": "Secp256k1",
                    "recoveryKeyHex": ipfsPath
                }
            ],
            "authentication": ["did:msid:" + account + "#auth"],
            "recovery": ["did:msid:" + ipfsPath + "#rec"]
        };

        console.log("Base DID Document:", BaseDidDocument);
        return BaseDidDocument
    }

    //  did-method = base58(ripemd160(sha256(<Base DID Document>)))
    function generateDid(account) {
        const { didDocument, privateKey } = generateBaseDidDocument(account);
        const BaseDidDocument = didDocument;
        const BaseDidDocumentString = JSON.stringify(BaseDidDocument);
        const sha256 = CryptoJS.SHA3(BaseDidDocumentString, { outputLength: 256 }).toString(CryptoJS.enc.Hex);
        const encoder = new TextEncoder();
        const ripemd160 = encoder.encode(CryptoJS.RIPEMD160(sha256).toString(CryptoJS.enc.Hex));
        const base58 = bs58.encode(ripemd160)
        const didMethod = "did:msid:" + base58;

        console.log("DID:", didMethod);
        return didMethod;
    }

    function generateDidDocument(DID, account) {
        //  TODO：当前以太坊地址是否已经注册过DID
        const privateKey = web3.eth.accounts.create().privateKey;
        const recoveryKey = web3.eth.accounts.privateKeyToPublicKey(privateKey, true);

        return {
            "@context": "https://w3id.org/did/v1",
            "id": DID,
            "version": 1,
            "created": Date.now(),
            "updated": null,
            "previousVersion": null,
            "publicKey": [
                {
                    "id": "did:msid:" + account + "#auth",
                    "type": "Secp256k1",
                    "ethAddress": account
                },
                {
                    "id": "did:msid:" + recoveryKey + "#rec",
                    "type": "Secp256k1",
                    "recoveryKeyHex": recoveryKey
                }
            ],
            "authentication": ["did:msid:" + account + "#auth"],
            "recovery": ["did:msid:" + recoveryKey + "#rec"],
        };
    }

    //  upload DIDDocument to pinata
    async function uploadDidDocument(DIDDocument){
        try {
            const formData = new FormData();
            formData.append('file', new Blob([JSON.stringify(DIDDocument)], { type: 'application/json' }));
            const didPost = await fetch(
                "https://api.pinata.cloud/pinning/pinFileToIPFS",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmMzAwNWY0My03OGMyLTQxNDItYmRjYi1kZTgyNjNkOTcxNDEiLCJlbWFpbCI6InRyYW5jZW50cmFsNEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYzY0YWUyZjMxODE3ZGQ4NTc5NTkiLCJzY29wZWRLZXlTZWNyZXQiOiJkYmVlMTUzYTM0OWRmZWY5Y2M2MjA3OTgwN2U3ZTI2ZjZlZWEwZDNlYTZjMGM4NDVhOTc4ZGZkMjQ0MGU2MzFlIiwiaWF0IjoxNzExOTU1NDkyfQ.iJI2FAAPCbqTrKZqsA3-CnUqzc-ijPyF-6T3EbA0zf0`,
                    },
                    body: formData,
                }
            );
            console.log("doc:", formData);
            const result = await didPost.json();
            console.log("Result:", result.IpfsHash);
            
            return result;
        } catch (error) {
            console.error("Error:", error);
            return;
        }
        
    };


    return (
        <>
            hello world
        </>
    )
}