import React from 'react';
import { PieChart, HeadingText, NrqlQuery } from 'nr1';

const ACCOUNT_ID = 2132798

export default class TotalSubscriptions extends React.Component {
    render() {
        return <div>
        <HeadingText className="chartHeader">
            Total subscriptions per version
        </HeadingText>
        <NrqlQuery
                accountIds={[ACCOUNT_ID]}
                query="SELECT count(*) FROM subscription FACET page_version"
                pollInterval={60000}
            >
                {
                    ({ data }) => {
                        return <PieChart data={data} fullWidth />
                    }
                }
        </NrqlQuery>
    </div>
    }
}