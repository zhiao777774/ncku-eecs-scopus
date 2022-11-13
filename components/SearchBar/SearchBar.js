import {Component} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import styles from '@/styles/SearchBar.module.css';


export default class SearchBar extends Component {
    constructor(props) {
        super(props);

        this.state = {searchVal: ''};
        this._search = this._search.bind(this);
    }

    async _search(event) {
        event.preventDefault();

        const val = event.target.search.value.toLowerCase();
        if (!val) return;

        this.setState({
            searchVal: val
        });
    }

    render() {
        const {fixed = false} = this.props;
        return (
            <form style={{width: fixed ? '100%' : ''}}
                  className={styles['search-container']} onSubmit={this._search}>
                <input type='search' className={styles['search-bar']} required/>
                <FontAwesomeIcon icon={faSearch} size='sm' className={styles['search-btn']}/>
            </form>
        );
    }
}