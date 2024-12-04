import React from 'react';
import { HeadingText, NrqlQuery, TableChart } from 'nr1';

export default class VersionTotals extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: {
                metadata: {
                    id: `totals-${this.props.version}`,
                    name: `Version ${this.props.version}`,
                    columns: ['name', 'count'],
                },
                data: [
                    { name: 'Subscriptions', count: 0 },
                    { name: 'Page views', count: 0 },
                ],
            },
            dataLoaded: false, // Bandera de control
        };
    }

    componentDidMount() {
        Promise.all([
            NrqlQuery.query({
                accountId: this.props.accountIds,
                query: `SELECT count(*) FROM subscription WHERE page_version = '${this.props.version}' SINCE 7 DAYS AGO`,
                formatType: NrqlQuery.FORMAT_TYPE.RAW,
            }),
            NrqlQuery.query({
                accountId: this.props.accountIds,
                query: `SELECT count(*) FROM pageView WHERE page_version = '${this.props.version}' SINCE 7 DAYS AGO`,
                formatType: NrqlQuery.FORMAT_TYPE.RAW,
            }),
        ]).then(([subscriptionData, pageViewData]) => {
            const tableData = { ...this.state.tableData };
            tableData.data[0].count = subscriptionData.data.results[0].count;
            tableData.data[1].count = pageViewData.data.results[0].count;

            this.setState({ tableData, dataLoaded: true });
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.tableData !== this.state.tableData || nextState.dataLoaded !== this.state.dataLoaded;
    }

    render() {
        //console.log("Datos enviados a TableChart:", this.state.tableData);

        if (!this.state.dataLoaded) {
            return <div>Cargando datos...</div>;
        }

        return (
            <div>
                <HeadingText className="chartHeader">
                    Version {this.props.version.toUpperCase()} - Page views vs. subscriptions
                </HeadingText>
                <TableChart data={[this.state.tableData]} fullWidth />
            </div>
        );
    }
}
