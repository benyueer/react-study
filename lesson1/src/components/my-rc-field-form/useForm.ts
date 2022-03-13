import { useRef } from "react"

interface IFormStore {
  store: Object
  callBacks: any
  fieldEnetities: any[]
  submit: Function
  setCallbacks: Function
}

class FormStore implements IFormStore {
  store
  fieldEnetities: any[]
  callBacks: any;

  constructor() {
    this.store = {}
    this.fieldEnetities = []
    this.callBacks = {}
  }

  setCallbacks = (callBacks: any) => {
    this.callBacks = {
      ...this.callBacks,
      ...callBacks
    }
  }

  registerEntity = (entity: any) => {
    this.fieldEnetities.push(entity)
    return () => {
      this.fieldEnetities = this.fieldEnetities.filter((item: any) => item !== entity)
      // @ts-ignore
      delete this.store[entity.props.name]
    }
  }

  setFieldsValue = (newStore: any) => {
    this.store = {
      ...this.store,
      ...newStore
    }

    this.fieldEnetities.forEach((entity: any) => {
      if (entity.props.name in newStore) {
        entity.onStoreChange()
      }
    })
  }

  getFieldValue = (name: string) => {
    // @ts-ignore
    return this.store[name]
  }

  validate = () => {
    let err: any[] = []

    this.fieldEnetities.forEach((entity: any) => {
      const {name, rules} = entity.props
      const value = this.getFieldValue(name)
      let rule = rules && rules[0]
      if (rule && rule.required && (value === undefined || value === '')) {
        err.push({
          name,
          message: rule.message,
          value
        })
        entity.setValid({
          valid: false,
          message: rule.message,
          value
        })
      } else {
        entity.setValid({
          valid: true,
          message: '',
          value
        })
      }
    })

    return err
  }

  submit = () => {
    console.log(this.store)
    const {onFinish, onFinishFailed} = this.callBacks

    let err = this.validate()
    if (err.length > 0) {
      onFinishFailed(err)
    } else {
      onFinish(this.store)
    }
  }

  getForm() {
    return {
      setFieldsValue: this.setFieldsValue,
      getFieldValue: this.getFieldValue,
      submit: this.submit,
      setCallbacks: this.setCallbacks
    }
  }
}

export default function useForm(form: IFormStore) {
  const formRef = useRef<IFormStore>()

  if (!formRef.current) {
    if (form) {
      formRef.current = form
    } else {
      const formStore = new FormStore()
      formRef.current = formStore
    }
  }
  return [formRef.current]
}