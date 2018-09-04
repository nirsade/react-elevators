import * as React from "react";
import Floor from "./Floor";
import Elevator from "./Elevator";
import * as _ from "lodash";

export default class Building extends React.Component {
  constructor(props) {
    super(props);
    let elevators = [];
    let floors = [];
    this.elevatorsController = [];

    // set the building elevators
    for (let i = 0; i < props.numberOfElevators; i++) {
      // set new elevator for the UI components
      elevators.push({
        id: i,
        goTo: 0
      });

      // set new elevator for the calculations
      this.elevatorsController.push({
        id: i,
        remainingTime: 0,
        currentDestination: 0,
        commands: []
      });
    }

    // set the building floors
    for (let i = 0; i < props.numberOfFloors + 1; i++) {
      floors.push({
        id: props.numberOfFloors - i,
        counter: 0,
        elevatorIsInFloor: props.numberOfFloors - i === 0
      });
    }

    this.state = {
      floors,
      elevators,
      elevatorsAt: [0, 0, 0]
    };

    this.handleElevatorCall = this.handleElevatorCall.bind(this);
    this.findBestElevator = this.findBestElevator.bind(this);
    this.sendElevator = this.sendElevator.bind(this);
    this.handleElevatorFinished = this.handleElevatorFinished.bind(this);
    this.handleReachFloor = this.handleReachFloor.bind(this);
  }

  // call when someone is pushing the elevator button
  handleElevatorCall(floorNumber) {
    let { floors, elevatorsAt } = this.state;

    // in case there is already elevator in this floor
    if (_.indexOf(elevatorsAt, floorNumber) !== -1) {
      return;
    }

    // check which elevator will get first to the new floor
    let bestElevator = this.findBestElevator(floorNumber);

    elevatorsAt[bestElevator.id] = floorNumber;
    let elv = this.elevatorsController[bestElevator.id];
    elv.commands.push({ nextFloor: floorNumber });

    if (elv.remainingTime === 0) {
      this.sendElevator(bestElevator.id, floorNumber);
    }

    // set the counter for the timer in the floor
    floors[this.props.numberOfFloors - floorNumber].counter = bestElevator.time;

    this.setState({
      floors,
      elevatorsAt
    });
  }

  // find the elevator that will get the fastest to this floor
  findBestElevator(floor) {
    let tempElevatorArray = [];
    for (let elv of this.elevatorsController) {
      // calculate time for elevator to  reach the new floor
      let remainingTime = elv.remainingTime - 2;
      let currentFloor = elv.currentDestination;
      for (let command of elv.commands) {
        remainingTime += Math.abs(currentFloor - command.nextFloor) * 0.5 + 2;
        currentFloor = command.nextFloor;
      }
      remainingTime += Math.abs(currentFloor - floor) * 0.5 + 2;
      tempElevatorArray.push({
        time: remainingTime,
        id: elv.id
      });
    }

    return _.minBy(tempElevatorArray, e => e.time);
  }

  // send the elevator to the next floor
  sendElevator(id, floor) {
    let { elevators, floors, elevatorsAt } = this.state;
    let { numberOfFloors } = this.props;
    let currentDestination = this.elevatorsController[id].currentDestination;

    elevators[id].goTo = floor;
    this.elevatorsController[id].remainingTime =
      Math.abs(floor - this.elevatorsController[id].currentDestination) * 0.5 +
      2;
    this.elevatorsController[id].currentDestination = floor;
    this.elevatorsController[id].commands.shift();

    // update the new position of this elevator
    elevatorsAt[id] = floor;
    floors[numberOfFloors - currentDestination].elevatorIsInFloor = false;

    this.setState({
      elevators,
      elevatorsAt,
      floors
    });
  }

  // call after elevator reach its destination and ready for more commands
  handleElevatorFinished(id) {
    let { elevatorsAt, floors } = this.state;
    let floorNumber = this.elevatorsController[id].currentDestination;
    floors[this.props.numberOfFloors - floorNumber].elevatorIsInFloor = true;
    this.setState({
      floors
    });

    // in case ther are more commands to this elevator
    if (this.elevatorsController[id].commands.length) {
      this.sendElevator(id, this.elevatorsController[id].commands[0].nextFloor);
    } else {
      this.elevatorsController[id].remainingTime = 0;
      elevatorsAt[id] = this.elevatorsController[id].currentDestination;
      this.setState({
        elevatorsAt
      });
    }
  }

  // handle the elevator notification for reaching a floor
  handleReachFloor(id) {
    this.elevatorsController[id].remainingTime -= 0.5;
  }

  render() {
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
                elevatorIsInFloor={floor.elevatorIsInFloor}
                key={floor.id}
              />
            );
          })}
        </div>
        <div className="elevators">
          {elevators.map(elevator => {
            return (
              <Elevator
                key={elevator.id}
                goTo={elevator.goTo}
                onFinished={() => this.handleElevatorFinished(elevator.id)}
                onReachFloor={() => this.handleReachFloor(elevator.id)}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
