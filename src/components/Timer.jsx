import React from "react";
import ding from "./../mp3/ding.mp3";

export default class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      counter: props.counter
    };

    this.timer = null;
    this.dingSound = new Audio(ding);

    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(this.tick, 1000);
    this.setState({
      counter: Math.floor(this.props.counter)
    });
  }

  tick() {
    if (this.state.counter <= 1) {
      clearInterval(this.timer);
      this.dingSound.play();
      this.props.timerEnd();
    } else {
      this.setState({
        counter: this.state.counter - 1
      });
    }
  }

  render() {
    let { counter } = this.state;

    return counter > 0 ? <p className="timerText">{counter}</p> : null;
  }
}
