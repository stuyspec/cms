import * as React from 'react';
import './PageLayout.css';

import { SimpleTopAppBar } from '@rmwc/top-app-bar';

interface IPageLayoutProps {
    children: React.ReactNode
}

const onNavigate = () => {
    //TODO: set up navigation menu
}

export const PageLayout: React.SFC<IPageLayoutProps> = ({ children }) => (
    <div>
        <div className="AppBar">
            <SimpleTopAppBar
                title="CMS"
                fixed={true}
                navigationIcon={onNavigate}
            />
        </div>
        <>
            {children}
        </>
    </div>
)