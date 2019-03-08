import * as React from 'react';

import { PageLayout } from './components/PageLayout';

export function withPageLayout<P>(WrappedComponent: React.ComponentType<P>): React.ComponentType<P> {
    return (props: P) => (
        <PageLayout>
            <WrappedComponent {...props} />
        </PageLayout>
    )
}