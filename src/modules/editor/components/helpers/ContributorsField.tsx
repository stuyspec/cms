import * as React from 'react';
import './EditorHelpers.css';

import { ContributorDialog } from './ContributorDialog';
import { ContributorChip } from '../../../core/components/ContributorChip';

import { IconButton } from '@rmwc/icon-button';
import { Typography } from '@rmwc/typography';

interface IProps {
    value: string[],
    onChange: (val: string[]) => any,
    //maximum number of contributors allowed
    max?: number
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
        const addIcon = this.props.max === undefined || this.props.value.length < this.props.max
            ? <IconButton icon="add" type="button" onClick={this.onAddClick} />
            : null;

        return (
            <div className="EditorField">
                <Typography use="caption">{this.props.max == 1 ? "Contributor" : "Contributors"}</Typography>
                <div>
                    {
                        this.props.value.map(c => <ContributorChip
                            slug={c}
                            key={c}
                            deletable={true}
                            onDelete={slug => this.props.onChange(this.props.value.filter(elem => elem !== slug))}
                        />)
                    }
                    {addIcon}
                    <ContributorDialog open={this.state.dialogOpen} onClose={this.onDialogClose} />
                </div>
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
        if (slug && !(this.props.value.indexOf(slug) > -1)) {
            this.props.onChange([...this.props.value, slug]);
        }
    }
}

