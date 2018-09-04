import React, { Component } from "react";
import "./App.css";
import Building from "./components/Building";
import config from './config'

export default class App extends Component {
  constructor(props) {
    super(props);

    this.buildings = config.buildings;
  }

  componentDidMount() {
    document.body.scrollTop = this.el.scrollHeight;
    this.el.scrollTop = this.el.scrollHeight;
  }


  render() {
    return (
      <div className="main" ref={el => { this.el = el }}>
        <div className="inner">
          <div className="buildingsContainer">
            {this.buildings.map((building, index) => {
              return (
                <Building
                  numberOfElevators={building.elevators}
                  numberOfFloors={building.floors}
                  key={index}
                />
              );
            })}
          </div>
        </div>
        <div className="full-height"/>
      </div>
    );
  }
}
