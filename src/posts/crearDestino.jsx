import React from 'react';
import { useCreate, useCreateSuggestionContext } from 'react-admin';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    TextField,
} from '@mui/material';

export const CreateDestino = () => {
    const { filter, onCancel, onCreate } = useCreateSuggestionContext();
    const [create] = useCreate();
    const [value, setValue] = React.useState(filter || '');

    const handleSubmit = event => {
        event.preventDefault();
        create(
            'destinos',
            { data: { nombre: value } },
            {
                onSuccess: (data) => {
                    setValue('');
                    onCreate(data);
                },
            }
        );
    };

    return (
        <Dialog open onClose={onCancel}>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        label="Añadir un destino"
                        value={value}
                        onChange={event => setValue(event.target.value)}
                        autoFocus
                    />
                </DialogContent>
                <DialogActions>
                    <Button type="submit">Guardar</Button>
                    <Button onClick={onCancel}>Cancelar</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};