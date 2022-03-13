import React, { forwardRef, useImperativeHandle } from 'react'
import FieldContext from './FieldContext'
import useForm from './useForm'


interface FormProps {
  children: React.ReactNode,
  form: any,
  onFinish: (val: any) => void,
  onFinishFailed: (val: any) => void,
}

export default function Form({children, onFinish, onFinishFailed, form}: FormProps, ref: any) {


  const [formInstance] = useForm(form)

  useImperativeHandle(ref, () => formInstance)

  formInstance.setCallbacks({
    onFinish,
    onFinishFailed,
  })

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault()
    formInstance.submit()
  }

  return (
    <form onSubmit={submitHandler}>
      <FieldContext.Provider value={formInstance}>
        {children}
      </FieldContext.Provider>
    </form>
  )
}

// export default forwardRef(Form)
