import React from "react";
import ding from './../mp3/ding.mp3'

export default class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timer: null,
      counter: props.counter
    };

    this.dingSound = new Audio(ding);
    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    let timer = setInterval(this.tick, 1000);
    this.setState({
      timer,
      counter: Math.floor(this.props.counter)
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  // componentWillReceiveProps(newProps) {
  //   if(this.state.counter <= 0) {
  //     let timer = setInterval(this.tick, 1000);
  //     this.setState({
  //       timer,
  //       counter: newProps.counter
  //     });
  //   }
  // }

  tick() {
    // console.log('tich', this.state.counter)
    if (this.state.counter <= 1) {
      clearInterval(this.state.timer);
      this.dingSound.play();
      this.props.timerEnd();
    }
    this.setState({
      counter: this.state.counter - 1
    });
  }

  render() {
    let counter = this.state.counter;
    return (
        counter > 0 ? <p className='timerText'>{counter}</p> : null
    );
  }
}

