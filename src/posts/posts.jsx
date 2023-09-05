import * as React from 'react';

import { required } from 'react-admin';
import { Chip, Box, useMediaQuery } from '@mui/material';
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
  DateField,
  NumberField,
  List,
  SimpleList,
  Edit,
  Create,
  Datagrid,
  TextField,
  ReferenceField,
  EditButton,
  ReferenceInput,
  AutocompleteInput,
  DateInput,
  NumberInput,
  SimpleForm,
  TextInput,
  TimeInput,
  Loading,
  Labeled,
  useTranslate,
  TopToolbar,
  downloadCSV,
  useGetList,
  useRecordContext,
  usePermissions,
  useGetIdentity,
  useNotify,
  useRedirect,
} from 'react-admin';

import { PostFilterButton, PostFilterForm } from './filter.jsx';
import { CreateDestino } from './crearDestino.jsx';

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
            <PostFilterButton />
            <CreateButton label="Registrar"/>
            <ExportButton
              label="Exportar"
              disabled={total === 0}
              resource={resource}
              sort={currentSort}
              filter={filterValues}
              exporter={exporter}
            />
            {/*<ImportButton {...props} {...config}
              label="Importar"/>*/}
          </TopToolbar>
          <PostFilterForm />
        </Box>
      );
    }else if(permissions === 'user'){
      return (
        <Box width="100%">
          <TopToolbar className={className}>
            <CreateButton label="Registrar despacho"/>
          </TopToolbar>
        </Box>
      );
    }
  }
};

const exporter = posts => {

  const postsForExport = posts.map(post => {
    const { Imagen, _id, __v, id, usuario_id, destino_id, embarcacion_id, regreso, embarque, vencimientoBrevet, ...postForExport } = post;
    let auxHoras1= new Date(post.embarque);
    let auxHoras2= new Date(post.regreso);
    //postForExport.author_name = post.author.name; // add a field
    postForExport.embarque = auxHoras1.toLocaleDateString();
    postForExport.hora_salida = auxHoras1.toTimeString().replace("GMT-0300 (Uruguay Standard Time)", "");
    postForExport.hora_regreso = auxHoras2.toTimeString().replace("GMT-0300 (Uruguay Standard Time)", "");
    postForExport.vencimientoBrevet = new Date(post.vencimientoBrevet).toLocaleDateString();
    return postForExport;
  });

  jsonExport(postsForExport, {
    headers: ['embarque', 'embarcacion', 'matriculaEmbarcacion', 'categoriaBrevet', 'destino', 'hora_salida ', 'hora_regreso', 'nroTripulantes', 'socio', 'nroBrevet', 'vencimientoBrevet'] // order fields in the export
  }, (err, csv) => {
    downloadCSV(csv, 'DespachosYCP'); // download as 'posts.csv` file
  });
};

/*export const PostFilterSidebar = () => (
  <Card sx={{ order: -1, mr: 2, mt: 9, width: 200 }}>
    <CardContent>
      
      <FilterLiveSearch source="socio" />

      <FilterList label="Ciclo productivo" icon={<AddIcon />}>
        <FilterListItem label='Invernal' value={{ Ciclo_productivo: 'Invernal' }} />
        <FilterListItem label='Estival' value={{ Ciclo_productivo: 'Estival' }} />
        <FilterListItem label='No definido' value={{ Ciclo_productivo: '-' }} />
      </FilterList>

    </CardContent>
  </Card>
);*/

const postFilters = [
  <TextInput source="q" label="Buscar" alwaysOn />,
  <ReferenceInput source="userId" label="User" reference="users" />,
  <DateInput source="embarque_gte" label="Released after" alwaysOn/>,
  <DateInput source="embarque_lte" label="Released before" alwaysOn/>
];


export const PostList = props => {
  const { permissions } = usePermissions();
  const { data, isLoading: identityLoading } = useGetIdentity();
  const isSmall = useMediaQuery(
    theme => theme.breakpoints.down('sm'),
    { noSsr: true }
  );
  if (identityLoading){
    return <>Loading...</>;
  }else{
    const { id, fullName} = data;
    if (permissions === 'admin'){
      return(    
        <List {...props} title="Lista de Despachos registrados" exporter={exporter} /*filters={postFilters}*/ /*aside={<PostFilterSidebar />}*/ actions={<ListActions />} queryOptions={{ meta: { permisos: permissions } }}>
          <Datagrid>    
            <ReferenceField source="usuario_id" reference="usuarios" label="Socio"/>
            <DateField source="embarque" showTime/>
            <DateField source="regreso" showTime/>
            <ReferenceField source="embarcacion_id" reference="embarcaciones" label="Embarcación"/>
            <ReferenceField source="destino_id" reference="destinos" />
            <TextField source="nroTripulantes" label="Personas"/>
            <ShowButton label="Ver" />
            <DeleteButton label="Eliminar"/>
          </Datagrid>
        </List>
      )
    }else if(permissions === 'user'){
      return(    
        <List {...props} title="Despachos registrados" exporter={exporter}/*filters={postFilters}*/ /*aside={<PostFilterSidebar />}*/ actions={<ListActions />} filter={{ usuario_id: id }}>
          {isSmall ? (
            <SimpleList
            primaryText={(record) => `Embarque del ${new Date(record.embarque).toLocaleDateString()}`}
            /*tertiaryText={(record) => `Embarcacion: ${record.embarcacion}`}*/
            secondaryText={(record) => `Destino: ${record.destino}`}
            linkType={record => record.canEdit ? "edit" : "show"} 
            
            sx={{fontSize: 5}} 
            />
          ) : (
            <Datagrid>  
              <DateField source="embarque" showTime/>
              <DateField source="regreso" showTime/>
              <TextField source="embarcacion" label="Embarcación"/>
              <ReferenceField source="destino_id" reference="destinos" />
              <TextField source="nroTripulantes" label="Personas"/>
              <ShowButton label="Ver" />
            </Datagrid>
          )}
        </List>
      )
    }
  } 
};

const PostTitle = () => {
  const record = useRecordContext();
  return <span>Despacho {record ? `"${record.id}"` : ''}</span>;
};

const DestinosInput = () => {
  const { data, isLoading } = useGetList('destinos');
  const isSmall = useMediaQuery(
    theme => theme.breakpoints.down('sm'),
    { noSsr: true }
  );
  if (isLoading){
    return <>Loading...</>;
  }else{
    return (     
      <ReferenceInput reference="destinos" source="destino_id">
        {isSmall ? (
            <AutocompleteInput 
                label="Destino"
                source="destino_id"
                choices={data}
                optionText="nombre"
                validate={required()}
                create={<CreateDestino />}
                TextFieldProps={{
                  placeholder: 'Añada un destino',
                }}
                sx={{ width: '60%' }}                                
            />
            ) : (
              <AutocompleteInput 
                label="Destino"
                source="destino_id"
                choices={data}
                optionText="nombre"
                validate={required()}
                create={<CreateDestino />}
                TextFieldProps={{
                  placeholder: 'Añada un destino',
                }}
                sx={{ width: '20%' }}                                
            />
            )}
        </ReferenceInput>
    );
  }
};

const SociosInput = () => {
  const { data, isLoading } = useGetList('usuarios');
  const optionRenderer = choice => `${choice.nombre} ${choice.apellido}`;
  if (isLoading){
    return <>Loading...</>;
  }else{
    return (
      <ReferenceInput reference="usuarios" source="usuario_id" >
            <AutocompleteInput 
                label="Socio"
                source="usuario_id"
                choices={data}
                optionText={optionRenderer}
                validate={required()}
                sx={{ width: '20%' }}
            />
        </ReferenceInput>
    );
  }
};

const EmbarcacionesInputUser = () => {
  const { permissions } = usePermissions();
  const { data: identityData, isLoading: identityLoading } = useGetIdentity();
  const { id, fullName} = identityData;
  const { data: listData, total, isLoading, error } = useGetList(
    'embarcaciones',
    { 
        filter: { usuario_id: id}
    }
  );
  return (
    <AutocompleteInput 
        label="Embarcación"
        source="embarcacion_id"
        choices={listData}
        optionText="nombre"
        validate={required()}
        sx={{ width: '20%' }}
    />
  );
};

const EmbarcacionesInputAdmin = () => {
  const { data, isLoading } = useGetList('embarcaciones');
  if (isLoading){
    return <>Loading...</>;
  }else{
    return (
      <ReferenceInput reference="embarcaciones" source="embarcacion_id" >
        <AutocompleteInput 
          label="Embarcación"
          source="embarcacion_id"
          choices={data}
          optionText="nombre"
          validate={required()}
          sx={{ width: '20%' }}
        />
        </ReferenceInput>
    );
  }
};

export const PostEdit = () => (
  <Edit title={<PostTitle />}>
    <SimpleForm>
      <TextInput disabled source="socio" />
      <DateInput source="embarque" validate={required()}/>
      <TimeInput source="hora_salida" validate={required()}/>
      <DateInput source="regreso" validate={required()}/>
      <TimeInput source="hora_llegada" />
      <ReferenceInput source="embarcacion_id" reference="embarcaciones" validate={required()}/>
      <DestinosInput/>      
      <NumberInput source="nroTripulantes" validate={required()}/>
      <TextInput source="nroBrevet" validate={required()}/> 
    </SimpleForm>
  </Edit>
);

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
                notify('Despacho registrado');
                reset();
                redirect(`/despachos`);                
            }}
          }
          type="button"
          variant="text"
          /*onClick={() => alert('Guardando...')}*/
        />
    </Toolbar>
  )
};

export const PostCreate = () => {
  const { permissions } = usePermissions();
  const { data, isLoading: identityLoading } = useGetIdentity();
  const isSmall = useMediaQuery(
    theme => theme.breakpoints.down('sm'),
    { noSsr: true }
  );
  if (identityLoading){
    return <>Loading...</>;
  }else{
    const { id, fullName} = data;
    if (permissions === 'admin'){
      return(
        <Create redirect="list" mutationOptions={{ meta: { usuario_id: id, socio: fullName } }} >          
            <SimpleForm toolbar={<CreateToolbar />}>
              <SociosInput/> 
              <DateInput source="embarque" label="Fecha de Embarque" validate={required()}/>
              <TimeInput source="hora_salida" label="Hora de Salida" validate={required()} sx={{ width: '10%' }}/>
              <DateInput source="regreso" label="Fecha de Regreso" validate={required()}/>
              <TimeInput source="hora_llegada" label="Hora de Regreso" validate={required()} sx={{ width: '10%' }}/>
              {/*<ReferenceInput source="embarcacion_id" reference="embarcaciones" validate={required()} sx={{ width: '25%' }}/>*/}
              <EmbarcacionesInputAdmin/> 
              <DestinosInput/>      
              <NumberInput source="nroTripulantes" label="Personas" min={1} validate={required()} sx={{ width: '10%' }}/>
              <TextInput source="nroBrevet" label="Nro de Brevet" validate={required()}/> 
            </SimpleForm>         
        </Create>
      )
    }else if(permissions === 'user'){
      return(
        <Create title="Registrar Despacho" redirect="list" mutationOptions={{ meta: { usuario_id: id, socio: fullName } }} >
          {isSmall ? (
            <SimpleForm toolbar={<CreateToolbar />}>
              <DateInput source="embarque" label="Fecha de Embarque" validate={required()} sx={{ width: '60%' }}/>
              <TimeInput source="hora_salida" label="Hora de Salida" validate={required()} sx={{ width: '47%' }}/>
              <DateInput source="regreso" label="Fecha de Regreso" validate={required()} sx={{ width: '60%' }}/>
              <TimeInput source="hora_llegada" label="Hora de Regreso" validate={required()} sx={{ width: '47%' }}/>
              {/*<ReferenceInput source="embarcacion_id" reference="embarcaciones" validate={required()}/>*/}
              <EmbarcacionesInputUser/>
              <DestinosInput/>
              {/*<ReferenceInput source="destino_id" reference="destinos" validate={required()} sx={{ width: '60%' }}/>*/}   
              <NumberInput source="nroTripulantes" label="Personas" min={1} validate={required()} sx={{ width: '47%' }}/>
              <TextInput source="nroBrevet" label="Nro de Brevet" validate={required()} sx={{ width: '60%' }}/> 
            </SimpleForm>
          ) : (
          <SimpleForm toolbar={<CreateToolbar />}>
            <DateInput source="embarque" label="Fecha de Embarque" validate={required()}/>
            <TimeInput source="hora_salida" label="Hora de Salida" validate={required()} sx={{ width: '10%' }}/>
            <DateInput source="regreso" label="Fecha de Regreso" validate={required()}/>
            <TimeInput source="hora_llegada" label="Hora de Regreso" validate={required()} sx={{ width: '10%' }}/>
            {/*<ReferenceInput source="embarcacion_id" reference="embarcaciones" validate={required()}/>*/}
            <EmbarcacionesInputUser/>
            <DestinosInput/>
            {/*<ReferenceInput source="destino_id" reference="destinos" validate={required()}/>   */}
            <NumberInput source="nroTripulantes" label="Personas" min={1} validate={required()} sx={{ width: '10%' }}/>
            <TextInput source="nroBrevet" label="Nro de Brevet" validate={required()}/> 
          </SimpleForm>
          )}
        </Create>
      )
    }
  }
};

export const PostShow = props => {
  const { permissions } = usePermissions();
  const { data, isLoading: identityLoading } = useGetIdentity();
  if (identityLoading){
    return <>Loading...</>;
  }else{
    const { id, fullName} = data;
    if (permissions === 'admin'){
      return(
        <Show {...props}>
          <SimpleShowLayout>
            <Labeled label="Socio">
              <ReferenceField source="usuario_id" reference="usuarios" />
            </Labeled>
            <Labeled label="Tiempo de Embarque">
              <DateField source="embarque" />
            </Labeled>
            <Labeled label="Tiempo de Regreso">
              <DateField source="regreso" />
            </Labeled>
            <Labeled label="Embarcación">
              <ReferenceField source="embarcacion_id" reference="embarcaciones" />
            </Labeled>
            <Labeled label="Matrícula">
              <TextField source="matriculaEmbarcacion" />
            </Labeled>
            <Labeled label="Destino">
              <ReferenceField source="destino_id" reference="destinos" />
            </Labeled>
            <Labeled label="Personas">
              <NumberField source="nroTripulantes" />
            </Labeled>
            <Labeled label="Nro de Brevet">
              <TextField source="nroBrevet" />
            </Labeled>
            <Labeled label="Vencimiento">
              <TextField source="vencimientoBrevet" /> 
            </Labeled>
            <Labeled label="Categoría">
              <TextField source="categoriaBrevet" />  
            </Labeled>
          </SimpleShowLayout>
        </Show>
      )
    }else if(permissions === 'user'){
      return(
        <Show {...props}>
          <SimpleShowLayout>
            <Labeled label="Socio">
              <TextField source="socio" />
            </Labeled>
            <Labeled label="Tiempo de Embarque">
              <DateField source="embarque" />
            </Labeled>
            <Labeled label="Tiempo de Regreso">
              <DateField source="regreso" />
            </Labeled>
            <Labeled label="Embarcación">
              <TextField source="embarcacion" />
            </Labeled>
            <Labeled label="Matrícula">
              <TextField source="matriculaEmbarcacion" />
            </Labeled>
            <Labeled label="Destino">
              <ReferenceField source="destino_id" reference="destinos" />
            </Labeled>
            <Labeled label="Personas">
              <NumberField source="nroTripulantes" />
            </Labeled>
            <Labeled label="Nro de Brevet">
              <TextField source="nroBrevet" />
            </Labeled>
            <Labeled label="Vencimiento">
              <TextField source="vencimientoBrevet" /> 
            </Labeled>
            <Labeled label="Categoría">
              <TextField source="categoriaBrevet" />  
            </Labeled> 
          </SimpleShowLayout>
        </Show>
      )
    }
  }
};





