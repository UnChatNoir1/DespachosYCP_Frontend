import { Menu, usePermissions } from 'react-admin';

import {Card, CardMedia} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People'; //Para usuarios
import SailingIcon from '@mui/icons-material/Sailing'; //Para embarcaciones
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; //Para despachos
import SmsFailedIcon from '@mui/icons-material/SmsFailed'; //Para notificaciones

export const PersonalMenu = () => {
  const { permissions } = usePermissions();

  const styles = {
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9,
      marginTop:'30'
    }
  };

  return(
    <Menu>
      {/*<Card sx={{ maxWidth: 700 }}>
        <CardMedia
        image="/logo-ycp.png"
        title="Contemplative Reptile"
        style={styles.media}
        />
  </Card>*/}
      {<img src="/logo-ycp.png" />}
      <Menu.DashboardItem primaryText="Inicio" />
      {permissions === 'admin' &&
        <Menu.Item to="/usuarios" primaryText="Socios" leftIcon={<PeopleIcon />} />
      }
      <Menu.Item to="/despachos" primaryText="Despachos" leftIcon={<ArrowForwardIcon /> }/>
      {permissions === 'admin' &&
        <Menu.Item to="/embarcaciones" primaryText="Embarcaciones" leftIcon={<SailingIcon /> }/>
      }
      <Menu.Item to="/notificaciones" primaryText="Notificaciones" leftIcon={<SmsFailedIcon /> }/>
    </Menu>
  )
};