import React, { Component } from "react";
import "./App.css";
import Building from "./components/Building";

export default class App extends Component {
  
  constructor(props) {
    super(props);

    // Here you can set the number of building and elevator in each building
    this.buildings = [
      { floors: 20, elevators: 3 }
    ]
  }

  render() {
    return (
      <div className="main">
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
    );
  }
}
