import * as React from 'react';
import AddIcon from '@mui/icons-material/Add';

import { SavedQueriesList, FilterLiveSearch, FilterList, FilterListItem, required, ImageField, ImageInput, SearchInput } from 'react-admin';
import { Card, CardContent, Chip, Box, Typography, useMediaQuery } from '@mui/material';
import CategoryIcon from '@mui/icons-material/LocalOffer';
import jsonExport from 'jsonexport/dist';

import { ImportButton } from "react-admin-import-csv";
import { CreateButton, ExportButton } from "ra-ui-materialui";

import {
    DeleteButton,
    Show,
    ShowButton,
    SimpleShowLayout,
    SimpleList,
    RichTextField,
    DateField,
    List,
    Edit,
    Create,
    Datagrid,
    ReferenceField,
    TextField,
    useTranslate,
    TopToolbar,
    useGetIdentity,
} from 'react-admin';

const QuickFilter = ({ label }) => {
    const translate = useTranslate();
    return <Chip sx={{ marginBottom: 1 }} label={translate(label)} />;
};

const config= {
    // Enable logging
    logging: true,
    // Disable the attempt to use "createMany", will instead just use "create" calls
    disableCreateMany: true,
    // Disable the attempt to use "updateMany", will instead just use "update" calls
    disableUpdateMany: true,
    // Disable the attempt to use "getMany", will instead just use "getSingle" calls
    disableGetMany: true,
    // Disable "import new" button
    disableImportNew: false,
    // Disable "import overwrite" button
    disableImportOverwrite: false,
};

const ListActions = (props) => {
    const {
        className,
        basePath,
        total,
        resource,
        currentSort,
        filterValues,
        exporter,
    } = props;
    return (
        <TopToolbar className={className}>

        </TopToolbar>
    );
};


const Empty = () => (
    <Box textAlign="center" m={1}>
        <Typography variant="h6" paragraph>
            No has recibido ninguna notificación...
        </Typography>
    </Box>
);

export const NotificacionesList = props => {
    const { data, isLoading: identityLoading } = useGetIdentity();
    const isSmall = useMediaQuery(
        theme => theme.breakpoints.down('sm'),
        { noSsr: true }
    );
    if (identityLoading){
        return <>Loading...</>;
    }else{
        const { id, fullName} = data;
        return(
            <List {...props} actions={<ListActions />} empty={<Empty />} filter={{ usuario_id: id }}>
            {isSmall ? (
                <SimpleList
                    primaryText={record => `Notificacion del ${new Date(record.fechaDeCreacion).toLocaleDateString()}`}
                    secondaryText={record => record.contenido}
                />
            ) : (
                <Datagrid>
                    <DateField source="fechaDeCreacion" label="Fecha" />
                    <TextField source="contenido" label="Contenido"/>
                    <DeleteButton label="Eliminar"/>
                </Datagrid>
            )}
            </List>
        )
    }   
};
