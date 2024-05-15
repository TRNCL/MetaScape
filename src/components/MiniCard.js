// import React from "react";
// import { useContext, useRef, createRef } from 'react';
// import { Link } from "react-router-dom";
// import BookmarkIcon from '@mui/icons-material/Bookmark';
// import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
// import AspectRatio from '@mui/joy/AspectRatio';
// import Card from '@mui/joy/Card';
// import CardContent from '@mui/joy/CardContent';
// import CardOverflow from '@mui/joy/CardOverflow';
// import { Button, Chip, Box } from '@mui/joy';
// import Typography from '@mui/joy/Typography';

// import Web3Context from "../utils/web3-context";
// import CollectionContext from "../utils/collection-context";
// import MarketplaceContext from "../utils/marketplace-context";
// import { formatPrice } from '../utils/helper';


// export default function MiniCard() {
//     const web3Ctx = useContext(Web3Context);
//     const collectionCtx = useContext(CollectionContext);
//     const marketplaceCtx = useContext(MarketplaceContext);

//     const priceRefs = useRef([]);
//     if (priceRefs.current.length !== collectionCtx.collection.length) {
//         priceRefs.current = Array(collectionCtx.collection.length).fill().map((_, i) => priceRefs.current[i] || createRef());
//     }

    
//     const buyHandler = (event) => {
//         const buyIndex = parseInt(event.target.value);
//         marketplaceCtx.contract.methods.fillOffer(marketplaceCtx.offers[buyIndex].offerId).send({ from: web3Ctx.account, value: marketplaceCtx.offers[buyIndex].price })
//         .on('transactionHash', (hash) => {
//             marketplaceCtx.setMktIsLoading(true);
//         })
//         .on('error', (error) => {
//             window.alert('Something went wrong when pushing to the blockchain');
//             marketplaceCtx.setMktIsLoading(false);
//         });
//     };

//     return (
//         <Box sx={{
//             display: 'flex',
//             mb: 4,
//             gap: 4,
//             flexDirection: { xs: 'column', sm: 'row' },
//             alignItems: { xs: 'start', sm: 'center' ``},
//             flexWrap: 'nowarp',
//             justifyContent: 'space-between',
//             overflowX: 'auto',
//         }}>

//             {collectionCtx.collection.map((NFT, key) => {

//                 // 检查是否在售，是返回offer的index，否返回-1
//                 const index = marketplaceCtx.offers ? marketplaceCtx.offers.findIndex(offer => offer.id === NFT.id) : -1;
//                 // NFT拥有者
//                 const owner = index === -1 ? NFT.owner : marketplaceCtx.offers[index].user;
//                 // NFT定价
//                 const price = index !== -1 ? formatPrice(marketplaceCtx.offers[index].price).toFixed(2) : null;

//                 return (
//                 <Card key={key} sx={{ width: 300, maxWidth: '100%', boxShadow: 'lg' }}>
//                     <CardOverflow>
//                         <AspectRatio ratio={1} sx={{ minWidth: 160 }}>
//                             <img
//                                 // src={`https://ipfs.io/ipfs/${NFT.img}`}
//                                 src="https://images.unsplash.com/photo-1593121925328-369cc8459c08?auto=format&fit=crop&w=286"
//                                 srcSet="https://images.unsplash.com/photo-1593121925328-369cc8459c08?auto=format&fit=crop&w=286&dpr=2 2x"
//                                 loading="lazy"
//                             // alt={`NFT ${key}`}
//                             />
//                         </AspectRatio>
//                     </CardOverflow>
//                     <CardContent>

//                         <Link
//                             // to={`/nft/${tokenId}`}
//                             fontWeight="md"
//                             color="neutral"
//                             textColor="text.primary"
//                             overlay
//                         >
//                             {NFT.title && NFT.title}
//                             {!NFT.title && 'NFT Title'}
//                         </Link>
//                         <Typography
//                             level="title-lg"
//                             sx={{ mt: 1, fontWeight: 'xl' }}
//                             endDecorator={
//                                 index !== -1 ? (
//                                     <Chip component="span" size="sm" variant="soft" color="success">
//                                         For Sale
//                                     </Chip>
//                                 ) : (
//                                     <Chip component="span" size="sm" variant="soft" color="neutral">
//                                         Not for Sale
//                                     </Chip>
//                                 )
//                             }
//                         >
//                             {NFT.price && NFT.price}
//                             {!NFT.price && 'NFT Price'}
//                         </Typography>
//                         <Typography level="body-sm" class="owner">
//                             {NFT.owner && NFT.owner}
//                             {!NFT.owner && 'NFT Owner'}
//                         </Typography>
//                     </CardContent>
//                     <CardOverflow
//                         variant="soft"
//                         sx={{
//                             display: 'flex',
//                             flexDirection: 'row',
//                             gap: 2,
//                             justifyContent: 'center',
//                             py: 1,
//                             borderTop: '1px solid',
//                             borderColor: 'divider',
//                         }}
//                     >
//                         <Button variant="solid" color="primary" size="lg" sx={{ flexGrow: '1' }} onClick={buyHandler} startDecorator={<LocalOfferOutlinedIcon />}>
//                             Make Offer
//                         </Button>
//                         <Button variant="outlined" color="neutral">
//                             <BookmarkIcon />
//                         </Button>
//                     </CardOverflow>
//                 </Card>
//                 );
//             })}
//         </Box>
//     );
// };
