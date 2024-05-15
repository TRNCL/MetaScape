import React from "react";
import { useContext, useRef, createRef } from 'react';

import {
  Button,
  Chip,
  Box,
  Card,
  CardContent,
  CardOverflow,
  Typography,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalDialog,
  DialogTitle,
  Breadcrumbs,
  Stack,
  Link,
  CardCover,
  Snackbar,
  AspectRatio,
  Divider,
} from '@mui/joy';

import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import Add from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';


import web3 from '../utils/web3';
import Web3Context from "../utils/web3-context";
import CollectionContext from "../utils/collection-context";
import MarketplaceContext from "../utils/marketplace-context";
import { formatPrice } from '../utils/helper';
import { useParams } from 'react-router-dom';


export default function Asset() {
  const web3Ctx = useContext(Web3Context);
  const collectionCtx = useContext(CollectionContext);
  const marketplaceCtx = useContext(MarketplaceContext);
  const [open, setOpen] = React.useState(false);
  const nkey = useParams().key;

  const priceRefs = useRef([]);
  if (priceRefs.current.length !== collectionCtx.collection.length) {
    priceRefs.current = Array(collectionCtx.collection.length).fill().map((_, i) => priceRefs.current[i] || createRef());
  }

  const makeOfferHandler = (event, id, key) => {
    event.preventDefault();
    const enteredPrice = web3.utils.toWei(priceRefs.current[key].current.value, 'ether');
    // Approve the marketplace contract to transfer the NFT
    collectionCtx.contract.methods.approve(marketplaceCtx.contract.options.address, id).send({ from: web3Ctx.account })
      .on('transactionHash', (hash) => {
        marketplaceCtx.setMktIsLoading(true);
      })
      .on('receipt', (receipt) => {
        // Make an offer
        marketplaceCtx.contract.methods.makeOffer(id, enteredPrice).send({ from: web3Ctx.account })
          .on('error', (error) => {
            window.alert('Something went wrong when pushing to the blockchain');
            marketplaceCtx.setMktIsLoading(false);
          });
      });
  };

  const buyHandler = (event) => {
    const buyIndex = parseInt(event.target.value);
    marketplaceCtx.contract.methods.fillOffer(marketplaceCtx.offers[buyIndex].offerId).send({ from: web3Ctx.account, value: marketplaceCtx.offers[buyIndex].price })
      .on('transactionHash', (hash) => {
        marketplaceCtx.setMktIsLoading(true);
      })
      .on('error', (error) => {
        window.alert('Something went wrong when pushing to the blockchain');
        marketplaceCtx.setMktIsLoading(false);
      });
  };

  const cancelHandler = (event) => {
    const cancelIndex = parseInt(event.target.value);
    marketplaceCtx.contract.methods.cancelOffer(marketplaceCtx.offers[cancelIndex].offerId).send({ from: web3Ctx.account })
      .on('transactionHash', (hash) => {
        marketplaceCtx.setMktIsLoading(true);
      })
      .on('error', (error) => {
        window.alert('Something went wrong when pushing to the blockchain');
        marketplaceCtx.setMktIsLoading(false);
      });
  };

  const [warnOpen, setWarnOpen] = React.useState(false);

  return (
    <Box
      component="main"
      className="MainContent"
      sx={{ flex: 1, width: '100%' }}>
      <Box
        sx={{
          position: 'sticky',
          top: { sm: -100, md: -110 },
          bgcolor: 'background.body',
        }}
      >
        <Box sx={{ px: { xs: 2, md: 6 } }}>
          <Breadcrumbs
            size="sm"
            aria-label="breadcrumbs"
            separator={<ChevronRightRoundedIcon fontSize="sm" />}
            sx={{ pl: 0 }}
          >
            <Link
              underline="none"
              color="neutral"
              href="/"
              aria-label="Home"
            >
              <HomeRoundedIcon />
            </Link>
            <Link
              underline="hover"
              color="neutral"
              href="/marketplace"
              fontSize={12}
              fontWeight={500}
            >
              Marketplace
            </Link>
            <Typography color="primary" fontWeight={500} fontSize={12}>
              Asset
            </Typography>
          </Breadcrumbs>
          <Typography level="h2" component="h1" sx={{ mt: 1, mb: 2 }}>
            Asset Details
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {collectionCtx.collection.map((NFT, key) => {
          if (key == nkey) {
            const index = marketplaceCtx.offers ? marketplaceCtx.offers.findIndex(offer => offer.id === NFT.id) : -1;
            const owner = index === -1 ? NFT.owner : marketplaceCtx.offers[index].user;
            const price = index !== -1 ? formatPrice(marketplaceCtx.offers[index].price).toFixed(2) : null;
            return (
              <Box
                sx={{
                  display: 'flex',
                  mx: 4,
                  my: 2,
                  gap: 4,
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'start', sm: 'center' },
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'space-between', sm: 'center' },
                }}
              >
                {/* NFT图像 */}
                <AspectRatio ratio="1" sx={{ minWidth: { xs: '80dvw', sm: '40dvw', lg: '40dvw' }, boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.2)' }}>
                  <Card>
                    <CardCover>
                      <img
                        src={`https://cloudflare-ipfs.com/ipfs/${NFT.img}`}
                        srcSet={`https://cloudflare-ipfs.com/ipfs/${NFT.img} 2x`}
                        loading="lazy"
                        alt={`NFT ${key}`}
                      />
                    </CardCover>
                    <CardCover
                      sx={{
                        background:
                          'linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)',
                      }}
                    />
                    <CardContent sx={{ position: 'absolute', bottom: { xs: 8, lg: 16 }, left: { xs: 8, lg: 16 } }}>
                      <Typography
                        textColor="#fff"
                        mt={{ xs: 60, lg: 60 }}
                        sx={{ fontSize: { xs: 24, lg: 42 }, fontWeight: 'xl' }}
                      >
                        {NFT.title ? NFT.title : 'NFT Title'}
                      </Typography>
                      <Typography
                        textColor={'grey'}
                        noWrap
                        sx={{ fontSize: { xs: 16, lg: 24 }, fontWeight: 'xl', maxWidth: { xs: 240, lg: 360 }}}
                      >
                        Owner: {NFT.owner ? NFT.owner : 'NFT Owner'}
                      </Typography>
                    </CardContent>
                  </Card>
                </AspectRatio>

                {/* NFT详情 */}
                <Card variant="soft" color="neutral"
                  sx={{
                    minHeight: {xs: '80dvh', sm: '60dvh', lg: '40dvw'},
                    maxWidth: {xs: '80dvw', sm:'40dvw', lg:'36dvw'},
                    flexGrow: 1,
                    boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <Typography
                    sx={{ 
                      mt: 1, 
                      fontSize: { xs: 28, lg: 36 },
                      fontWeight: 'xl',
                    }}
                    endDecorator={
                      index !== -1 ? (
                        <Chip component="span" size="md" variant="outlined" color="success">
                          On Sale
                        </Chip>
                      ) : (
                        <Chip component="span" size="md" variant="outlined" color="neutral">
                          Unavailable
                        </Chip>
                      )
                    }
                  >
                    {NFT.title ? NFT.title : 'NFT Title'}
                  </Typography>

                  <Typography textColor={'grey'} noWrap maxWidth={360} sx={{fontSize: { xs: 16, lg: 24 }, fontWeight: 'xl'}}>
                    Owner: {NFT.owner ? NFT.owner : 'NFT Owner'}
                  </Typography>

                  <Card sx={{ flexGrow: '10' }} variant='plain' color="primary">
                    <Typography level="body-lg" >
                      {NFT.description ? NFT.description : 'NFT description'}
                    </Typography>
                  </Card>

                  <Typography
                    sx={{
                      fontSize: { xs: 14, lg: 26 },
                      fontWeight: 'xl',
                    }}
                    endDecorator={
                      index !== -1 ? (
                        <Chip component="span" size="md" variant="solid" color="neutral">
                          ETH
                        </Chip>
                      ) : (
                        <Chip component="span" size="md" variant="solid" color="warning">
                          Not On Sale
                        </Chip>
                      )
                    }
                  >
                    {price ? (price) : 'This NFT is not on sale'}
                  </Typography>

                  <Card variant="soft" color="neutral"
                    sx={{
                      flexGrow: 1,
                    }}>
                    <CardOverflow
                      variant="soft"
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 2,
                        justifyContent: 'center',
                        py: 1,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                      }}
                    >

                      {index !== -1 ? (
                        owner !== web3Ctx.account ? (
                          <React.Fragment>
                            <Button variant="solid" color="primary" size="lg" onClick={buyHandler} sx={{ flexGrow: '1' }} value={index} startDecorator={<LocalOfferOutlinedIcon />}>
                              Deal
                            </Button>
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <Button variant="solid" color="danger" size="lg" onClick={cancelHandler} sx={{ flexGrow: '1' }} value={index} startDecorator={<CloseIcon />}>
                              Cancel Offer
                            </Button>
                          </React.Fragment>
                        )
                      ) : owner === web3Ctx.account ? (
                        <React.Fragment>
                          <Button
                            variant="solid"
                            color="primary"
                            size="lg"
                            sx={{ flexGrow: '1' }}
                            startDecorator={<Add />}
                            onClick={() => setOpen(true)}
                          >
                            Set a Price
                          </Button>
                          <Modal open={open} onClose={() => setOpen(false)}>
                            <ModalDialog>
                              <DialogTitle>Make an Offer</DialogTitle>
                              <form
                                onSubmit={(e) => {
                                  makeOfferHandler(e, NFT.id, key)
                                  setOpen(false);
                                }}
                              >
                                <Stack spacing={2}>
                                  <FormControl>
                                    <FormLabel>Enter Price</FormLabel>
                                    <Input
                                      required
                                      type="number"
                                      step="0.01"
                                      placeholder="ETH..."
                                      slotProps={{
                                        input: {
                                          ref: priceRefs.current[key],
                                          step: 0.01,
                                        },
                                      }}
                                    />
                                  </FormControl>
                                  <Button type="submit">Submit</Button>
                                </Stack>
                              </form>
                            </ModalDialog>
                          </Modal>
                        </React.Fragment>
                      ) : (
                        <>
                          <Button variant="solid" color="neutral" sx={{ flexGrow: '1' }} size="lg" onClick={() => setWarnOpen(true)} startDecorator={<DoNotDisturbIcon />} >
                            It's not on sale
                          </Button>
                          <Snackbar
                            size="lg"
                            variant="soft"
                            color="warning"
                            open={warnOpen}
                            onClose={() => setWarnOpen(false)}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            endDecorator={
                              <Button
                                onClick={() => setWarnOpen(false)}
                                size="md"
                                variant="soft"
                                color="warning"
                              >
                                OKay
                              </Button>
                            }
                          >
                            This NFT is not on sale.
                          </Snackbar>
                        </>
                      )}
                      <Button disabled variant="outlined" color="neutral">
                        <BookmarkIcon />
                      </Button>
                    </CardOverflow>
                  </Card>
                </Card>
              </Box>
            )
          }
        })}
      </Box>
    </Box>
  )
};
