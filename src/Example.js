import React, { Component } from 'react';
import {ClientFilter} from './ListFilter';
import { List, Avatar } from 'antd';
import './example.css';

const dataFields = {
    cardNumber: {
        type: "autocomplete",
        uiName: "Card Number", 
        dataSource:["5436 7865 7873", "8712 6789 0912"]
    },
    cardType: {
        type: "multiselect",
        uiName: "Card Type",
        dataSource: ["ELECTRON", "VISA CREDIT", "MASTERCARD DEBIT", "COSMOTE CREDIT", "ATTICA CREDIT"]
    },
    publishDate: {
        type: "date",
        uiName: "Publish Date",
        format: "YYYY-MM-DD"
    },
    cancelDate: {
        type: "date",
        uiName: "Cancel Date",
        format: "YYYY-MM-DD"
    },
    isActive: {
        type: "bool",
        uiName: "Active"
    },
    daysActive: {
        type: "number",
        uiName: "Days Active"
    }
}

const data = [
    {
        cardNumber: '5436 7865 7873',
        publishDate: '2014-08-23',
        isActive: true,
        daysActive: 1892,
        cardType: "MASTERCARD DEBIT"
    },
    {
        cardNumber: '0023 1245 9801',
        publishDate: '2016-02-01',
        isActive: false,
        daysActive: 722,
        cardType: "VISA CREDIT"
    },
    {
        cardNumber: '8712 6789 0912',
        publishDate: '2012-11-12',
        isActive: false,
        daysActive: 987,
        cardType: "VISA CREDIT"
    },
    {
        cardNumber: '3345 7865 0981',
        publishDate: '2017-01-21',
        isActive: true,
        daysActive: 600,
        cardType: "ELECTRON"
    }
]

class App extends Component {
    render() {
        return (
            <div className="App">

                <ClientFilter
                    dataSource={data}
                    dataFields={dataFields}
                    onPostFilters={filters => {
                        console.log("SERVERFILTER!!", filters);

                        const prom = new Promise((resolve, reject) => {
                            setTimeout(() => resolve([
                                {
                                    cardNumber: '8712 6789 0912',
                                    publishDate: '2012-11-12',
                                    isActive: false,
                                    daysActive: 987,
                                    cardType: "VISA CREDIT"
                                }
                            ]), 2000)
                        });
                        return prom;
                    }}
                    renderList={(dataSource, loading) => (
                        <List
                            loading={loading}
                            itemLayout="horizontal"
                            dataSource={dataSource}
                            renderItem={item => (
                                <List.Item key={`${item.publishDate}//${item.cardNumber}`}>
                                    <List.Item.Meta
                                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                        title={<span>{item.cardNumber} , {item.cardType}</span>}
                                        description={<span>{item.publishDate}|| Active:{item.isActive.toString()} || Active Days: {item.daysActive}</span>}
                                    />
                                </List.Item>
                            )}
                        />
                    )} />
            </div>
        );
    }
}

export default App;
