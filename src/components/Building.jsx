import * as React from "react";
import Floor from "./Floor";
import Elevator from "./Elevator";
import * as _ from "lodash";

export default class Building extends React.Component {
  constructor(props) {
    super(props);
    let elevators = [];
    let floors = [];
    let elevatorsController = [];

    for (let i = 0; i < props.numberOfElevators; i++) {
      elevators.push({
        id: i,
        goTo: 0
      });
    }
    for (let i = 0; i < props.numberOfFloors + 1; i++) {
      floors.push({
        id: props.numberOfFloors - i,
        counter: 0
      });
    }
    for (let i = 0; i < props.numberOfElevators; i++) {
      elevatorsController.push({
        id: i,
        remainingTime: 0,
        currnetDestination: 0,
        commands: []
      });
    }
    this.state = {
      floors,
      elevators,
      elevatorsController
    };

    this.handleElevatorCall = this.handleElevatorCall.bind(this);
  }

  findBestElevator(floor) {
    let tempElevatorArray = []

    // fix this hack !

    for(let elv of this.state.elevatorsController) {
      elv.commands.push({nextFloor: floor});
      tempElevatorArray.push({time: this.getElevatorTimeToFloor(elv), id: elv.id});
      elv.commands.pop();
    }
    let bestElevator = _.minBy(tempElevatorArray, (e)=>e.time);
    
    return bestElevator.id;
  }

  callElevator(id, floor) {
    let { elevators, elevatorsController } = this.state;
    
    elevators[id].goTo = floor;
    elevatorsController[id].remainingTime = Math.abs(floor - elevatorsController[id].currnetDestination) * 0.5 + 2;
    elevatorsController[id].currnetDestination = floor;
    elevatorsController[id].commands.shift();

    this.setState({
      elevators,
      elevatorsController
    });
  }

  getElevatorTimeToFloor(elv) {
    let remainingTime = elv.remainingTime - 2;
    let currentFloor = elv.currnetDestination

    for(let command of elv.commands) {
      remainingTime += Math.abs(currentFloor - command.nextFloor) * 0.5 + 2;
      currentFloor = command.nextFloor;
    }
    console.log(remainingTime)

    return remainingTime;
  }

  handleElevatorFinished(id) {
    let {elevatorsController} = this.state;
    if(elevatorsController[id].commands.length) {
      this.callElevator(id, elevatorsController[id].commands[0].nextFloor);
    } else {
      elevatorsController[id].remainingTime = 0
    }
    this.setState({
      elevatorsController
    })
  }

  handleReachFloor(id) {
    let {elevatorsController} = this.state;
    elevatorsController[id].remainingTime -= 0.5;
    this.setState({
      elevatorsController
    })
  }

  handleElevatorCall(floorNumber) {
    let { elevators, floors, elevatorsController } = this.state;
    // check wich elevator will get there first
    let id = this.findBestElevator(floorNumber);

    // add the new times to the relevant elevator
    let elv = elevatorsController[id];
    elv.commands.push({ nextFloor: floorNumber });

    if (elv.remainingTime == 0) {
      this.callElevator(id, floorNumber);
    }

    floors[
      this.props.numberOfFloors - floorNumber
    ].counter = this.getElevatorTimeToFloor(elv);

    this.setState({
      floors,
      elevatorsController
    });
  }

  render() {
    const { numberOfFloors, numberOfElevators } = this.props;
    let { elevators, floors } = this.state;
    console.log(this.state.elevatorsController)
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
            return (
              <Elevator
                key={elevator.id}
                goTo={elevator.goTo}
                onFinished={() => this.handleElevatorFinished(elevator.id)}
                onReachFloor={()=>this.handleReachFloor(elevator.id)}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
