import React from "react";

import {
    Box,
    Typography,
    Breadcrumbs,
    Link,
} from '@mui/joy';

import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import '@fontsource/inter';



export default function Template() {

    return (
        <Box sx={{ flex: 1, width: '100%' }}>
            <Box
                sx={{
                    position: 'sticky',
                    top: { sm: -100, md: -110 },
                    bgcolor: 'background.body',
                    zIndex: 9995,
                }}
            >
                <Box sx={{ px: { xs: 2, md: 6 } }}>
                    {/* 导航栏 */}
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
                        <Typography color="primary" fontWeight={500} fontSize={12}>
                            Asset
                        </Typography>
                    </Breadcrumbs>

                    <Typography level="h2" component="h1" sx={{ mt: 1, mb: 2 }}>
                        Template
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        mb: 2,
                        mt: 2,
                        ml: 4,
                        mr: 4,
                        gap: 4,
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'start', sm: 'center' },
                        flexWrap: 'wrap',
                        justifyContent: { xs: 'space-between', sm: 'center' },
                    }}
                    bgcolor={'red'}
                >
                    {/* 内容 */}
                </Box>
            </Box>
        </Box>
    )
};
