import * as React from "react";
import Timer from "./Timer";

export default class Floor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      buttonPushed: false,
      stateCounter: 0
    };

    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleTimerEnd = this.handleTimerEnd.bind(this);

  }

  handleButtonClick() {

    if (this.props.floorNumber == 0) {
      console.log('call floor number one')
    }

    if (!this.state.buttonPushed) {

      this.props.elevatorCall(this.props.floorNumber);

      this.setState({
        buttonPushed: true
      });
  
    }
  }

  handleTimerEnd() {
    this.setState({
      buttonPushed: false,
      stateCounter: 0
    })
  }

  render() {
    const { floorNumber, counter, elevatorIsInFloor } = this.props;
    let { buttonPushed } = this.state;

    // if (counter == 0) {
    //   buttonPushed = false;
    // }
    let isFloorShouldBeActive = buttonPushed && !elevatorIsInFloor
    let buttonClass = isFloorShouldBeActive
      ? "metal linear activeFloorText"
      : "metal linear";
    // if (counter == 0) {
    //   buttonPushed = false;
    // }
    return (
      <div className="floor">
        <div>
          {isFloorShouldBeActive ? (
            <Timer 
              counter={counter} 
              timerEnd={this.handleTimerEnd}
            />
          ) : null}
        </div>
        <div>
          <button
            className={buttonClass}
            onClick={() => this.handleButtonClick(floorNumber)}
          >
            {floorNumber}
          </button>
        </div>
      </div>
    );
  }
}
