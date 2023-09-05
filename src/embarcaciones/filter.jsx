import * as React from 'react';

import ContentFilter from '@mui/icons-material/FilterList';

import { useForm, FormProvider } from 'react-hook-form';
import { Box, Button, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { TextInput, useListContext } from 'react-admin';

export const EmbarcacionFilterButton = () => {
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

export const EmbarcacionFilterForm = () => {
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
                            source="nombre"
                            label="Buscar por nombre"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment>
                                        <SearchIcon color="disabled" />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Box>
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