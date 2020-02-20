import * as React from 'react';
import './PageLayout.css';
import '@material/toolbar/dist/mdc.toolbar.css';

import { SignOutButton } from "./SignOutButton";

import { Toolbar, ToolbarTitle, ToolbarRow, ToolbarSection, ToolbarIcon } from '@rmwc/toolbar';
import { Drawer, DrawerHeader, DrawerTitle, DrawerContent } from '@rmwc/drawer';
import { List, ListItem } from '@rmwc/list';

interface IPageLayoutProps {
    children: React.ReactNode
}

export const PageLayout: React.FC<IPageLayoutProps> = ({ children }) => {
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    return (
        <div>
            <div className="AppBar">
                <Toolbar fixed={true}>
                    <ToolbarRow>
                        <ToolbarSection alignStart={true}>
                            <ToolbarIcon icon="menu" onClick={() => setDrawerOpen(true)} />
                            <ToolbarTitle>CMS</ToolbarTitle>
                        </ToolbarSection>
                        <ToolbarSection alignEnd={true}>
                            <SignOutButton />
                        </ToolbarSection>
                    </ToolbarRow>
                </Toolbar>
            </div>
            <Drawer modal={true} open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <DrawerHeader>
                    <DrawerTitle>CMS</DrawerTitle>
                </DrawerHeader>
                <DrawerContent>
                    <List>
                        <ListItem tag="a" href="/">Drafts</ListItem>
                        <ListItem tag="a" href="/articles">Articles</ListItem>
                    </List>
                </DrawerContent>
            </Drawer>
            {children}
        </div>
    )
}