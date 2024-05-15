import * as React from 'react';
import { Link } from 'react-router-dom';
import GlobalStyles from '@mui/joy/GlobalStyles';
import Snackbar from '@mui/joy/Snackbar';
import Box from '@mui/joy/Box';
import Badge from '@mui/joy/Badge';
import Avatar from '@mui/joy/Avatar';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Button from '@mui/joy/Button';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import BrightnessAutoRoundedIcon from '@mui/icons-material/BrightnessAutoRounded';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CreateIcon from '@mui/icons-material/Create';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import SupportIcon from '@mui/icons-material/Support';
import SavingIcons from '@mui/icons-material/Savings';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';


import '@fontsource/inter';
import { useState, useContext } from 'react';

import ColorSchemeToggle from '../utils/ColorSchemeToggle';
import { closeSidebar } from '../utils/sidebar';
import Web3Context from "../utils/web3-context";
import MarketplaceContext from "../utils/marketplace-context";
import { formatPrice } from '../utils/helper';
import web3 from '../utils/web3';

function Toggler({
  defaultExpanded = false,
  renderToggle,
  children,
}) {
  const [open, setOpen] = React.useState(defaultExpanded);
  return (
    <React.Fragment>
      {renderToggle({ open, setOpen })}
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: '0.2s ease',
          '& > *': {
            overflow: 'hidden',
          },
        }}
      >
        {children}
      </Box>
    </React.Fragment>
  );
}

export default function Sidebar() {
  const web3Ctx = useContext(Web3Context);
  const marketplaceCtx = useContext(MarketplaceContext);

  const [fundsLoading, setFundsLoading] = useState(false);
  const [open, setOuchOpen] = React.useState(false);

  const claimFundsHandler = () => {
    marketplaceCtx.contract.methods.claimFunds().send({ from: web3Ctx.account })
      .on('transactionHash', (hash) => {
        setFundsLoading(true);
      })
      .on('error', (error) => {
        window.alert('Something went wrong when pushing to the blockchain');
        setFundsLoading(false);
      })
  }

  const currentUserAddress = web3.eth.currentProvider.selectedAddress;

  // marketplaceCtx.contract.events.ClaimFunds()
  // .on('data', (event) => {
  //   marketplaceCtx.loadUserFunds(marketplaceCtx.contract, web3Ctx.account);
  //   setFundsLoading(false);
  // })

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: 'fixed', md: 'sticky' },
        transform: {
          xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
          md: 'none',
        },
        transition: 'transform 0.4s, width 0.4s',
        zIndex: 10000,
        height: '100dvh',
        width: 'var(--Sidebar-width)',
        top: 0,
        p: 2,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRight: '1px solid',
        borderColor: 'divider',
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ':root': {
            '--Sidebar-width': '220px',
            [theme.breakpoints.up('lg')]: {
              '--Sidebar-width': '240px',
            },
          },
        })}
      />

      <Box
        className="Sidebar-overlay"
        sx={{
          position: 'fixed',
          zIndex: 9998,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          opacity: 'var(--SideNavigation-slideIn)',
          backgroundColor: 'var(--joy-palette-background-backdrop)',
          transition: 'opacity 0.4s',
          transform: {
            xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
            lg: 'translateX(-100%)',
          },
        }}
        onClick={() => closeSidebar()}
      />

      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <IconButton variant="soft" color="primary" size="sm"
          onClick={() => { setOuchOpen(true); }}>
          <BrightnessAutoRoundedIcon />
        </IconButton>
        <Snackbar
          autoHideDuration={1000}
          open={open}
          variant='solid'
          color='danger'
          onClose={(event, reason) => {
            if (reason === 'clickaway') {
              return;
            }
            setOuchOpen(false);
          }}
        >
          Ouch
        </Snackbar>

        <Typography level="title-lg">MetaScape</Typography>
        <ColorSchemeToggle sx={{ ml: 'auto' }} />
      </Box>

      <Divider />

      {/* <Input size="sm" startDecorator={<SearchRoundedIcon />} placeholder="Search" /> */}

      <Box
        sx={{
          minHeight: 0,
          overflow: 'hidden auto',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            '--List-nestedInsetStart': '30px',
            '--ListItem-radius': (theme) => theme.vars.radius.sm,
          }}
        >
          <ListItem>
            <ListItemButton component={Link} to='/'>
              <HomeRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">Home</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton disabled>
              <DashboardRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">MyCollection</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton component={Link} to='/marketplace'>
              <LocalMallIcon />
              <ListItemContent>
                <Typography level="title-sm">The Market</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton component={Link} to='/createnft'>
              <CreateIcon />
              <ListItemContent>
                <Typography level="title-sm">CreatNFT</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem nested>
            <Toggler
              renderToggle={({ open, setOpen }) => (
                <ListItemButton onClick={() => setOpen(!open)}>
                  <GroupRoundedIcon />
                  <ListItemContent>
                    <Typography level="title-sm">Users</Typography>
                  </ListItemContent>
                  <KeyboardArrowDownIcon
                    sx={{ transform: open ? 'rotate(180deg)' : 'none' }}
                  />
                </ListItemButton>
              )}
            >
              <List sx={{ gap: 0.5 }}>
                <ListItem sx={{ mt: 0.5 }}>
                  <ListItemButton
                    role="menuitem"
                    component="a"
                    href="/profile"
                  >
                    My profile
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton onClick={claimFundsHandler}>
                    {`CLAIM ${formatPrice(marketplaceCtx.userFunds)} ETH`}
                  </ListItemButton>
                </ListItem>
              </List>
            </Toggler>
          </ListItem>

          <IconButton size="md" variant="soft" color={formatPrice(marketplaceCtx.userFunds) > 0 ? 'primary' : 'neutral'}
            onClick={() => {
              if (formatPrice(marketplaceCtx.userFunds) > 0) {
                claimFundsHandler();
              }}}>
            <Badge size='sm' badgeContent={formatPrice(marketplaceCtx.userFunds) > 0 ? '!' : 0}>
              <Typography textColor={formatPrice(marketplaceCtx.userFunds) > 0 ? 'primary.700' : 'neutral.400'} fontWeight={'bold'}
                endDecorator={<SavingIcons />}>
                Withdraw
              </Typography>
            </Badge>
          </IconButton>
        </List>


        <List
          size="sm"
          sx={{
            mt: 'auto',
            flexGrow: 0,
            '--ListItem-radius': (theme) => theme.vars.radius.sm,
            '--List-gap': '8px',
            mb: 2,
          }}
        >
          <ListItem>
            <ListItemButton disabled component={Link} to='/test'>
              <SupportIcon />
              Support
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component={Link} to='/test'>
              <SettingsRoundedIcon />
              Settings
            </ListItemButton>
          </ListItem>
        </List>
      </Box>


      <Divider />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Avatar
          variant="outlined"
          size="md"
          src=""
        />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography level="title-sm">{currentUserAddress ? currentUserAddress.slice(0, 12) : 'Not Login'}</Typography>
        </Box>

      </Box>
    </Sheet>
  );
}