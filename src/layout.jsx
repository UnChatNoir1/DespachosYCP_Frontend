import { Layout } from 'react-admin';
import { ReactQueryDevtools } from 'react-query/devtools';
import { PersonalMenu } from './menu.jsx';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import { forwardRef } from 'react';
import { useLogout } from 'react-admin';
import MenuItem from '@mui/material/MenuItem';
import ExitIcon from '@mui/icons-material/PowerSettingsNew';

import { 
    AppBar,
    Menu,
    UserMenu,
    Logout,
    useGetIdentity,
    RefreshIconButton,
    usePermissions,
    useCreatePath,
} from 'react-admin';

const MyLogoutButton = forwardRef((props, ref) => {
    const logout = useLogout();
    const handleClick = () => logout();
    return (
        <MenuItem
            onClick={handleClick}
            ref={ref}
            // It's important to pass the props to allow Material UI to manage the keyboard navigation
            {...props}
        >
            <ExitIcon />  Cerrar Sesión
        </MenuItem>
    );
});

const UserAppBar = () => {
    const { data, isLoading: identityLoading } = useGetIdentity();
    const createPath = useCreatePath();    
    if (identityLoading){
        return <>Loading...</>;
    }else{
        const { id, fullName} = data;
        let path = "/usuarios/"+id+"/show";
        return(
            <AppBar 
                toolbar={
                    <>
    
                    </>
                }
                userMenu={
                    <UserMenu>
                        {<Menu.Item to={path} primaryText="Ver perfil" leftIcon={<ManageAccountsIcon />}/>}                
                        <MyLogoutButton />
                    </UserMenu>
                } 
            />
        )
    }
};

const AdminAppBar = () => {
    return(
        <AppBar 
            toolbar={
                <>
                    <RefreshIconButton />
                </>
            }
            userMenu={
                <UserMenu>
                    <MyLogoutButton />
                </UserMenu>
            } 
        />
    )
};

export const MyLayout = props => {
    const { isLoading, permissions } = usePermissions();
    if (isLoading){
        return <>Loading...</>;
    }else{
        if (permissions === 'admin'){
            return(
                <>
                    <Layout {...props} menu={PersonalMenu} appBar={AdminAppBar}/>        
                </>
            )
        }else if (permissions === 'user'){
            return(
                <>
                    <Layout {...props} menu={PersonalMenu} appBar={UserAppBar} />        
                </>
            )
        }
    }
};
