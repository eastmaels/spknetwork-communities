import React from 'react';

import EntryPayout, {EntryPayoutDetail} from './index';
import TestRenderer from 'react-test-renderer';

jest.mock('moment', () => () => ({
    fromNow: () => 'in 4 days',
    format: (f: string, s: string) => '2020-01-01 23:12:00'
}));


it('(1) Default render', () => {
    const props = {
        global: {
            currencyRate: 1,
            currencySymbol: '$'
        },
        entry: {
            pending_payout_value: '14.264 HBD',
            promoted: '0.000 HBD',
            author_payout_value: '0.000 HBD',
            curator_payout_value: '0.000 HBD',
            payout_at: '2020-06-03T15:15:24'
        },
    };

    // @ts-ignore
    const renderer = TestRenderer.create(<EntryPayout {...props}/>);
    expect(renderer.toJSON()).toMatchSnapshot();
});

it('(2) Detail render', () => {
    const props = {
        global: {
            currencyRate: 1,
            currencySymbol: '$'
        },
        entry: {
            pending_payout_value: '14.264 HBD',
            promoted: '0.000 HBD',
            author_payout_value: '0.000 HBD',
            curator_payout_value: '0.000 HBD',
            payout_at: '2020-06-03T15:15:24'
        },
    };

    // @ts-ignore
    const renderer = TestRenderer.create(<EntryPayoutDetail {...props}/>);
    expect(renderer.toJSON()).toMatchSnapshot();
});
