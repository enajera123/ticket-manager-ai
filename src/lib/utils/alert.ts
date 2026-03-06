import Swal, { type SweetAlertResult } from "sweetalert2";

const config = {
  confirmButtonColor: 'var(--primary)',
  cancelButtonColor: 'var(--destructive)',
  toast: false,
  allowOutsideClick: false,
  allowEscapeKey: false,
  allowEnterKey: false,
  backdrop: true,

  customClass: {
    popup: "app-swal-popup",
    title: "app-swal-title",
    htmlContainer: "app-swal-text",
    confirmButton: "app-swal-confirm",
    cancelButton: "app-swal-cancel",
    actions: "app-swal-actions",
  }
}

export function showConfirmationAlert(
  title: string,
  text: string,
  confirmButtonText: string = "Confirmar",
  cancelButtonText: string = "Cancelar"
): Promise<SweetAlertResult<any>> {
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