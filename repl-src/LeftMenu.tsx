import * as React from 'react';
import { CheckBox } from './ui/CheckBox/CheckBox';
import { __values } from 'tslib';
import './styles/LeftMenu.scss';
import { LEFT_MENU_CONFIG } from './config';
export interface ILeftMenuInterface {
  onSettingsChange?: (values) => void;
}

export class LeftMenu extends React.Component<ILeftMenuInterface, any> {
  constructor(props) {
    super(props);

    const defaultValues = {};

    LEFT_MENU_CONFIG.map(cat => {
      cat.items.map(item => {
        defaultValues[item.value] = item.selected;
      });
    });
    this.state = {
      values: defaultValues
    };
  }

  componentDidMount() {
    this.props.onSettingsChange &&
      this.props.onSettingsChange(this.state.values);
  }
  private onChange = (name, value) => {
    const values = { ...this.state.values, [name]: value };
    this.setState({ values });
    this.props.onSettingsChange && this.props.onSettingsChange(values);
  };

  render() {
    return (
      <div className="left-menu">
        <div className="logo" />
        <div className="section">
          {LEFT_MENU_CONFIG.map(cat => {
            return (
              <div key={cat.category} className="block">
                <div className="title">{cat.category}</div>
                <div className="items">
                  {cat.items.map((item, i) => (
                    <CheckBox
                      key={i}
                      name={item.value}
                      label={item.title}
                      disabled={item.disabled}
                      onChange={this.onChange}
                      value={this.state.values[item.value]}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
