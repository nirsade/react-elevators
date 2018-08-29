import * as React from 'react';
import elv from './../images/elv.png'

export default class Elevator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nextStops: [],
            location: 0,
            elevatorStyle: {
                'marginBottom': '0px'
            }
        }
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        let elevatorStyle = {
            'transform': 'translateY(' + 440 + 'px)',
            'transition': 'transform ' + 2 + 's'
        }
     
        this.setState({
            elevatorStyle
        })
    }

    componentWillReceiveProps(newProps) {        
        if(this.props.goTo != newProps.goTo) {
            let distance = Math.abs(this.state.location - newProps.goTo)
            let elevatorStyle = {
                'transform': 'translateY(' + (newProps.goTo * 110 * -1) + 'px)',
                'transition': 'transform ' + (distance * 0.5) + 's'
            }
         
            this.setState({
                elevatorStyle,
                location: newProps.goTo
            })

            setTimeout(() => console.log('gege'), distance * 0.5 * 1000 + 2000)
        }
    }

    render () {

        const buttonClassName = this.state.goingUp ? 'elevator elevatorUp' : 'elevator'
        const elevatorStyle = this.state.elevatorStyle
        // console.log(this.state)
        return (
            <div style={elevatorStyle}>
                <img className='elevator' alt='Elevator' src={elv}/>
            </div>
        )
    }
}