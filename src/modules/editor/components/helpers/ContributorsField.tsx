import * as React from 'react';

import { ContributorDialog } from './ContributorDialog';
import { ContributorChip } from '../../../core/components/ContributorChip';

import { IconButton } from '@rmwc/icon-button';

interface IProps {
    value: string[],
    onChange: (val: string[]) => any,
}

const initialState = {
    dialogOpen: false
}

export class ContributorsField extends React.Component<IProps, typeof initialState> {
    constructor(props: IProps) {
        super(props);
        this.state = initialState;
    }

    public render() {
        return (
            <div>
                {
                    this.props.value.map(c => <ContributorChip
                        slug={c}
                        key={c}
                        deletable={true}
                        onDelete={slug => this.props.onChange(this.props.value.filter(elem => elem !== slug))}
                    />)
                }
                <IconButton icon="add" type="button" onClick={this.onAddClick}/>
                <ContributorDialog open={this.state.dialogOpen} onClose={this.onDialogClose} />
            </div>
        )
    }

    private onAddClick = () => {
        this.setState({
            dialogOpen: true
        })
    }

    private onDialogClose = (slug: string | null) => {
        this.setState({
            dialogOpen: false,
        });
        if(slug && !(this.props.value.indexOf(slug) > -1)) {
            this.props.onChange([...this.props.value, slug]);
        }
    }
}

