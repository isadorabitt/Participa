import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined as HomeIcon,
  AddCircleOutlined as AddCircleIcon,
  AssignmentOutlined as AssignmentIcon,
  InfoOutlined as InfoIcon,
  HelpOutlineOutlined as HelpOutlineIcon,
  QuestionAnswerOutlined as QuestionAnswerIcon,
  AccessibilityOutlined as AccessibilityIcon,
  MapOutlined as MapIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

const menuItems: MenuItem[] = [
  { text: 'Início', icon: <HomeIcon />, path: '/' },
  { text: 'Novo Registro', icon: <AddCircleIcon />, path: '/novo-registro' },
  { text: 'Meus Registros', icon: <AssignmentIcon />, path: '/meus-registros' },
  { text: 'Mapa Temático', icon: <MapIcon />, path: '/mapa' },
  { text: 'O que é Ouvidoria', icon: <InfoIcon />, path: '/ouvidoria' },
  { text: 'Orientações', icon: <HelpOutlineIcon />, path: '/orientacoes' },
  { text: 'FAQ', icon: <QuestionAnswerIcon />, path: '/faq' },
  { text: 'Acessibilidade', icon: <AccessibilityIcon />, path: '/acessibilidade' },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar = ({ mobileOpen = false, onMobileClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  const drawerContent = (
    <Box sx={{ overflow: 'auto', paddingTop: 3, paddingBottom: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingX: 2,
          marginBottom: 3,
          paddingY: 2,
        }}
      >
        <Box
          component="img"
          src="/logo-participa-azul.svg"
          alt="Logo Participa DF"
          sx={{
            height: { xs: 40, sm: 50 },
            width: 'auto',
            maxWidth: '85%',
            objectFit: 'contain',
            filter: 'drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.08))',
          }}
        />
      </Box>
      <List sx={{ paddingX: 1.5 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ marginBottom: 0.5 }}>
              <ListItemButton
                selected={isSelected}
                onClick={() => handleNavigation(item.path)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleNavigation(item.path);
                  }
                }}
                sx={{
                  borderRadius: 2,
                  paddingY: 1.5,
                  paddingX: 2,
                  marginX: 1,
                  transition: 'all 0.2s ease-in-out',
                  position: 'relative',
                  '&::before': isSelected
                    ? {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 4,
                        height: '60%',
                        backgroundColor: '#005FDB',
                        borderRadius: '0 4px 4px 0',
                      }
                    : {},
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(0, 95, 219, 0.08)',
                    color: '#005FDB',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 95, 219, 0.12)',
                    },
                    '& .MuiListItemIcon-root': {
                      color: '#005FDB',
                    },
                  },
                  '&:hover': {
                    backgroundColor: isSelected
                      ? 'rgba(0, 95, 219, 0.12)'
                      : 'rgba(0, 0, 0, 0.04)',
                    transform: 'translateX(4px)',
                  },
                  '&:focus-visible': {
                    outline: '3px solid',
                    outlineColor: '#005FDB',
                    outlineOffset: '2px',
                  },
                }}
                aria-current={isSelected ? 'page' : undefined}
              >
                <ListItemIcon
                  sx={{
                    color: isSelected ? '#005FDB' : 'rgba(0, 0, 0, 0.6)',
                    minWidth: 40,
                    transition: 'color 0.2s ease-in-out',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isSelected ? 600 : 400,
                    fontSize: '0.9375rem',
                  }}
                  sx={{
                    '& .MuiListItemText-primary': {
                      transition: 'font-weight 0.2s ease-in-out',
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider sx={{ marginTop: 3, marginX: 2 }} />
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onMobileClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              marginTop: { xs: '64px', sm: '72px' },
              backgroundColor: '#FFFFFF',
              borderRight: '1px solid #E8E9EB',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              marginTop: '72px',
              backgroundColor: '#FFFFFF',
              borderRight: '1px solid #E8E9EB',
              boxShadow: 'none',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

