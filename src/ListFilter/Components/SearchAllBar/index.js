import React, { Component } from 'react';
import { Input } from 'antd';

const Search = Input.Search;

class SearchAllBar extends Component {
    constructor(props) {
        super(props);

        this.inputRef = React.createRef();
    }

    innerOnSearch = (event) => {
        console.log("InneronSearch!!", this.inputRef.current);

        this.props.onSearch(event);
    }

    render() {
        return (
            <Search
                ref={this.inputRef}
                onSearch={this.innerOnSearch}
                placeholder="Search..." />
        )
    }
}

export default SearchAllBar;