import {
    BottomNavigation,
    BottomNavigationAction,
    Paper,
    Box,
    useMediaQuery,
    useTheme,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import {
    HomeOutlined as HomeIcon,
    AddCircleOutlined as AddCircleIcon,
    AssignmentOutlined as AssignmentIcon,
    MoreHorizOutlined as MoreIcon,
    MapOutlined as MapIcon,
    InfoOutlined as InfoIcon,
    HelpOutlineOutlined as HelpIcon,
    QuestionAnswerOutlined as FaqIcon,
    AccessibilityOutlined as AccessibilityIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export const MobileTabBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    if (!isMobile) return null;

    const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        handleClose();
    };

    // Determinar o valor selecionado com base na rota atual
    const getValue = () => {
        if (location.pathname === '/') return 0;
        if (location.pathname === '/novo-registro') return 1;
        if (location.pathname === '/meus-registros') return 2;
        return 3;
    };

    return (
        <Box>
            <Paper
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: (theme) => theme.zIndex.appBar + 1,
                    borderTop: '1px solid #E8E9EB',
                    paddingBottom: 'env(safe-area-inset-bottom)', // Suporte para iPhone Dynamic Island/Home bar
                }}
                elevation={3}
            >
                <BottomNavigation
                    showLabels
                    value={getValue()}
                    onChange={(_, newValue) => {
                        if (newValue === 3) return; // O botão "Mais" é tratado via onClick
                        const paths = ['/', '/novo-registro', '/meus-registros'];
                        handleNavigation(paths[newValue]);
                    }}
                    sx={{ height: 64 }}
                >
                    <BottomNavigationAction label="Início" icon={<HomeIcon />} />
                    <BottomNavigationAction label="Novo" icon={<AddCircleIcon />} />
                    <BottomNavigationAction label="Registros" icon={<AssignmentIcon />} />
                    <BottomNavigationAction
                        label="Mais"
                        icon={<MoreIcon />}
                        onClick={handleMoreClick}
                    />
                </BottomNavigation>
            </Paper>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: {
                        width: 200,
                        borderRadius: 2,
                        marginBottom: 1,
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                    },
                }}
            >
                <MenuItem onClick={() => handleNavigation('/mapa')}>
                    <ListItemIcon><MapIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Mapa Temático</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleNavigation('/ouvidoria')}>
                    <ListItemIcon><InfoIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>O que é Ouvidoria</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleNavigation('/orientacoes')}>
                    <ListItemIcon><HelpIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Orientações</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleNavigation('/faq')}>
                    <ListItemIcon><FaqIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>FAQ</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleNavigation('/acessibilidade')}>
                    <ListItemIcon><AccessibilityIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Acessibilidade</ListItemText>
                </MenuItem>
            </Menu>
        </Box>
    );
};
