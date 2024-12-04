import React from 'react';
import { BillboardChart, ChartGroup, Grid, GridItem, NerdGraphMutation, NerdGraphQuery } from 'nr1';
import EndTestSection from '../persist-selected/end-test';
//import EndTestSection from '../test-section/end-test';
import NewsletterSignups from '../line-chart/newsletter-signups';
import TotalSubscriptions from '../pies-chart/total-subscriptions';
import TotalCancellations from '../pies-chart/total-cancellations';
import VersionTotals from '../tables/totals';
import VersionDescription from '../descriptions/description';
import PastTests from '../tables/past-test';
import VersionPageViews from '../chart-group/page-views';
import { ApiTokenButton, ApiTokenPrompt } from '../token/token-prompt'

// https://docs.newrelic.com/docs/new-relic-programmable-platform-introduction

const ACCOUNT_ID = 2132798
const VERSION_A_DESCRIPTION = 'The newsletter signup message says, "Sign up for our newsletter"'
const VERSION_B_DESCRIPTION = 'The newsletter signup message says, "Sign up for our newsletter and get a free shirt!"'

export default class AbTestNerdletNerdlet extends React.Component {
    constructor() {
        super(...arguments);

        this.state = {
            hideTokenPrompt: true,
            token: null,
        }

        this.storeToken = this.storeToken.bind(this);
        this.showPrompt = this.showPrompt.bind(this);
        this.hidePrompt = this.hidePrompt.bind(this);
    }

    storeToken(newToken) {
        if (newToken != this.state.token) {
            const mutation = `
                mutation($key: String!, $token: SecureValue!) {
                    nerdStorageVaultWriteSecret(
                        scope: { actor: CURRENT_USER }
                        secret: { key: $key, value: $token }
                    ) {
                        status
                        errors {
                            message
                            type
                        }
                    }
                }
            `;
            const variables = {
                key: "api_token",
                token: newToken,
            };
            NerdGraphMutation.mutate({ mutation: mutation, variables: variables }).then(
                (data) => {
                    if (data.data.nerdStorageVaultWriteSecret.status === "SUCCESS") {
                        this.setState({token: newToken})
                    }
                }
            );
        }
    }

    showPrompt() {
        this.setState({ hideTokenPrompt: false });
    }

    hidePrompt() {
        this.setState({ hideTokenPrompt: true });
    }

    componentDidMount() {
        const query = `
            query($key: String!) {
                actor {
                    nerdStorageVault {
                        secret(key: $key) {
                            value
                        }
                    }
                }
            }
        `;
        const variables = {
            key: "api_token",
        };

        NerdGraphQuery.query(
            {
                query: query,
                variables: variables,
            }
        ).then(
            ({ loading, error, data }) => {
                if (error) {
                    console.error(error);
                    this.showPrompt();
                }

                if (data && data.actor.nerdStorageVault.secret) {
                    this.setState({ token: data.actor.nerdStorageVault.secret.value })
                } else {
                    this.showPrompt();
                }
            }
        )
    }

    render() {
        return <div>
            <ApiTokenPrompt
                hideTokenPrompt={this.state.hideTokenPrompt}
                hidePrompt={this.hidePrompt}
                showPrompt={this.showPrompt}
                storeToken={this.storeToken}
            />

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
                <GridItem columnSpan={12}><hr /></GridItem>
                <GridItem columnSpan={12}><NewsletterSignups /></GridItem>
                <GridItem columnSpan={6}><TotalSubscriptions /></GridItem>
                <GridItem columnSpan={6}><TotalCancellations token={this.state.token}/></GridItem>
                <GridItem columnSpan={6}>
                    <VersionTotals version='a' accountIds={ACCOUNT_ID} />
                </GridItem>
                <GridItem columnSpan={6}>
                    <VersionTotals version='b' accountIds={ACCOUNT_ID} />
                </GridItem>
                <ChartGroup>
                    <GridItem columnSpan={6}>
                        <VersionPageViews version='a' />
                    </GridItem>
                    <GridItem columnSpan={6}>
                        <VersionPageViews version='b' />
                    </GridItem>
                </ChartGroup>
                <GridItem columnSpan={12}>
                    <EndTestSection
                        accountId={ACCOUNT_ID}
                        versionADescription={VERSION_A_DESCRIPTION}
                        versionBDescription={VERSION_B_DESCRIPTION}
                    />
                </GridItem>
                <GridItem columnSpan={12}>
                    <PastTests accountId={ACCOUNT_ID} />
                </GridItem>
                <GridItem columnSpan={12}>
                    <ApiTokenButton showPrompt={this.showPrompt} />
                </GridItem>
            </Grid>
        </div>
    }
}