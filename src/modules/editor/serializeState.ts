import { EditorState } from 'prosemirror-state';
import { DOMSerializer, DOMParser as ProsemirrorDOMParser, Schema } from 'prosemirror-model';
import { exampleSetup } from 'prosemirror-example-setup';

class XmlSerializerWrapper {
    private serializer: XMLSerializer;
    constructor() {
        this.serializer = new XMLSerializer();
    }
    public serializeToString(doc: any) {
        return this.serializer.serializeToString(doc);
    }
}
const domParser = new DOMParser();
const xmlSerializer = new XmlSerializerWrapper();


export const editorStateToString = (state: EditorState): string => {
    const serializer = DOMSerializer.fromSchema(state.schema);
    const fragment = serializer.serializeFragment(state.doc.content);
    return xmlSerializer.serializeToString(fragment);
}

export const stringToEditorState = (s: string, schema: Schema): EditorState => {
    const domNode = domParser.parseFromString(s, "text/html");
    const parser = ProsemirrorDOMParser.fromSchema(schema);
    const doc = parser.parse(domNode);
    return EditorState.create({
        schema,
        doc,
        plugins: exampleSetup({ schema, menuBar: false })
    })
}