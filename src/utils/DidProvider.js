import { useReducer } from 'react';

import DidContext from './did-context';

const defaultDidState = {
    contract: null,
    delegates: null,
    didIsLoading: true,
};

const didReducer = (state, action) => {
    if(action.type === 'CONTRACT') {
        return {
            contract: action.contract,
            did: state.did,
            delegates: state.delegates,
            attribute: state.attribute,
            didIsLoading: state.didIsLoading,
        }
    }
}

const DidProvider = props => {
    const [didState, dispatchCollectionAction] = useReducer(didReducer, defaultDidState);

    const loadDidContractHandler = (web3, EthereumDIDRegistry, deployedNetwork) => {
        const contract = deployedNetwork ? new web3.eth.Contract(EthereumDIDRegistry.abi, deployedNetwork.address): '';
        dispatchCollectionAction({type: 'CONTRACT', contract: contract}); 
        return contract;
    }

    const loadDidDelegatesHandler = async(contract) => {
        const delegates = await contract.methods.delegates().call();
    }

    const updateDidDelegatesHandler = async(contract) => {
        
    }

    const didContext = {
        contract: didState.contract,
        did: null,
        delegates: null,
        attribute: null,
    };

    return (
        <DidContext.Provider value={didContext}>
            {props.children}
        </DidContext.Provider>
    );
};

export default DidProvider;