import * as React from "react";
import Floor from "./Floor";
import Elevator from "./Elevator";
import * as _ from 'lodash'

export default class Building extends React.Component {
  constructor(props) {
    super(props);
    let elevators = [];
    for (let i = 0; i < props.numberOfElevators; i++) {
      elevators.push({
        id: i,
        lastLocation: 0,
        stops: [],
        remainingTime: 0
      });
    }
    const floors = [];
    for (let i = 0; i < props.numberOfFloors + 1; i++) {
      floors.push({
        id: props.numberOfFloors - i,
        counter: 0
      });
    }
    this.state = {
      elevators,
      floors
    };
    this.handleElevatorCall = this.handleElevatorCall.bind(this);
  }

  handleElevatorCall(floorNumber) {
    let { elevators, floors } = this.state;
    // check wich elevator will get there first
    let id = _.minBy(elevators, (elv)=>elv.remainingTime).id;

    // add the new times to the relevant elevator
    let elv = elevators[id];
    let currentLocation = elv.location;
    let timeToAdd = Math.abs(currentLocation - floorNumber) / 2;
    elv.lastLocation = floorNumber;
    elv.stops.push(floorNumber);

    elevators[id] = {
      id,
      location: floorNumber,
      lastLocation: 0,
      stops: [],
      remainingTime: 0
    };
    console.log(currentLocation);
    floors[this.props.numberOfFloors - floorNumber].counter =
      Math.abs(currentLocation - floorNumber) / 2;
    // console.log(floors)
    this.setState({
      elevators,
      floors
    });
  }

  render() {
    const { numberOfFloors, numberOfElevators } = this.props;
    let { elevators, floors } = this.state;

    return (
      <div className="buliding">
        <div className="floors">
          {floors.map(floor => {
            return (
              <Floor
                elevatorCall={f => this.handleElevatorCall(f)}
                floorNumber={floor.id}
                counter={floor.counter}
                key={floor.id}
              />
            );
          })}
        </div>
        <div className="elevators">
          {elevators.map(elevator => {
            return <Elevator key={elevator.id} goTo={elevator.location} />;
          })}
        </div>
      </div>
    );
  }
}
