import React from 'react';
import { BillboardChart, ChartGroup, Grid, GridItem } from 'nr1';
import EndTestSection from '../persist-selected/end-test';
//import EndTestSection from '../test-section/end-test';
import NewsletterSignups from '../line-chart/newsletter-signups';
import TotalSubscriptions from '../pies-chart/total-subscriptions';
import TotalCancellations from '../pies-chart/total-cancellations';
import VersionTotals from '../tables/totals';
import VersionDescription from '../descriptions/description';
import PastTests from '../tables/past-test';
import VersionPageViews from '../chart-group/page-views';

// https://docs.newrelic.com/docs/new-relic-programmable-platform-introduction

const ACCOUNT_ID = 2132798
const VERSION_A_DESCRIPTION = 'The newsletter signup message says, "Sign up for our newsletter"'
const VERSION_B_DESCRIPTION = 'The newsletter signup message says, "Sign up for our newsletter and get a free shirt!"'

export default class HomeNerdlet extends React.Component {
  render() {
    return <div>
      <Grid className="wrapper">
        <GridItem columnSpan={6}>
          <VersionDescription
            description={VERSION_A_DESCRIPTION}
            version="A"
          />
        </GridItem>
        <GridItem columnSpan={6}>
          <VersionDescription
            description={VERSION_B_DESCRIPTION}
            version="B"
          />
        </GridItem>
        <GridItem columnSpan={12}><NewsletterSignups /></GridItem>
        <GridItem columnSpan={6}><TotalSubscriptions /></GridItem>
        <GridItem columnSpan={6}><TotalCancellations /></GridItem>
        <GridItem columnSpan={6}><VersionTotals version='a' accountIds={ACCOUNT_ID} /></GridItem>
        <GridItem columnSpan={6}><VersionTotals version='b' accountIds={ACCOUNT_ID} /></GridItem>
        <ChartGroup>
          <GridItem columnSpan={6}>
            <VersionPageViews version='a' />
          </GridItem>
          <GridItem columnSpan={6}>
            <VersionPageViews version='b' />
          </GridItem>
        </ChartGroup>
        <GridItem columnSpan={12}><EndTestSection /></GridItem>
        <GridItem columnSpan={12}><PastTests /></GridItem>
      </Grid>
    </div>
      ;
  }
}
