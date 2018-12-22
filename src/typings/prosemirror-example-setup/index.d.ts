import { Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';

interface IParams {
    schema: Schema,
    mapKeys?: object,
    menuBar?: boolean,
    history?: boolean,
    floatingMenu?: boolean,
    //menuContent: ??
}

export function exampleSetup(options: IParams): [Plugin];