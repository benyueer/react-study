import React, { cloneElement } from 'react'
import FieldContect from './FieldContext'

interface FieldProps {
  children: React.ReactElement,
  name: string,
  rules?: any[],
}

interface FieldState {
  value: string
  valid: boolean | null
  message: string
}

export default class Field extends React.Component<FieldProps, FieldState> {

  static contextType?: React.Context<any> | undefined = FieldContect
  cancelRegister!: Function

  constructor(props: any) {
    super(props)
    this.state = {
      value: '',
      valid: null,
      message: ''
    }
  }

  componentDidMount() {
    const { registerEntity } = this.context
    this.cancelRegister = registerEntity(this)
  }

  componentWillUnmount() {
    this.cancelRegister()
  }

  onStoreChange = () => {
    this.forceUpdate()
  }

  setValid = (valid: any) => {
    this.setState({
      ...valid
    })
  }

  getControlled() {
    const { name } = this.props
    const { getFieldValue, setFieldsValue } = this.context
    return {
      value: getFieldValue(name),
      onChange: (event: React.ChangeEvent) => {
        // @ts-ignore
        const newValue = event.target.value
        setFieldsValue({
          [name]: newValue
        })
      },
    }
  }
  render() {
    const { children } = this.props
    const returnChildNode = cloneElement(children, this.getControlled())
    return (
      <div>
        {returnChildNode}
        {this.state.valid === false && <div>{this.state.message}</div>}
      </div>
    )
  }
}
