import * as React from 'react';

import { required } from 'react-admin';
import { Chip, Box} from '@mui/material';
import jsonExport from 'jsonexport/dist';

import { ImportButton } from "react-admin-import-csv";
import { CreateButton, ExportButton } from "ra-ui-materialui";

import {
  DeleteButton,
  Toolbar, 
  SaveButton,
  Show,
  ShowButton,
  SimpleShowLayout,
  SingleFieldList,
  List,
  Edit,
  Create,
  Datagrid,
  ReferenceField,
  ReferenceManyField,
  ReferenceOneField,
  ReferenceManyCount,
  TextField,
  ChipField,
  EditButton,
  ReferenceInput,
  SelectInput,
  DateInput,
  SimpleForm,
  TextInput,
  Labeled, 
  useTranslate,
  TopToolbar,
  downloadCSV,
  useRecordContext,
  useNotify,
  useGetIdentity,
  useRedirect,
} from 'react-admin';

import { UserFilterButton, UserFilterForm } from './filter.jsx';

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
  return (
    <Box width="100%">
      <TopToolbar className={className}>
        {/*<SortButton fields={['despachos', 'sales', 'stock']} />*/}
        <UserFilterButton/>
        <CreateButton label="Registrar usuario"/>
        {/*<ExportButton
          label="Exportar"
          disabled={total === 0}
          resource={resource}
          sort={currentSort}
          filter={filterValues}
          exporter={exporter}
        />*/}
        {/*<ImportButton {...props} {...config}
          label="Importar"/>*/}     
      </TopToolbar>
      <UserFilterForm />
    </Box>
  );
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

export const UserList = props => {
  const { data, isLoading: identityLoading } = useGetIdentity();
  if (identityLoading){
    return <>Loading...</>;
  }else{
    const { id } = data;
    return(
      <List {...props} title="Lista de Socios" exporter={exporter}/*filters={postFilters}*/ /*aside={<PostFilterSidebar />}*/ actions={<ListActions />} queryOptions={{ meta: { usuario_id: id } }}>
        <Datagrid>
          <TextField source="CI" label="C.I"/>
          <TextField source="nombre" />
          <TextField source="apellido" />
          <ReferenceManyField label="Embarcaciones" reference="embarcaciones" target="usuario_id">
              <SingleFieldList>
                  <ChipField source="nombre" />
              </SingleFieldList>
          </ReferenceManyField>
          <ReferenceField source="brevet_id" reference="brevets" emptyText="Brevet no encontrada" label="Nro de Brevet"/>
          <ReferenceManyCount
                    label="Nro de Despachos"
                    reference="despachos"
                    target="usuario_id"
                    link
          />
          <EditButton label="Editar"/>
          <ShowButton label="Ver" />
          <DeleteButton label="Eliminar"/>
        </Datagrid>
      </List>
    )
  }
};

const Username = () => {
  const record = useRecordContext();
  return <span>Socio: {record ? `${record.nombre} ${record.apellido}` : ''}</span>;
};

const EditToolbar = () => {
  const { reset } = useFormContext();
  const notify = useNotify();
  const redirect = useRedirect();
  return (
    <Toolbar>
        <SaveButton 
          label="Guardar" 
          mutationOptions={{
            onSuccess: () => {
                notify('Datos del socio actualizados.');
                reset();
                redirect(`/usuarios`);
            }}
          }
          type="button"
          variant="text"
          /*onClick={() => alert('Guardando...')}*/
        />
    </Toolbar>
  )
};

export const UserEdit = () => {
  const { data, isLoading: identityLoading } = useGetIdentity();
  if (identityLoading){
    return <>Loading...</>;
  }else{
    const { id } = data;
    return(
      <Edit redirect="list" title={<Username />} queryOptions={{ meta: { usuario_id: id } }} mutationOptions={{ meta: { usuario_id: id } }}>
        <SimpleForm toolbar={<EditToolbar />}>
          <TextInput source="CI" label="C.I"/>
          <TextInput source="nombre" />
          <TextInput source="apellido" />
          <TextInput source="direccion" label="Dirección"/>
          <TextInput source="telefono" label="Teléfono"/>
          <ReferenceInput disabled source="brevet_id" reference="brevets" sx={{ width: '30%' }}/>
          <DateInput source="vencimientoBrevet" label="Vencimiento de Brevet" validate={required()}/>
          <SelectInput 
            source="categoriaBrevet" 
            choices={[
              { id: 'a', name: 'A' },
              { id: 'b', name: 'B' },
              { id: 'c', name: 'C' },
              { id: 'd', name: 'D' }
            ]}
            label="Categoría de Brevet"
            validate={required()}
            sx={{ width: '15%' }} 
            />
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
                notify('Socio registrado');
                reset();
                redirect(`/usuarios`);
            }}
          }
          type="button"
          variant="text"
        />
    </Toolbar>
  )
};

export const UserCreate = () => (
  <Create redirect="list">
    <SimpleForm toolbar={<CreateToolbar />}>
      <TextInput source="CI" label="C.I" validate={required()}/>
      <TextInput source="nombre" validate={required()}/>
      <TextInput source="apellido" validate={required()}/>
      <TextInput source="direccion" label="Dirección"/>
      <TextInput source="telefono" label="Teléfono"/>
      <TextInput source="nroBrevet" label="Nro de Brevet" validate={required()}/>
      <DateInput source="vencimientoBrevet" label="Vencimiento de Brevet" validate={required()}/>
      <SelectInput 
        source="categoriaBrevet" 
        choices={[
          { id: 'a', name: 'A' },
          { id: 'b', name: 'B' },
          { id: 'c', name: 'C' },
          { id: 'd', name: 'D' }
        ]}
        label="Categoría de Brevet"
        validate={required()}
        sx={{ width: '15%' }} 
        />        
    </SimpleForm>
  </Create>
);

export const UserShow = props => {
  const { data, isLoading: identityLoading } = useGetIdentity();
  if (identityLoading){
    return <>Loading...</>;
  }else{
    const { id } = data;
    return(
      <Show {...props} title={<Username />} queryOptions={{ meta: { usuario_id: id}}}>
        <SimpleShowLayout>
          <Labeled label="C.I">
            <TextField source="CI" />
          </Labeled>
          <Labeled label="Nombre">
            <TextField source="nombre" />
          </Labeled>
          <Labeled label="Apellido">
            <TextField source="apellido" />
          </Labeled>
          <Labeled label="Dirección">
            <TextField source="direccion" />
          </Labeled>
          <Labeled label="Teléfono">
            <TextField source="telefono" />
          </Labeled>
          <ReferenceManyField label="Embarcaciones" reference="embarcaciones" target="usuario_id">
            <Datagrid bulkActionButtons={false} >
              <TextField source="nombre" />
              <TextField source="matricula" />
            </Datagrid>
          </ReferenceManyField>
          <Labeled label="Nro de Brevet">
            <ReferenceField source="brevet_id" reference="brevets" emptyText="Brevet no encontrada" />
          </Labeled>
          <ReferenceOneField label="Vencimiento de Brevet" reference="brevets" target="usuario_id">
            <TextField source="vencimiento" />
          </ReferenceOneField>
          <ReferenceOneField label="Categoria de Brevet" reference="brevets" target="usuario_id">
              <TextField source="categoria" />
          </ReferenceOneField>
        </SimpleShowLayout>
      </Show>
    )
  }
};