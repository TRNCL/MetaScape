{
  // 检查nft有无offer
  index !== -1 ? (
    owner !== web3Ctx.account ? (
      // 有offer且不是本人持有nft 
      <>
        <button>BUY</button>
        <img />
        <b>{`${price}`}</b>
      </>
    ) : (
      // 有offer且是本人持有nft 
      <>
        <button>CANCEL</button>
        <img />
        <b>{`${price}`}</b>
      </>
    )
  ) : owner === web3Ctx.account ? (
    <form onSubmit={(e) => makeOfferHandler(e, NFT.id, key)}>
      <button>OFFER</button>
      <input
        type="number"
        step="0.01"
        placeholder="ETH..."
        className="form-control"
        ref={priceRefs.current[key]}
      />
    </form>
  ) : (
  <p><br /></p>
)
}