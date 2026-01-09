import { useEffect, useState, useCallback } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode, $createHeadingNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import {
    $getRoot,
    $createParagraphNode,
    DecoratorNode,
    FORMAT_TEXT_COMMAND,
    $getSelection,
    $isRangeSelection,
    SELECTION_CHANGE_COMMAND,
    COMMAND_PRIORITY_CRITICAL
} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { Button, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

// Custom Image Node
class ImageNode extends DecoratorNode {
    __src;
    __altText;
    __width;

    static getType() {
        return 'image';
    }

    static clone(node) {
        return new ImageNode(node.__src, node.__altText, node.__width, node.__key);
    }

    constructor(src, altText, width, key) {
        super(key);
        this.__src = src;
        this.__altText = altText;
        this.__width = width || '100%';
    }

    createDOM() {
        const div = document.createElement('div');
        div.style.margin = '10px 0';
        div.style.textAlign = 'center';

        const img = document.createElement('img');
        img.src = this.__src;
        img.alt = this.__altText || '';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        img.style.margin = '0 auto';

        if (this.__width && this.__width !== 'auto') {
            img.style.width = this.__width;
        }

        div.appendChild(img);
        return div;
    }

    updateDOM() {
        return false;
    }

    exportDOM() {
        const element = document.createElement('img');
        element.setAttribute('src', this.__src);
        element.setAttribute('alt', this.__altText || '');
        element.setAttribute('style', `max-width: 100%; height: auto; display: block; margin: 10px auto; width: ${this.__width};`);
        return { element };
    }

    static importDOM() {
        return {
            // eslint-disable-next-line no-unused-vars
            img: (node) => ({
                conversion: (element) => {
                    const src = element.getAttribute('src');
                    const alt = element.getAttribute('alt');
                    const width = element.style.width || '100%';
                    if (src) {
                        return {
                            node: new ImageNode(src, alt, width),
                        };
                    }
                    return null;
                },
                priority: 0,
            }),
        };
    }

    static importJSON(serializedNode) {
        return new ImageNode(
            serializedNode.src,
            serializedNode.altText,
            serializedNode.width
        );
    }

    exportJSON() {
        return {
            type: 'image',
            src: this.__src,
            altText: this.__altText,
            width: this.__width,
            version: 1,
        };
    }

    decorate() {
        return null; // Don't use React component in decorate
    }

    isInline() {
        return false;
    }

    isIsolated() {
        return true;
    }
}

// Image Insert Modal Component
function ImageInsertModal({ isOpen, toggle, onInsert }) {
    const [imageUrl, setImageUrl] = useState('');
    const [altText, setAltText] = useState('');
    const [isInserting, setIsInserting] = useState(false);

    const handleInsert = () => {
        if (imageUrl.trim() && !isInserting) {
            setIsInserting(true);
            onInsert(imageUrl.trim(), altText.trim());
            setImageUrl('');
            setAltText('');
            setIsInserting(false);
            toggle();
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && imageUrl.trim()) {
            e.preventDefault();
            handleInsert();
        }
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Insert Image</ModalHeader>
            <ModalBody>
                <div className="mb-3">
                    <label className="form-label">
                        <strong>Image URL</strong> <span className="text-danger">*</span>
                    </label>
                    <Input
                        type="text"
                        placeholder="https://example.com/image.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        onKeyPress={handleKeyPress}
                        autoFocus
                    />
                    <small className="text-muted">
                        Copy image URL from &quot;Your Images&quot; section on the right
                    </small>
                </div>
                <div className="mb-3">
                    <label className="form-label">
                        <strong>Alt Text</strong>
                    </label>
                    <Input
                        type="text"
                        placeholder="Image description"
                        value={altText}
                        onChange={(e) => setAltText(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <small className="text-muted">
                        Describe the image for accessibility
                    </small>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" outline onClick={toggle}>
                    Cancel
                </Button>
                <Button color="primary" onClick={handleInsert} disabled={!imageUrl.trim() || isInserting}>
                    Insert Image
                </Button>
            </ModalFooter>
        </Modal>
    );
}

// Toolbar Component
function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Update toolbar state based on selection
    useEffect(() => {
        return editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            () => {
                editor.getEditorState().read(() => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        setIsBold(selection.hasFormat('bold'));
                        setIsItalic(selection.hasFormat('italic'));
                        setIsUnderline(selection.hasFormat('underline'));
                    }
                });
                return false;
            },
            COMMAND_PRIORITY_CRITICAL
        );
    }, [editor]);

    const formatText = (format) => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
    };

    const insertHeading = (headingTag) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createHeadingNode(headingTag));
            }
        });
    };

    const formatParagraph = () => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createParagraphNode());
            }
        });
    };

    const insertList = (listType) => {
        if (listType === 'bullet') {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        } else {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        }
    };

    const handleInsertImage = useCallback((url, alt) => {
        editor.update(() => {
            const selection = $getSelection();
            const imageNode = new ImageNode(url, alt, '100%');
            const paragraphNode = $createParagraphNode();

            if ($isRangeSelection(selection)) {
                // Insert at current selection
                selection.insertNodes([imageNode, paragraphNode]);
            } else {
                // Fallback: append to end of document
                const root = $getRoot();
                root.append(imageNode);
                root.append(paragraphNode);
            }
        });
    }, [editor]);

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    return (
        <>
            <div style={{
                padding: '10px',
                borderBottom: '1px solid #ddd',
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                backgroundColor: '#f8f9fa',
                alignItems: 'center'
            }}>
                <button
                    type="button"
                    onClick={() => formatText('bold')}
                    style={{
                        padding: '6px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: isBold ? '#007bff' : 'white',
                        color: isBold ? 'white' : 'black',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                    title="Bold (Ctrl+B)"
                >
                    <strong>B</strong>
                </button>

                <button
                    type="button"
                    onClick={() => formatText('italic')}
                    style={{
                        padding: '6px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: isItalic ? '#007bff' : 'white',
                        color: isItalic ? 'white' : 'black',
                        cursor: 'pointer',
                        fontStyle: 'italic'
                    }}
                    title="Italic (Ctrl+I)"
                >
                    <em>I</em>
                </button>

                <button
                    type="button"
                    onClick={() => formatText('underline')}
                    style={{
                        padding: '6px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: isUnderline ? '#007bff' : 'white',
                        color: isUnderline ? 'white' : 'black',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                    }}
                    title="Underline (Ctrl+U)"
                >
                    U
                </button>

                <div style={{ width: '1px', backgroundColor: '#ccc', margin: '0 4px', height: '24px' }} />

                <button
                    type="button"
                    onClick={formatParagraph}
                    style={{
                        padding: '6px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                    title="Normal Text"
                >
                    P
                </button>

                <button
                    type="button"
                    onClick={() => insertHeading('h1')}
                    style={{
                        padding: '6px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    }}
                    title="Heading 1"
                >
                    H1
                </button>

                <button
                    type="button"
                    onClick={() => insertHeading('h2')}
                    style={{
                        padding: '6px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    }}
                    title="Heading 2"
                >
                    H2
                </button>

                <button
                    type="button"
                    onClick={() => insertHeading('h3')}
                    style={{
                        padding: '6px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    }}
                    title="Heading 3"
                >
                    H3
                </button>

                <div style={{ width: '1px', backgroundColor: '#ccc', margin: '0 4px', height: '24px' }} />

                <button
                    type="button"
                    onClick={() => insertList('bullet')}
                    style={{
                        padding: '6px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: 'white',
                        cursor: 'pointer'
                    }}
                    title="Bullet List"
                >
                    • List
                </button>

                <button
                    type="button"
                    onClick={() => insertList('number')}
                    style={{
                        padding: '6px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: 'white',
                        cursor: 'pointer'
                    }}
                    title="Numbered List"
                >
                    1. List
                </button>

                <div style={{ width: '1px', backgroundColor: '#ccc', margin: '0 4px', height: '24px' }} />

                <button
                    type="button"
                    onClick={toggleModal}
                    style={{
                        padding: '6px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: '500'
                    }}
                    title="Insert Image"
                >
                    🖼️ Image
                </button>
            </div>

            <ImageInsertModal
                isOpen={isModalOpen}
                toggle={toggleModal}
                onInsert={handleInsertImage}
            />
        </>
    );
}

// Plugin to handle HTML content changes
function OnChangePlugin({ onChange }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                const htmlString = $generateHtmlFromNodes(editor, null);
                onChange(htmlString);
            });
        });
    }, [editor, onChange]);

    return null;
}

// Plugin to load initial HTML content
function LoadInitialContentPlugin({ content }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!content) return;

        editor.update(() => {
            const parser = new DOMParser();
            const dom = parser.parseFromString(content, 'text/html');
            const nodes = $generateNodesFromDOM(editor, dom);

            const root = $getRoot();
            root.clear();
            root.append(...nodes);
        });
    }, [content, editor]);

    return null;
}

// Main Editor Component
export default function LexicalEditor({ onChange, initialValue, minHeight = '300px' }) {
    const initialConfig = {
        namespace: 'BlogEditor',
        theme: {
            paragraph: 'editor-paragraph',
            heading: {
                h1: 'editor-heading-h1',
                h2: 'editor-heading-h2',
                h3: 'editor-heading-h3',
            },
            list: {
                ul: 'editor-list-ul',
                ol: 'editor-list-ol',
                listitem: 'editor-listitem',
            },
            link: 'editor-link',
            text: {
                bold: 'editor-text-bold',
                italic: 'editor-text-italic',
                underline: 'editor-text-underline',
            },
        },
        onError: (error) => {
            console.error('Lexical Error:', error);
        },
        nodes: [
            HeadingNode,
            ListNode,
            ListItemNode,
            QuoteNode,
            CodeNode,
            CodeHighlightNode,
            TableNode,
            TableCellNode,
            TableRowNode,
            AutoLinkNode,
            LinkNode,
            ImageNode,
        ],
    };

    return (
        <div style={{ border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
            <LexicalComposer initialConfig={initialConfig}>
                <ToolbarPlugin />
                <div style={{ position: 'relative', backgroundColor: 'white' }}>
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable
                                style={{
                                    minHeight,
                                    padding: '15px',
                                    outline: 'none',
                                    fontSize: '16px',
                                    lineHeight: '1.6',
                                }}
                            />
                        }
                        placeholder={
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '15px',
                                    left: '15px',
                                    color: '#999',
                                    pointerEvents: 'none',
                                }}
                            >
                                Start writing your blog post...
                            </div>
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin />
                    <ListPlugin />
                    <LinkPlugin />
                    <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                    <OnChangePlugin onChange={onChange} />
                    <LoadInitialContentPlugin content={initialValue} />
                </div>
            </LexicalComposer>

            <style>{`
        .editor-paragraph {
          margin: 0 0 15px 0;
        }
        .editor-heading-h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 20px 0 10px 0;
        }
        .editor-heading-h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 18px 0 8px 0;
        }
        .editor-heading-h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin: 16px 0 6px 0;
        }
        .editor-list-ul {
          padding-left: 20px;
          margin: 10px 0;
        }
        .editor-list-ol {
          padding-left: 20px;
          margin: 10px 0;
        }
        .editor-listitem {
          margin: 5px 0;
        }
        .editor-link {
          color: #007bff;
          text-decoration: underline;
        }
        .editor-text-bold {
          font-weight: bold;
        }
        .editor-text-italic {
          font-style: italic;
        }
        .editor-text-underline {
          text-decoration: underline;
        }
      `}</style>
        </div>
    );
}