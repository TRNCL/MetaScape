import React, { useState, useContext } from 'react';
import {
  Box,
  Typography,
  Link,
  Breadcrumbs,
  Button,
  Input,
  Textarea,
  Card,
  CardContent,
  CardCover,
  styled,
  IconButton,
  Tooltip,
  Snackbar,
  CircularProgress,
  AspectRatio,
  Divider,
} from '@mui/joy';
import { useCountUp } from 'use-count-up';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import SvgIcon from '@mui/joy/SvgIcon';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import DoneIcon from '@mui/icons-material/Done';

import Web3Context from '../utils/web3-context';
import CollectionContext from '../utils/collection-context';


const CreateNFT = () => {
  const web3Ctx = useContext(Web3Context);
  const collectionCtx = useContext(CollectionContext);

  const [enteredName, setEnteredName] = useState('');
  const [enteredDescription, setEnteredDescription] = useState('');
  const [capturedFile, setCapturedFile] = useState();
  // 0: not started, 1: uploading, 2: mint; 3: done
  const [uploadingState, setUploadingState] = useState('0');

  const { value } = useCountUp({
    isCounting: (uploadingState === '1'),
    start: 0,
    end: 100,
    duration: 10,
  })


  const enteredNameHandler = (event) => {
    setEnteredName(event.target.value);
  };

  const enteredDescriptionHandler = (event) => {
    setEnteredDescription(event.target.value);
  };

  // const changeHandler = (event) => {
  //   setCapturedFile(event.target.files[0]);
  // };
  const changeHandler = (event) => {
    const file = event.target.files[0];
    setCapturedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl([reader.result, file.name]);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };
  const [previewUrl, setPreviewUrl] = useState(null);

  const submissionHandler = async (event) => {
    event.preventDefault();// 阻止表单提交的默认行为
    const mintNFT = async () => {
      try {
        // upload img to pinata
        setUploadingState('1');// 开始上传
        const imgData = new FormData();
        imgData.append("file", capturedFile);

        const imgPost = await fetch(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmMzAwNWY0My03OGMyLTQxNDItYmRjYi1kZTgyNjNkOTcxNDEiLCJlbWFpbCI6InRyYW5jZW50cmFsNEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYzY0YWUyZjMxODE3ZGQ4NTc5NTkiLCJzY29wZWRLZXlTZWNyZXQiOiJkYmVlMTUzYTM0OWRmZWY5Y2M2MjA3OTgwN2U3ZTI2ZjZlZWEwZDNlYTZjMGM4NDVhOTc4ZGZkMjQ0MGU2MzFlIiwiaWF0IjoxNzExOTU1NDkyfQ.iJI2FAAPCbqTrKZqsA3-CnUqzc-ijPyF-6T3EbA0zf0`,
            },
            body: imgData,
          }
        );

        const img = await imgPost.json();
        if (img.IpfsHash == null) {
          window.alert("Something went wrong while uploading the image. Operation aborted.");
          setUploadingState('0');
          return;
        } else {
          const isDuplicate = img.isDuplicate;
          if (isDuplicate) {
            window.alert("The image is a duplicate. Operation aborted.");
            setUploadingState('0');
            return;
          }
        };

        try {
          const metadata = ({
            title: "Asset Metadata",
            type: "object",
            properties: {
              name: {
                type: "string",
                description: enteredName
              },
              description: {
                type: "string",
                description: enteredDescription
              },
              image: {
                type: "string",
                description: img.IpfsHash
              }
            }
          });
          const formData = new FormData();
          formData.append('file', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));

          const metadataPost = await fetch(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmMzAwNWY0My03OGMyLTQxNDItYmRjYi1kZTgyNjNkOTcxNDEiLCJlbWFpbCI6InRyYW5jZW50cmFsNEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYzY0YWUyZjMxODE3ZGQ4NTc5NTkiLCJzY29wZWRLZXlTZWNyZXQiOiJkYmVlMTUzYTM0OWRmZWY5Y2M2MjA3OTgwN2U3ZTI2ZjZlZWEwZDNlYTZjMGM4NDVhOTc4ZGZkMjQ0MGU2MzFlIiwiaWF0IjoxNzExOTU1NDkyfQ.iJI2FAAPCbqTrKZqsA3-CnUqzc-ijPyF-6T3EbA0zf0`,
              },
              body: formData,
            }
          );
          const nftmetadata = await metadataPost.json();
          if (nftmetadata) {
            setUploadingState('2');// 开始铸造
          }
          if (!nftmetadata) {
            console.error('Something went wrong when updloading the file');
            return;
          }

          // mint nft
          collectionCtx.contract.methods.safeMint('https://ipfs.io/ipfs/' + nftmetadata.IpfsHash).send({ from: web3Ctx.account })
            .on('transactionHash', (hash) => {
              collectionCtx.setNftIsLoading(true);
              setTimeout(setUploadingState('3'), 500);// 铸造完成
            })
            .on('error', (e) => {
              window.alert('Something went wrong when pushing to the blockchain');
              collectionCtx.setNftIsLoading(false);
              setUploadingState('0');
            })
        } catch (error) {
          setUploadingState('0');
          console.log(error);
        }

      } catch (error) {
        setUploadingState('0');
        console.log(error);
      }
    };
    mintNFT();
  };


  const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
  `;

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
              href="/"
              aria-label="Home"
            >
              <HomeRoundedIcon />
            </Link>
            <Link
              underline="hover"
              color="neutral"
              fontSize={12}
              fontWeight={200}
            >
              CreateNFT
            </Link>
          </Breadcrumbs>
          <Typography level="h2" component="h1">
            Create an NFT
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

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

          <AspectRatio ratio="1" sx={{ minWidth: { xs: '80dvw', sm: '40dvw', lg: '40dvw' }, boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.2)' }}>
            <Card>
              <CardCover>
                {previewUrl ? (
                  <img src={previewUrl[0]} alt="Preview" />
                ) : (
                  <UploadFileOutlinedIcon />
                )}
              </CardCover>
              <CardCover
                sx={{
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)',
                }}
              />
              <CardContent sx={{ position: 'absolute', bottom: 16, left: 16 }}>
                <Typography
                  component='p'
                  textColor="#fff"
                  mt={{ xs: 60, sm: 60 }}
                  sx={{ fontSize: { xs: 24, sm: 42 }, fontWeight: 'xl' }}
                >
                  {previewUrl ? (
                    previewUrl[1]
                  ) : (
                    "Upload Your Picture"
                  )}
                </Typography>
              </CardContent>
            </Card>
          </AspectRatio>

          <Card variant="soft" color="neutral"
            sx={{
              minHeight: { xs: '80dvh', sm: '60dvh', lg: '40dvw' },
              maxWidth: { xs: '80dvw', sm: '40dvw', lg: '36dvw' },
              flexGrow: 1,
              boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.2)',
            }}
          >
            <form onSubmit={submissionHandler}>
              <CardContent sx={{ gap: 4 }}>
                <Card variant="outlined" color="primary" size='md'
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexGrow: 1,
                    alignItems: 'center',
                  }}>

                  <IconButton
                    component="label"
                    role={undefined}
                    tabIndex={-1}
                    variant="soft"
                    color="neutral"
                    size='lg'
                    startDecorator={
                      <SvgIcon>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                          />
                        </svg>
                      </SvgIcon>
                    }>
                    <AddSharpIcon />
                    <VisuallyHiddenInput
                      type="file"
                      onChange={changeHandler}
                    />
                  </IconButton>

                  <Typography level="p" color="neutral">
                    {previewUrl ? (
                      previewUrl[1]
                    ) : (
                      "Upload Your Picture"
                    )}
                  </Typography>
                </Card>

                <Box>
                  <Typography level="p" component="h3">
                    Name Your NFT*
                  </Typography>
                  <Input
                    placeholder="Name Your NFT"
                    value={enteredName}
                    size='lg'
                    onChange={enteredNameHandler}
                    type='text' />
                </Box>

                <Box>
                  <Typography level="p" component="h3">
                    Supply
                  </Typography>
                  <Input
                    size='lg'
                    placeholder="Supply"
                    type='text'
                    disabled />
                </Box>

                <Box>
                  <Typography level="p" component="h3">
                    Description
                  </Typography>
                  <Textarea
                    size='lg'
                    minRows={3}
                    placeholder="Description"
                    value={enteredDescription}
                    onChange={enteredDescriptionHandler}
                    type='text' />
                </Box>

                <Tooltip title="Once your item is minted you will not be able to change any of its information."
                  size="md" color='danger' variant='soft'>
                  <Button type="submit" size='lg' onClick={() => { setUploadingState('1') }}>
                    Create
                  </Button>
                </Tooltip>

                {/* uploading to IPFS */}
                <Snackbar
                  variant="soft"
                  color="danger"
                  open={uploadingState === '1'}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  endDecorator={
                    <CircularProgress variant='solid' color="danger" determinate value={value} />
                  }
                >
                  Don't close the window until the transaction is confirmed.
                  <br />Uploading to IPFS...
                </Snackbar>

                {/* mint NFT */}
                <Snackbar
                  variant="soft"
                  color="danger"
                  open={uploadingState === '2'}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  endDecorator={
                    <CircularProgress variant='solid' color="danger" />
                  }
                >
                  Don't close the window until the transaction is confirmed.
                  <br />Minting NFT...
                </Snackbar>

                {/* mint success */}
                <Snackbar
                  autoHideDuration={4000}
                  variant="soft"
                  color="success"
                  open={uploadingState === '3'}
                  onClose={() => { setUploadingState('0') }}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  endDecorator={
                    <DoneIcon />
                  }
                >
                  Transaction confirmed.
                  <br />Your NFT has been minted.
                </Snackbar>



              </CardContent>
            </form>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}

export default CreateNFT;