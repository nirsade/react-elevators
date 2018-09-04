import * as React from "react";
import Timer from "./Timer";

export default class Floor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      buttonPushed: false,
      buttonDisabled: false,
      stateCounter: 0
    };

    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleTimerEnd = this.handleTimerEnd.bind(this);
  }

  handleButtonClick() {
    if (!this.state.buttonPushed && !this.props.elevatorIsInFloor) {
      this.props.elevatorCall(this.props.floorNumber);
      this.setState({
        buttonPushed: true
      });
    }
  }

  handleTimerEnd() {
    this.setState({
      buttonPushed: false,
      buttonDisabled: true,
      stateCounter: 0
    });
    setTimeout(() => {
      this.setState({
        buttonDisabled: false
      });
    }, 2000);
  }

  render() {
    const { floorNumber, counter } = this.props;
    let { buttonPushed, buttonDisabled } = this.state;

    let buttonClass = buttonPushed
      ? "metal linear activeFloorText"
      : "metal linear";

    return (
      <div className="floor">
        <div>
          {buttonPushed ? (
            <Timer counter={counter} timerEnd={this.handleTimerEnd} />
          ) : null}
        </div>
        <div>
          <button
            disabled={buttonDisabled}
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
