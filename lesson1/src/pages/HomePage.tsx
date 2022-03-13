import { Component, Context } from "react";
import { ThemeContext } from "../Context";
import UserPage from "./UserPage";

export default class HomePage extends Component {
  static contextType?: Context<any> | undefined = ThemeContext;
  render() {
    console.log(this);

    const { themeColor } = this.context
    return (
      <>
        <div className={themeColor}>homepage</div>
        <UserPage></UserPage>
      </>
    )
  }
} 