import * as React from 'react';

import { Chip, Box } from '@mui/material';
import jsonExport from 'jsonexport/dist';

import { ImportButton } from "react-admin-import-csv";
import { CreateButton, ExportButton } from "ra-ui-materialui";

import {
    DeleteButton,
    SaveButton,
    Show,
    ShowButton,
    SimpleShowLayout,
    Toolbar,
    List,
    Edit,
    Create,
    Datagrid,
    ReferenceField,
    TextField,
    EditButton,
    ReferenceInput,
    SimpleForm,
    TextInput,
    useTranslate,
    TopToolbar,
    downloadCSV,
    useRecordContext,
    usePermissions,
    useGetIdentity,
    useNotify,
    useRedirect,
} from 'react-admin';

import { EmbarcacionFilterButton, EmbarcacionFilterForm } from './filter.jsx';

import { useFormContext } from "react-hook-form";

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
    const { permissions } = usePermissions();
    const { data, isLoading: identityLoading } = useGetIdentity();
    if (identityLoading){
        return <>Loading...</>;
    }else{
        const { id, fullName} = data;
        if (permissions === 'admin'){
            return (
                <Box width="100%">
                    <TopToolbar className={className}>
                        <EmbarcacionFilterButton/>
                        <CreateButton label="Registrar embarcacion"/>
                        {/*<ExportButton
                            label="Exportar"
                            disabled={total === 0}
                            resource={resource}
                            sort={currentSort}
                            filter={filterValues}
                            exporter={exporter}
                        />*/}
                        {/*<ImportButton {...props} {...config} label="Importar"/>*/}
                    </TopToolbar>
                    <EmbarcacionFilterForm />
                </Box>
            );
        }else if(permissions === 'user'){
            return (
                <TopToolbar className={className}>
                </TopToolbar>
            );
        }
    }
};

const exporter = posts => {

    const postsForExport = posts.map(post => {
        const { Imagen, _id, __v, ...postForExport } = post;
        //postForExport.author_name = post.author.name; // add a field
        return postForExport;
    });

    jsonExport(postsForExport, {
        //headers: ['id', 'title', 'author_name', 'body'] // order fields in the export
    }, (err, csv) => {
        downloadCSV(csv, 'Usuarios'); // download as 'posts.csv` file
    });
};

/*export const PostFilterSidebar = () => (
    <Card sx={{ order: -1, mr: 2, mt: 9, width: 200 }}>
        <CardContent>
        
        <FilterLiveSearch />

        <FilterList label="Ciclo productivo" icon={<AddIcon />}>
            <FilterListItem label='Invernal' value={{ Ciclo_productivo: 'Invernal' }} />
            <FilterListItem label='Estival' value={{ Ciclo_productivo: 'Estival' }} />
            <FilterListItem label='No definido' value={{ Ciclo_productivo: '-' }} />
        </FilterList>

        </CardContent>
    </Card>
);*/

export const EmbarcacionList = props => {
    const { permissions } = usePermissions();
    const { data, isLoading: identityLoading } = useGetIdentity();
    if (identityLoading){
        return <>Loading...</>;
    }else{
        const { id, fullName} = data;
        if (permissions === 'admin'){
            return(
                <List {...props} title="Lista de Embarcaciones" exporter={exporter}/*filters={postFilters}*/ /*aside={<PostFilterSidebar />}*/ actions={<ListActions />}>
                    <Datagrid>
                        <ReferenceField source="usuario_id" reference="usuarios" label="Socio"/>
                        <TextField source="nombre" />
                        <TextField source="matricula" label="Matrícula"/>
                        <EditButton label="Editar"/>
                        <ShowButton label="Ver" />
                        <DeleteButton label="Eliminar"/>
                    </Datagrid>
                </List>
            )
        }else if(permissions === 'user'){
            return(
                <List {...props} exporter={exporter}/*filters={postFilters}*/ /*aside={<PostFilterSidebar />}*/ actions={<ListActions />} filter={{ usuario_id: id }}>
                    <Datagrid>
                        <TextField render={`${fullName}`} />
                        <TextField source="nombre" />
                        <TextField source="matricula" />
                        <ShowButton label="Ver" />
                    </Datagrid>
                </List>
            )
        }
    }
};

const Nombre = () => {
    const record = useRecordContext();
    return <span> {record ? `"${record.nombre}"` : ''}</span>;
};

export const EditToolbar = () => {
    const { reset } = useFormContext();
    const notify = useNotify();
    const redirect = useRedirect();
    return (
        <Toolbar>
            <SaveButton 
                label="Guardar" 
                mutationOptions={{
                    onSuccess: () => {
                        notify('Datos de la embarcacion actualizados.');
                        reset();
                        redirect(`/embarcaciones`);
                    }}
                }
                type="button"
                variant="text"
            />
        </Toolbar>
    )
};

export const EmbarcacionEdit = () => {
    const { data, isLoading: identityLoading } = useGetIdentity();
    if (identityLoading){
        return <>Loading...</>;
    }else{
        const { id } = data;
        return(
            <Edit title={<Nombre />} queryOptions={{ meta: { usuario_id: id } }} mutationOptions={{ meta: { usuario_id: id } }}>
                <SimpleForm toolbar={<EditToolbar />}>
                    <ReferenceInput source="usuario_id" reference="usuarios" />
                    <TextInput source="nombre" />
                    <TextInput source="matricula" />
                </SimpleForm>
            </Edit>
        )
    }
};

export const CreateToolbar = () => {
    const { reset } = useFormContext();
    const notify = useNotify();
    const redirect = useRedirect();
    return (
        <Toolbar>
            <SaveButton 
                label="Registrar" 
                mutationOptions={{
                    onSuccess: () => {
                        notify('Embarcacion registradada');
                        reset();
                        redirect(`/embarcaciones`);
                    }}
                }
                type="button"
                variant="text"
            />
        </Toolbar>
    )
};

export const EmbarcacionCreate = () => (
    <Create>
    <SimpleForm toolbar={<CreateToolbar />}>
        <ReferenceInput source="usuario_id" reference="usuarios" />
        <TextInput source="nombre" />
        <TextInput source="matricula" />
    </SimpleForm>
    </Create>
);

export const EmbarcacionShow = props => (
    <Show {...props}>
    <SimpleShowLayout>
        <ReferenceField source="usuario_id" reference="usuarios" />
        <TextField source="nombre" />
        <TextField source="matricula" />
    </SimpleShowLayout>
    </Show>
);