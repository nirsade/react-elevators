import React, { Component } from "react";
import "./App.css";
import Building from './components/Building'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buildings: [
        { floors: 20, elevators: 3 }
      ]
    };
  }

  render() {
    return (
      <div className="main">
        <div className="buildingsContainer">
          {this.state.buildings.map((building, index) => {
            return (
              <Building numberOfElevators={building.elevators} numberOfFloors={building.floors} key={index}/>
            );
          })}
        </div>
      </div>
    );
  }
}

export default App;
