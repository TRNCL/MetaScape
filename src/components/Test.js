import React from "react";
import { useContext } from "react";
import Button from '@mui/joy/Button';
import Web3Context from "../utils/web3-context";
import web3 from "../utils/web3";

// 对于低风险操作,只需要认证密钥签名即可
// 对于高风险操作(如更新DID文档),需要恢复密钥进行挑战,确认操作的合法性
// 挑战过程一般通过让恢复密钥签名的方式完成

export default function Test() {
    const web3Ctx = useContext(Web3Context);
    const account = web3Ctx.account;

    function getDidDocument() {
        
    }

    function updateDidDocument() {

    };

    async function getPastTransactions() {
        
    }

    return (
        <>
            <form>
                <Button
                    onClick={async () => {
                        updateDidDocument();
                    }}
                >
                    Update DID Document
                </Button>
                <Button
                    onClick={async () => {
                        getDidDocument();
                    }}
                >
                    Get DID Document
                </Button>
                <Button
                    onClick={async () => {
                        getPastTransactions();
                    }}
                >
                    Get Past Transactions
                </Button>
                <></>
            </form>
        </>
    )
}