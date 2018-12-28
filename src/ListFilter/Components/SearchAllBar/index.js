import React, { Component } from 'react';
import { Input } from 'antd';

const Search = Input.Search;

class SearchAllBar extends Component {
    constructor(props) {
        super(props);

        this.inputRef = React.createRef();
    }

    innerOnSearch = (event) => {
        this.props.onSearch(event);
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {

        if(this.props.clearText && !prevProps.clearText)
            this.inputRef.current.input.input.value = null
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