import {Component} from 'react';
import styles from '@/styles/blocker.module.css';


export default class Blocker extends Component {
    static defaultProps = {
        display: false,
        clickable: true,
        style: {}
    };

    constructor(props) {
        super(props);

        this.state = {display: this.props.display};
    }

    _disabled = (event) => {
        this.setState({display: false});
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.display !== this.props.display) {
            this.setState({display: this.props.display});
        }
    }

    render() {
        const {display} = this.state;

        return (
            <div className={styles.blocker}
                 style={{...this.props.style, ...{display: (display ? '  block' : ' hidden')}}}
                 onClick={this.props.clickable ? this._disabled : null}>
                {this.props.children}
            </div>
        );
    }
}