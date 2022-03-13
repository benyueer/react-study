import React from 'react'

interface InputProps {
  value?: string,
  placeholder: string,
  [_: string]: any
}

function Input(props: InputProps) {
  return (
    <input {...props}></input>
  )
}

class CustomizeInput extends React.Component<InputProps> {
  constructor(props: InputProps) {
    super(props);
    this.state = {};
  }
  render() {
    const {value = "", ...otherProps} = this.props;
    return (
      <div style={{padding: 10}}>
        <Input style={{outline: "none"}} value={value} {...otherProps} />
      </div>
    );
  }
}

export default CustomizeInput;