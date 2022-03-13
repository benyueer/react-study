import Form from "./Form";
import Field from "./Field";
import React from "react";
import useForm from "./useForm";
export { Field, useForm }

const ForwardRefForm = React.forwardRef(Form)
// @ts-ignore
ForwardRefForm.useForm = useForm

export default ForwardRefForm