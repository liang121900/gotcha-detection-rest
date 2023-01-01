import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import ImageSearchOutlinedIcon from '@mui/icons-material/ImageSearchOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import SmartScreenOutlinedIcon from '@mui/icons-material/SmartScreenOutlined';
import VideoLibraryOutlinedIcon from '@mui/icons-material/VideoLibraryOutlined';
import { SvgIcon } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import SwipeableDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { NavLink } from "react-router-dom";
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';

import { ReactComponent as LogoSvg } from '../logo.svg';

export default function RootHeader() {
  const [anchorElNav, setAnchorElNav] = React.useState(false);

  const drawerWidth = 240;

  const handleOpenNavMenu = () => {
    setAnchorElNav(true);
  };

  const handleCloseNavMenu = (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setAnchorElNav(false);
  };

  const onNavLinkClick = () => {
    setAnchorElNav(false);
  }

  const priMenuItems = [
    { title: "Image Object Detection", Icon: ImageSearchOutlinedIcon, to: "/image-object-detection" },
    { title: "Video Object Detection", Icon: VideoLibraryOutlinedIcon, to: "/video-object-detection" },
    { title: "Real Time Object Detection", Icon: SmartScreenOutlinedIcon, to: "/real-time-object-detection" }
  ];
  const secMenuItems = [
    { title: "About me", Icon: InfoOutlinedIcon, to: "/about-me" },
    { title: "What the heck is this?", Icon: HelpOutlineOutlinedIcon, to: "/what-is-this" }
  ]


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
              <MenuIcon />
            </IconButton>

            <SvgIcon fontSize="large" color="inherit" titleAccess="Gotcha" sx={{ borderRadius: '50%', marginRight: "0.5%" }}>
              <LogoSvg />
            </SvgIcon>

            {/* for large screen */}
            <Typography variant="h6" noWrap component="a" href="/" sx={{ flexGrow: 1, mr: 2, display: { xs: 'none', md: 'flex' }, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.3rem', color: 'inherit', textDecoration: 'none', }}>
              Gotcha-DEV
            </Typography>

            {/* for small screen */}
            <Typography variant="h5" noWrap component="a" href="/" sx={{ flexGrow: 1, mr: 2, display: { xs: 'flex', md: 'none' }, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.3rem', color: 'inherit', textDecoration: 'none', }}>
              DEV
            </Typography>
            <Box>
              <Button
                color="inherit">Login
              </Button>
            </Box>
          </Toolbar>
        </Container>


        <Box sx={{ display: 'flex' }}>
          <SwipeableDrawer open={anchorElNav} onClose={handleCloseNavMenu} sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', }, }} variant="temporary" anchor="left" >
            <Divider />
            <List>
              {priMenuItems.map(({ title, Icon, to }) => (
                <Link component={NavLink} color="primary" underline="none" key={title} to={to} onClick={onNavLinkClick} >
                  <ListItem key={title} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <Icon>{title}</Icon>
                      </ListItemIcon>
                      <ListItemText primary={title} />
                    </ListItemButton>
                  </ListItem>
                </Link>
              ))}
            </List>
            <Divider />
            <List>
              {secMenuItems.map(({ title, Icon, to }) => (
                <Link component={NavLink} color="primary" underline="none" key={title} to={to} onClick={onNavLinkClick} >
                  <ListItem key={title} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <Icon>{title}</Icon>
                      </ListItemIcon>
                      <ListItemText primary={title} />
                    </ListItemButton>
                  </ListItem>
                </Link>
              ))}
            </List>
          </SwipeableDrawer>
        </Box>
      </AppBar>
    </Box>
  );
}