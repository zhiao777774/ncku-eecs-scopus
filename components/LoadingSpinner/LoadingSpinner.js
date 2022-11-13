import {Component} from 'react';
import styles from '@/styles/LoadingSpinner.module.css';


export default class LoadingSpinner extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div className={styles.loader}></div>);
    }
}