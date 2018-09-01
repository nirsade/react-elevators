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
        currnetDestination: 0,
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
      elevaotrsAt: [0, 0, 0]
    };

    this.handleElevatorCall = this.handleElevatorCall.bind(this);
  }

  // find the elevator that will get the fastest to this floor
  findBestElevator(floor) {
    // array that hold the elevatorsId and time to get to floor
    let tempElevatorArray = [];

    for (let elv of this.elevatorsController) {
      // there is already a elevator on that floor NEED TO BE FIX
      // if (elv.currnetDestination === floor && elv.remainingTime <= 2) {
      //   let floors = this.state.floors;
      //   floors[this.props.numberOfFloors - floor].elevatorIsInFloor = true;
      //   this.setState({
      //     floors
      //   });
      //   console.log("call elevator when in floor");
      //   return -1;
      // }
      if (_.indexOf(this.state.elevaotrsAt, floor) !== -1) {
        console.log("the elevator is at", this.state.elevaotrsAt, floor);
        let floors = this.state.floors;
        floors[this.props.numberOfFloors - floor].elevatorIsInFloor = true;
        this.setState({
          floors
        });
        return -1;
      }

      // find elevator time to get to the new floor
      let remainingTime = elv.remainingTime - 2;
      let currentFloor = elv.currnetDestination;
      for (let command of elv.commands) {
        remainingTime += Math.abs(currentFloor - command.nextFloor) * 0.5 + 2;
        currentFloor = command.nextFloor;
      }
      // adding the new floor to the remainning time
      remainingTime += Math.abs(currentFloor - floor) * 0.5 + 2;
      tempElevatorArray.push({
        time: remainingTime,
        id: elv.id
      });
    }

    return _.minBy(tempElevatorArray, e => e.time);
  }

  // fire the elevator to the next floor
  fireElevator(id, floor) {
    let { elevators } = this.state;

    elevators[id].goTo = floor;
    this.elevatorsController[id].remainingTime =
      Math.abs(floor - this.elevatorsController[id].currnetDestination) * 0.5 +
      2;
    this.elevatorsController[id].currnetDestination = floor;
    this.elevatorsController[id].commands.shift();

    let elevaotrsAt = this.state.elevaotrsAt;
    elevaotrsAt[id] = floor;

    this.setState({
      elevators,
      elevaotrsAt
    });

  }

  // call after elevator reach its destination and ready for more commands
  handleElevatorFinished(id) {
    if (this.elevatorsController[id].commands.length) {
      this.fireElevator(id, this.elevatorsController[id].commands[0].nextFloor);
    } else {
      this.elevatorsController[id].remainingTime = 0;
      let elevaotrsAt = this.state.elevaotrsAt;
      elevaotrsAt[id] = this.elevatorsController[id].currnetDestination;
      this.setState({
        elevaotrsAt
      })
    }
  }

  // handle the elevator notification for reaching a floor
  handleReachFloor(id) {
    this.elevatorsController[id].remainingTime -= 0.5;
  }

  // call whenever someone is pushing the elevator button
  handleElevatorCall(floorNumber) {
    let { floors, elevaotrsAt } = this.state;

    // check wich elevator will get to the new floor first
    let bestElevator = this.findBestElevator(floorNumber);

    // in case there is already an elevator in the floor
    if (bestElevator === -1) {
      return;
    }
    elevaotrsAt[bestElevator.id] = floorNumber;
    // add the new times to the relevant elevator
    let elv = this.elevatorsController[bestElevator.id];
    elv.commands.push({ nextFloor: floorNumber });

    if (elv.remainingTime === 0) {
      this.fireElevator(bestElevator.id, floorNumber);
    }

    floors[this.props.numberOfFloors - floorNumber].counter = bestElevator.time;

    this.setState({
      floors,
      elevaotrsAt
    });
  }

  render() {

    let { elevators, floors } = this.state;

    console.log(floors)
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
