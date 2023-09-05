import * as React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Title, usePermissions, } from 'react-admin';
import { useMediaQuery } from '@mui/material';

export default () => {
  const { isLoading, permissions } = usePermissions();
  const isSmall = useMediaQuery(
    theme => theme.breakpoints.down('sm'),
    { noSsr: true }
  );

  const styles = {
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9,
      marginTop:'30'
    }
  };

  if (isLoading){
    return <>Loading...</>;
  }else{
    if (permissions === 'admin'){
      return(
        <Card sx={{ maxWidth: 800 }}>
          {isSmall ? (
            <Title title="Administración de Despachos" />
          ) : (            
            <Title title="Bienvenido a la aplicación de Administración de Despachos" />
          )}
          <CardMedia
            image="/ycp-bahia-background.jpg"
            title="Yacht Club Paysandú"
            style={styles.media} // specify styles
          />
          <CardContent>
            Este sistema fue desarrollado dentro del contexto de pasantía del año 2023 bajo el Tenólogo en Informatica para el Yacht Club Paysandú.
            <br />
            <strong>Carrera:</strong> Tecnólogo en Informática
            <br />
            <strong>Año de realización:</strong> 2023
          </CardContent>
        </Card>
      )
    }else if (permissions === 'user'){
      return(
        <Card sx={{ maxWidth: 800 }}>
          {isSmall ? (
            <Title title="Registro de Despachos" />
          ) : (            
            <Title title="Bienvenido a la aplicación de Registro de Despachos" />
          )}
          <CardMedia
            image="/ycp-bahia-background.jpg"
            title="Contemplative Reptile"
            style={styles.media} 
          />
          <CardContent>
            Este sistema fue desarrollado dentro del contexto de pasantía del año 2023 bajo el Tenólogo en Informatica para el Yacht Club Paysandú.
            <br />
            <strong>Carrera:</strong> Tecnólogo en Informática
            <br />
            <strong>Año de realización:</strong> 2023
          </CardContent>
        </Card>
      )
    }
  }
};