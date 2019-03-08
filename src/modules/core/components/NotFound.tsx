import * as React from 'react';
import './NotFound.css'

import { Typography } from '@rmwc/typography';

export const NotFound: React.FunctionComponent<{}> = () => (
    <div className="NotFoundCenter">
        <div className="NotFoundChild">
            <Typography use="headline1" className="NotFound404">404</Typography>
            <Typography use="headline4">Not found: we were unable to find the page you were looking for.</Typography>
        </div>
    </div>
)