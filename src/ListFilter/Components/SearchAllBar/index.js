import React, { Component } from 'react';
import { Input } from 'antd';

const Search = Input.Search;

class SearchAllBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    innerOnSearch = (event) => {
        console.log("InneronSearch!!", event);

        this.props.onSearch(event);
    }

    render() {
        return (
            <Search
                onSearch={this.innerOnSearch}
                placeholder="Search..." />
        )
    }
}

export default SearchAllBar;