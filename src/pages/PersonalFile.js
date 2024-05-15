import React, { createContext } from "react";
import { useContext, useRef, createRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

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
  Divider,
  AspectRatio,
  Sheet,
  Skeleton,


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


export default function PersonalFile() {
  const web3Ctx = useContext(Web3Context);
  const collectionCtx = useContext(CollectionContext);
  const marketplaceCtx = useContext(MarketplaceContext);
  console.log(marketplaceCtx);

  const priceRefs = useRef([]);
  if (priceRefs.current.length !== collectionCtx.collection.length) {
    priceRefs.current = Array(collectionCtx.collection.length).fill().map((_, i) => priceRefs.current[i] || createRef());
  }

  const [loading, setLoading] = React.useState(true);

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

  const [open, setOpen] = React.useState(false);
  const [warnOpen, setWarnOpen] = React.useState(false);



  return (
    <Box
      component="main"
      className="MainContent"
      sx={{ flex: 1, width: '100%' }}
    >
      <Box
        sx={{
          position: 'sticky',
          top: { sm: -100, md: -110 },
          bgcolor: 'background.body',
          zIndex: 9995,
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
              href="#some-link"
              aria-label="Home"
            >
              <HomeRoundedIcon />
            </Link>
            <Link
              underline="hover"
              color="neutral"
              href="#some-link"
              fontSize={12}
              fontWeight={500}
            >
              Users
            </Link>
            <Typography color="primary" fontWeight={500} fontSize={12}>
              My profile
            </Typography>
          </Breadcrumbs>
          <Typography level="h2" component="h1" sx={{ mt: 1, mb: 2 }}>
            My profile
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box
          className="body"
          sx={{
            display: 'flex',
            mx: 16,
            my: 2,
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'start', sm: 'center' },
            flexWrap: 'wrap',
            justifyContent: { xs: 'space-between', sm: 'center' },
          }}
        >

          <Card
            orientation="horizontal"
            sx={{
              width: '20dvw',
              flexWrap: 'wrap',
              overflow: 'auto',
            }}
          >
            <AspectRatio flex ratio="1" maxHeight={182} sx={{ minWidth: 182 }}>
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
                srcSet="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286&dpr=2 2x"
                loading="lazy"
                alt=""
              />
            </AspectRatio>
            <CardContent>
                
            </CardContent>
          </Card>




          <Box
          sx={{
            width: '60dvw',
            display: 'flex',
            mx: 4,
            my: 2,
            gap: 4,
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: { xs: 'space-between', sm: 'center' },
            overflowX: 'auto',
          }}>
            {collectionCtx.collection.map((NFT, key) => {
              const index = marketplaceCtx.offers ? marketplaceCtx.offers.findIndex(offer => offer.id === NFT.id) : -1;
              const owner = index === -1 ? NFT.owner : marketplaceCtx.offers[index].user;
              const price = index !== -1 ? formatPrice(marketplaceCtx.offers[index].price).toFixed(2) : null;

              if (owner == web3Ctx.account) {
                return (
                  <Card key={key}
                    sx={{
                      width: 300,
                      maxWidth: '100%',
                      boxShadow: 'lg',
                      boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <CardOverflow>
                      <AspectRatio ratio={1} sx={{ minWidth: 160 }}>

                        {/*nft image*/}
                        <Skeleton loading={loading}>
                          <img
                            src={`https://cloudflare-ipfs.com/ipfs/${NFT.img}`}
                            srcSet={`https://cloudflare-ipfs.com/ipfs/${NFT.img} 2x`}
                            loading="lazy"
                            alt={`NFT ${key}`}
                            onLoad={() => setLoading(false)}
                          />
                        </Skeleton>
                      </AspectRatio>
                    </CardOverflow>
                    <CardContent>
                      {/*nft info*/}
                      <Typography
                        level="title-lg"
                        sx={{ mt: 1, fontWeight: 'xl' }}
                        endDecorator={
                          index !== -1 ? (
                            <Chip component="span" size="sm" variant="soft" color="success">
                              On Sale
                            </Chip>
                          ) : (
                            <Chip component="span" size="sm" variant="soft" color="neutral">
                              Unavailable
                            </Chip>
                          )
                        }
                      >
                        <Link
                          component={RouterLink}
                          to={`/marketplace/asset/${NFT.id}/${key}`}
                          level="title-lg"
                          color="inherit"
                        >
                          {console.log('key', key)}

                          {NFT.title ? NFT.title : 'NFT Title'}
                        </Link>
                      </Typography>

                      <>

                        <Typography level="title-md">
                          {price ? (price + ' ETH') : 'This NFT is not on sale'}
                        </Typography>
                      </>

                      <Typography level="body-sm" noWrap maxWidth={160}>
                        {NFT.owner ? NFT.owner : 'NFT Owner'}
                      </Typography>
                    </CardContent>
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
                            <Button variant="solid" color="success" size="lg" sx={{ flexGrow: '1' }} onClick={buyHandler} value={index} startDecorator={<LocalOfferOutlinedIcon />}>
                              Deal
                            </Button>
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <Button variant="solid" color="danger" size="lg" sx={{ flexGrow: '1' }} onClick={cancelHandler} value={index} startDecorator={<CloseIcon />}>
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
                          <Button variant="outlined" color="neutral" size="lg" sx={{ flexGrow: '1' }} onClick={() => setWarnOpen(true)} startDecorator={<DoNotDisturbIcon />} >
                            Not on Sale
                          </Button>

                          <Snackbar
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
                );
              }
            })}

          </Box>
        </Box>
      </Box>
    </Box>
  )
}