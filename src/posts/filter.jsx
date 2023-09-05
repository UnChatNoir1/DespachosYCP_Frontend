import * as React from 'react';

import ContentFilter from '@mui/icons-material/FilterList';

import { useForm, FormProvider } from 'react-hook-form';
import { Box, Button, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { TextInput, DateInput, NullableBooleanInput, useListContext } from 'react-admin';

export const PostFilterButton = () => {
    const { showFilter } = useListContext();
    return (
        <Button
            size="small"
            color="primary"
            onClick={() => showFilter("main")}
            startIcon={<ContentFilter />}
        >
            Filtrar
        </Button>
    );
};

export const PostFilterForm = () => {
    const {
        displayedFilters,
        filterValues,
        setFilters,
        hideFilter
    } = useListContext();

    const form = useForm({
        defaultValues: filterValues,
    });

    if (!displayedFilters.main) return null;

    const onSubmit = (values) => {
        /* */
        /*if(values.fecha_inicial || values.fecha_final){
            if(values.fecha_inicial && !values.fecha_final){
                values.embarque={ $gte: values.fecha_inicial }
            }else if(!values.fecha_inicial && values.fecha_final){
                values.embarque={ $lte: values.fecha_final }
            }else{
                values.embarque= { $gte: values.fecha_inicial, $lte: values.fecha_final }
            }
        }*/
        //console.log(values);
        /* */
        if (Object.keys(values).length > 0) {
            setFilters(values);
        } else {
            hideFilter("main");
        }
    };

    const resetFilter = () => {
        setFilters({}, []);
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Box display="flex" alignItems="flex-end" mb={1}>
                    <Box component="span" mr={2}>
                        {/* Full-text search filter. We don't use <SearchFilter> to force a large form input */}
                        <TextInput
                            resettable
                            helperText={false}
                            source="socio"
                            label="Buscar por socio"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment>
                                        <SearchIcon color="disabled" />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Box>
                    <Box component="span" mr={2}>
                        {/* Full-text search filter. We don't use <SearchFilter> to force a large form input */}
                        <TextInput
                            resettable
                            helperText={false}
                            source="destino"
                            label="Buscar por destino"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment>
                                        <SearchIcon color="disabled" />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Box>
                    <Box component="span" mr={2}>
                        {/* Full-text search filter. We don't use <SearchFilter> to force a large form input */}
                        <DateInput
                            resettable
                            helperText={false}
                            source="embarque_gte"
                            label="Despues de x Fecha"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment>
                                        <SearchIcon color="disabled" />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Box>
                    <Box component="span" mr={2}>
                        {/* Full-text search filter. We don't use <SearchFilter> to force a large form input */}
                        <DateInput
                            resettable
                            helperText={false}
                            source="embarque_lte"
                            label="Antes de x Fecha"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment>
                                        <SearchIcon color="disabled" />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Box>
                    {/*<Box component="span" mr={2}>
                        <NullableBooleanInput
                            helperText={false}
                            source="commentable"
                        />
                    </Box>*/}
                    <Box component="span" mr={2} mb={1.5}>
                        <Button variant="outlined" color="primary" type="submit">
                            Filtrar
                        </Button>
                    </Box>
                    <Box component="span" mb={1.5}>
                        <Button variant="outlined" onClick={resetFilter}>
                            Cerrar
                        </Button>
                    </Box>
                </Box>
            </form>
        </FormProvider>
    );
};