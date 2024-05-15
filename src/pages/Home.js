import React from "react";
import { Link } from 'react-router-dom';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useColorScheme } from '@mui/joy/styles';


export default function Home() {
  const { mode } = useColorScheme();
  const notoSansScFont = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100..900&display=swap');
  `;

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{
        display: 'flex',
        minHeight: '100dvh',
        width: '100%',
        backgroundColor: 'background.level1',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: mode === 'dark' ? 'url(http://getwallpapers.com/wallpaper/full/9/1/e/168436.jpg)' : 'url(https://r1.ilikewallpaper.net/ipad-air-wallpapers/download/32290/Mountain-White-Snow-Winter-Minimal-ipad-air-wallpaper-ilikewallpaper_com.jpg)'
      }} >
        <Box
          component="main"
          className="MainContent"
          sx={{
            px: { xs: 2, md: 6 },
            pt: {
              xs: 'calc(12px + var(--Header-height))',
              sm: 'calc(12px + var(--Header-height))',
              md: 3,
            },
            pb: { xs: 2, sm: 2, md: 3 },
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            height: '100dvh',
            gap: 1,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: { md: '64%', xs: '16%' },
              top: { md: '20%', xs: '78%' },
              display: 'flex',
              flexDirection: 'column',
              alignItems: { md: 'flex-end', xs: 'center' },
            }}
            flex
          >
            <Typography
              fontFamily="'Noto Sans SC', sans-serif"
              fontSize={{ md: 52, xs: 32 }}
              fontWeight={200}
              
              textColor={mode === 'dark' ? '#ecfeff' : '#2c3d3e' }
              sx={{textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',}}
              noWrap
            >
              前往 &gt; MetaScape
            </Typography>
            <Button
              variant="solid"
              color="primary"
              size={"lg"}
              endDecorator={<NavigateNextIcon />}
              component={Link} to='/marketplace'
              sx={{ mt: 2 }}
            >
              Getting Started
            </Button>
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}