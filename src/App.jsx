import * as React from "react";
import { Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

import authProvider from './authProvider.js';
import MyLoginPage from './login.jsx';
import Footer from './footer.jsx'

import { PostList, PostEdit, PostCreate, PostShow, PostFilterSidebar} from './posts/posts.jsx';
import { UserList, UserEdit, UserCreate, UserShow} from './usuarios/users.jsx';
import { EmbarcacionList, EmbarcacionEdit, EmbarcacionCreate, EmbarcacionShow} from './embarcaciones/embarcaciones.jsx';
import { NotificacionesList } from './notificaciones/notificaciones.jsx';

import { MyLayout } from './layout.jsx';

import Dashboard from './dashboard.jsx';

import myDataProvider from './dataProvider.jsx'

import './App.css'
import './footer.jsx'

export default function App() {
  return (
    <main>
      <Admin dashboard={Dashboard} dataProvider={myDataProvider} layout={MyLayout} loginPage={MyLoginPage} authProvider={authProvider} requireAuth>
        {permissions => (
          <>         
          <Resource 
            name="usuarios"  
            list=/*{UserList}*/{permissions === 'admin' ? UserList : null}  
            edit={UserEdit}/*{permissions === 'admin' ? UserEdit : null}*/ 
            show={UserShow} 
            create=/*{UserCreate}*/{permissions === 'admin' ? UserCreate : null} 
            recordRepresentation={(record) => `${record.nombre} ${record.apellido}`} 
          />          
          <Resource name="despachos" list={PostList} show={PostShow} create={PostCreate} />                
          <Resource 
            name="embarcaciones" 
            list={EmbarcacionList} 
            edit=/*{EmbarcacionEdit}*/{permissions === 'admin' ? EmbarcacionEdit : null} 
            show={EmbarcacionShow} 
            create=/*{EmbarcacionCreate}*/{permissions === 'admin' ? EmbarcacionCreate : null}  
            recordRepresentation={(record) => `${record.nombre}`} 
          />         
          <Resource name="brevets" recordRepresentation={(record) => `${record.nro}`} />
          <Resource name="notificaciones" list={NotificacionesList} /> 
          <Resource name="destinos" recordRepresentation={(record) => `${record.nombre}`}/>
          </>
        )}    
      </Admin>
      {/*<Footer />*/}
    </main>
  )
}
