import * as React from "react";
import "./CheckBox.scss";
export class CheckBox extends React.Component<
  {
    value?: any;
    name: string;
    disabled?: boolean;
    label?: string;
    placeholder?: string;
    onChange?: (name: string, value: boolean) => void;
  },
  any
> {
  id: any;
  constructor(props){
    super(props)
    this.id = Math.random();
  }

  private onChange(e) {
    const value = e.target.checked;

    if (this.props.onChange) {
      this.props.onChange(this.props.name, value);
    }
  }

  public render() {
    const classes = ["checkbox-element"];
    if (this.props.disabled) {
      classes.push("disabled-element");
    }
    const id = `checkbox_${this.id}`;
    return (
      <div className={classes.join(" ")}>
        <div className="md-checkbox">
          <input
            id={id}
            type="checkbox"
            disabled={this.props.disabled}
            checked={this.props.value !== undefined ? this.props.value : false}
            onChange={e => this.onChange(e)}
          />
          <label htmlFor={id}>{this.props.label}</label>
        </div>
      </div>
    );
  }
}
