import * as React from "react";
import elv from "./../images/elv.png";

export default class Elevator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nextStops: [],
      location: 0,
      elevatorStyle: {
        marginBottom: "0px"
      }
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // canculating the Ui transition
    let elevatorStyle = {
      transform: "translateY(" + 440 + "px)",
      transition: "transform " + 2 + "s"
    };

    this.setState({
      elevatorStyle
    });
  }

  componentWillReceiveProps(newProps) {
    if (this.props.goTo !== newProps.goTo) {
      this.distance = Math.abs(this.state.location - newProps.goTo);

      let elevatorStyle = {
        transform: "translateY(" + newProps.goTo * 110 * -1 + "px)",
        transition: "transform " + this.distance * 0.5 + "s"
      };

      this.setState({
        elevatorStyle,
        location: newProps.goTo
      });

      this.interval = setInterval(() => {
        if (this.distance > 0) {
          this.props.onReachFloor();
        } else {
          clearInterval(this.interval);
          setTimeout(() => this.props.onFinished(), 2000);
        }
        this.distance--;
      }, 500);
    }
  }

  render() {
    let { elevatorStyle } = this.state;

    return (
      <div style={elevatorStyle}>
        <img className="elevator" alt="Elevator" src={elv} />
      </div>
    );
  }
}
