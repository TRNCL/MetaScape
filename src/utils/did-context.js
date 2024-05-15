import React from 'react';

const DidContext = React.createContext({
    did: null,
    didDoc: null,
    setDid: () => {},
    loadDidDoc: () => {},
    updateDidDoc: () => {},
});

export default DidContext;