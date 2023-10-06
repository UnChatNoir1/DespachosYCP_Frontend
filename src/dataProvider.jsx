import simpleRestProvider from 'ra-data-simple-rest';

//const dataProvider = simpleRestProvider('http://localhost:3000/api');

//const myDataProvider = {
//  ...dataProvider,
//  update: (resource, params) => {
//    console.log("se podrian hacer cambios")
    /*if (resource !== 'despachos' || params.data.Imagen.src == null) {
      return dataProvider.update(resource, params);
    }*/
    /*console.log("params ")
    console.log(params)
    const newPictures = [params.data.Imagen];
    const formerPictures = [params.data.Imagen];

    return Promise.all(newPictures.map(convertFileToBase64))
      .then(base64Pictures =>
        base64Pictures.map(picture64 => ({
          src: picture64,
          title: `${params.data.id}`,
        }))
      )
      .then(transformedNewPictures =>
        dataProvider.update(resource, {
          id: params.data.id,
          data: {
            ...params.data,
            Imagen: transformedNewPictures[0],
          },
        })
      );*/
//  },
//  create: (resource, params) => {
//    console.log("se podrian hacer cambios")
    /*if (resource !== 'despachos' || params.data.Imagen == null || params.data.Imagen.src == null) {
      return dataProvider.create(resource, params);
    }*/
    /*console.log("params ")
    console.log(params)

    const newPictures = [params.data.Imagen];
    const formerPictures = [params.data.Imagen];

    return Promise.all(newPictures.map(convertFileToBase64))
      .then(base64Pictures =>
        base64Pictures.map(picture64 => ({
          src: picture64,
          title: `${params.data.GRAMINEAS}`,
        }))
      )
      .then(transformedNewPictures =>
        dataProvider.create(resource, {
          data: {
            ...params.data,
            Imagen: transformedNewPictures[0],
          },
        })
      );*/
    ///} else {
    //  dataProvider.create(resource, {
    //    data: { ...params.data }
    //  })
    //}
//  },
//};

//export default myDataProvider;


import jsonServerProvider from "ra-data-json-server";
import { Show } from 'ra-ui-materialui';
import { HttpError, httpClient } from 'react-admin';

const dataProvider = jsonServerProvider(/*'http://localhost:3000/api'*/'https://ggargano.zapto.org:3000/api');
const myDataProvider = {
  ...dataProvider,
  update: (resource, params) => {
    //console.log(params)
    if(params.meta.usuario_id !== 0){
      return Promise.reject(
        new HttpError("No posees los permisos necesarios para editar información.", 401, null)
      );
    }
    return dataProvider.update(resource, params);
  },
  create: (resource, params) => {
    if(resource !== 'usuarios' && resource !== 'destinos' && resource !== 'embarcaciones'){
      params.data.usuario_id = params.meta.usuario_id;
      params.data.socio = params.meta.socio;
    }
    return dataProvider.create(resource, params);
  },
  /*getOne: (resource, params) => {
    //Controla que si un usuario común quiere ver pefiles de otros usuarios no pueda hacerlo
    console.log("Entró en getOne");
    if(resource !== 'brevets' && resource !== 'destinos' && resource !== 'embarcaciones'){
      if(resource === 'usuarios'){
        if(params.meta.usuario_id !== params.id && params.meta.usuario_id !== 0){
          return Promise.reject(
            new HttpError("No puedes acceder al perfil de otros socios.", 401, null)
          );
        }        
      }
    }    
    return dataProvider.getOne(resource, params);
  },*/
  /*getList: (resource, params) => {
    console.log("Parametros de getList"+JSON.stringify(params));
    //Controla que si un usuario común quiere ver listas no pueda hacerlo
    if(resource !== 'brevets' && resource !== 'destinos' && resource !== 'embarcaciones'){
      if((resource === 'usuarios')){
        if(params.meta.usuario_id !== 0){
          return Promise.reject(
            new HttpError("Tus permisos no permiten acceso a este listado.", 401, null)
          );
        }        
      }
    }
    return dataProvider.getList(resource, params);
  },*/
  /*getList: (resource, params) => {
    // transform a filter object to a filters array with operators
    // filter is like { commentable: true, released_gte: '2018-01-01' }
    const filter = params.filter;
    const operators = { '_gte': '>=', '_lte': '<=', '_neq': '!=' };
    // filters is like [
    //    { field: "commentable", operator: "=", value: true},
    //    { field: "released", operator: ">=", value: '2018-01-01'}
    // ]
    const filters = Object.keys(filter).map(key => {
        const operator = operators[key.slice(-4)];
        return operator
            ? { field: key.slice(0, -4), operator, value: filter[key] }
            : { field: key, operator: '=', value: filter[key] };
    });
    const query = {
        pagination: params.pagination,
        sort: params.sort,
        filter: filters,
    };
    const url = `http://localhost:3000/api/${resource}?${JSON.stringify(query)}`;
    return httpClient(url).then(({ json }) => ({
        data: json,
        total: parseInt(headers.get('content-range').split('/').pop(),10),
    }));
},*/
}


export default myDataProvider;
