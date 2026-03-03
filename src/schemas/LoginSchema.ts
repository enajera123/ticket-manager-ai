import * as Yup from "yup";
export const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email("Por favor ingrese un correo electrónico válido.")
        .required("El correo electrónico es requerido."),
    password: Yup.string()
        .required("La contraseña es requerida."),
})