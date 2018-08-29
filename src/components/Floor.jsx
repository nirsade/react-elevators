import * as React from "react";
import Timer from "./Timer";

export default class Floor extends React.Component {
  constructor(props) {
    super(props);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.state = {
      floorIsActive: false,
      counter: 0
    };
  }

  handleButtonClick(floorNum) {
    this.setState({
      floorIsActive: true,
      counter: floorNum
    });
    this.props.elevatorCall(floorNum);
  }

  handleTimerEnd() {
    this.setState({
      floorIsActive: false
    })
  }

  render() {
    const { floorNumber } = this.props;
    let { floorIsActive, counter } = this.state;
    let buttonClass = floorIsActive
      ? "metal linear activeFloorText"
      : "metal linear";

    return (
      <div className="floor">
        <div>
          {this.props.counter !== 0 ? (
            <Timer 
              counter={this.props.counter} 
              timerEnd={()=>this.handleTimerEnd()}
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
