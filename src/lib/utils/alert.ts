import Swal, { type SweetAlertResult } from "sweetalert2";


const config = {
    confirmButtonColor: '#056B01', // TODO: Cambiar por el color de la aplicación
    cancelButtonColor: '#d33',
    toast: false, // Desactivamos el modo 'toast' para que use modal completa
    allowOutsideClick: false, // Evita cerrar con clic fuera
    allowEscapeKey: false, // Evita cerrar con la tecla 'Escape'
    allowEnterKey: false, // Evita cerrar con la tecla 'Enter'
    backdrop: true, // Bloquea la pantalla de fondo
}
export function showConfirmationAlert(title: string, text: string, confirmButtonText: string = "Confirmar", cancelButtonText: string = "Cancelar"): Promise<SweetAlertResult<any>> {
    return Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
        ...config
    });
}