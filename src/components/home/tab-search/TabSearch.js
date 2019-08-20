import React, { Component } from 'react';
import './TabSearch.scss';
import SearchBox from './searchbox/SearchBox';

class TabSearch extends Component {

    render() {
        return (
            <div className='tab-search b-img'>
                <div className='search-content'>
                    <div className='search-body'>
                        <SearchBox />
                    </div>
                </div>
            </div >
        );
    }
}

export default TabSearch;