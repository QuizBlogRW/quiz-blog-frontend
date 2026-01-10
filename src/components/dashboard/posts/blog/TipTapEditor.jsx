import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Button, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

// Image Insert Modal Component
function ImageInsertModal({ isOpen, toggle, onInsert }) {
    const [imageUrl, setImageUrl] = useState('');
    const [altText, setAltText] = useState('');

    const handleInsert = () => {
        if (imageUrl.trim()) {
            onInsert(imageUrl.trim(), altText.trim());
            setImageUrl('');
            setAltText('');
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
                        Copy image URL from - Your Images - section on the right
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
                <Button color="primary" onClick={handleInsert} disabled={!imageUrl.trim()}>
                    Insert Image
                </Button>
            </ModalFooter>
        </Modal>
    );
}

// Toolbar Component
function Toolbar({ editor }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!editor) return null;

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const handleInsertImage = (url, alt) => {
        editor.chain().focus().setImage({ src: url, alt }).run();
    };

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
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    style={{
                        padding: '6px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: editor.isActive('bold') ? '#007bff' : 'white',
                        color: editor.isActive('bold') ? 'white' : 'black',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                    title="Bold (Ctrl+B)"
                >
                    <strong>B</strong>
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    style={{
                        padding: '6px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: editor.isActive('italic') ? '#007bff' : 'white',
                        color: editor.isActive('italic') ? 'white' : 'black',
                        cursor: 'pointer',
                        fontStyle: 'italic'
                    }}
                    title="Italic (Ctrl+I)"
                >
                    <em>I</em>
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    disabled={!editor.can().chain().focus().toggleUnderline().run()}
                    style={{
                        padding: '6px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: editor.isActive('underline') ? '#007bff' : 'white',
                        color: editor.isActive('underline') ? 'white' : 'black',
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
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    style={{
                        padding: '6px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: editor.isActive('paragraph') ? '#007bff' : 'white',
                        color: editor.isActive('paragraph') ? 'white' : 'black',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                    title="Normal Text"
                >
                    P
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    style={{
                        padding: '6px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: editor.isActive('heading', { level: 1 }) ? '#007bff' : 'white',
                        color: editor.isActive('heading', { level: 1 }) ? 'white' : 'black',
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
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    style={{
                        padding: '6px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: editor.isActive('heading', { level: 2 }) ? '#007bff' : 'white',
                        color: editor.isActive('heading', { level: 2 }) ? 'white' : 'black',
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
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    style={{
                        padding: '6px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: editor.isActive('heading', { level: 3 }) ? '#007bff' : 'white',
                        color: editor.isActive('heading', { level: 3 }) ? 'white' : 'black',
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
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    style={{
                        padding: '6px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: editor.isActive('bulletList') ? '#007bff' : 'white',
                        color: editor.isActive('bulletList') ? 'white' : 'black',
                        cursor: 'pointer'
                    }}
                    title="Bullet List"
                >
                    • List
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    style={{
                        padding: '6px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: editor.isActive('orderedList') ? '#007bff' : 'white',
                        color: editor.isActive('orderedList') ? 'white' : 'black',
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

// Main TipTap Editor Component
export default function TipTapEditor({ onChange, initialValue = '', minHeight = '300px' }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                inline: false,
                HTMLAttributes: {
                    style: 'max-width: 100%; height: auto; display: block; margin: 10px auto;',
                },
            }),
        ],
        content: initialValue,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
        },
        editorProps: {
            attributes: {
                style: `min-height: ${minHeight}; padding: 15px; outline: none; font-size: 16px; line-height: 1.6;`,
            },
        },
    });

    // Update editor content when initialValue changes (important for Edit mode)
    useEffect(() => {
        if (editor && initialValue !== undefined) {
            const currentContent = editor.getHTML();

            // Only update if the content is actually different to avoid cursor jumps
            if (currentContent !== initialValue) {
                editor.commands.setContent(initialValue, false);
            }
        }
    }, [editor, initialValue]);

    return (
        <div style={{ border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
            <Toolbar editor={editor} />
            <div style={{ position: 'relative', backgroundColor: 'white' }}>
                <EditorContent editor={editor} />
                {!editor?.getText() && (
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
                )}
            </div>

            <style>{`
        .ProseMirror {
          min-height: ${minHeight};
          padding: 15px;
          outline: none;
          font-size: 16px;
          line-height: 1.6;
        }
        
        .ProseMirror p {
          margin: 0 0 15px 0;
        }
        
        .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 20px 0 10px 0;
        }
        
        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 18px 0 8px 0;
        }
        
        .ProseMirror h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin: 16px 0 6px 0;
        }
        
        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 20px;
          margin: 10px 0;
        }
        
        .ProseMirror li {
          margin: 5px 0;
        }
        
        .ProseMirror strong {
          font-weight: bold;
        }
        
        .ProseMirror em {
          font-style: italic;
        }
        
        .ProseMirror u {
          text-decoration: underline;
        }
        
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 10px auto;
          border-radius: 8px;
        }
        
        .ProseMirror:focus {
          outline: none;
        }
      `}</style>
        </div>
    );
}