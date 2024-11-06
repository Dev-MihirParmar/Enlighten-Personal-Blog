"use client";

import "@/styles/editor.css";

import Blockquote from "@tiptap/extension-blockquote";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Document from "@tiptap/extension-document";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent,HTMLContent,JSONContent,ReactNodeViewRenderer,useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";

import CodeBlockSelect from "@/components/CodeBlockSelect";
import EditorBubbleMenu from "@/components/menu/EditorBubbleMenu";
import EditorFloatingMenu from "@/components/menu/EditorFloatingMenu";
import lowlight from "@/lib/lowlight";

const CustomDocument = Document.extend({
  content: "heading block*",
});

interface MeditorProps {
  content: string;
  setContent: (content: string) => void;
}

const Meditor: React.FC<MeditorProps> = ({ content, setContent }) => {
  const [showLinkSelector, setShowLinkSelector] = useState(false);
  const [showBubbleMenu, setShowBubbleMenu] = useState(true);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const [showPlusButton, setShowPlusButton] = useState(false);
  
    const [] = useState<JSONContent | null>(null);
  const [] = useState<HTMLContent | null>(null);
  
  const editor = useEditor({
    content,
    // This can be used to add a new paragraph after an image is inserted
    // but issue is that it adds a new paragraph when the image is updated
    // If user delete the new paragraph, the image is activated again
    // and the new paragraph is added again
    // onUpdate({ editor }) {
    //   if(editor.isActive("image")) {
    //     const endPos = editor.state.selection.$to.pos;
    //     editor.commands.focus("start");
    //     editor
    //       .chain()
    //       .insertContentAt(endPos, { type: "paragraph" })
    //       .focus(endPos)
    //       .run();
    //   }
    // },
    onUpdate({ editor }) {
      // Get the content of the editor and update parent state
      setContent(editor.getHTML());
    },
    onSelectionUpdate({ editor }) {
      if (editor.isActive("heading", { level: 1 }) || editor.isActive("image") || editor.isActive("horizontalRule") || editor.isActive("codeBlock")) {
        setShowBubbleMenu(false);
        setShowPlusButton(false);
        return;
      }
      
      setShowBubbleMenu(true);
      setShowPlusButton(true);
    },
    extensions: [
      CustomDocument,
      StarterKit.configure({
        document: false,
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({ openOnClick: false }),
      Blockquote,
      Image,
      Placeholder.configure({
        placeholder: "Tell your story...",
      }),
      TextAlign.configure({
        types: ["image", "paragraph", "heading"],
      }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer((props) => {
          const nodeAttrs = { ...props.node.attrs, language: props.node.attrs.language || 'plaintext' };
          return <CodeBlockSelect {...props} node={{ ...props.node, attrs: nodeAttrs }} />;
        });
        },
      }).configure({
        lowlight,
      })
    ],
    enableInputRules: ["bulletList", "orderedList", "codeBlock"],
    editorProps: {
      attributes: {
        // before:prose-p:content-none after:prose-p:content-none is used to disable tailiwinds default qutoation marks added to blockquote
        // https://github.com/tailwindlabs/tailwindcss-typography/issues/66
        class: "before:prose-p:content-none after:prose-p:content-none prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-xl focus:outline-none prose-img:mx-auto prose-img:m-0 prose-img:mt-[43px]",
      },
    },
    
  });
  
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!editor) return;

    // Set initial content if provided
    if (content) {
      editor.commands.setContent(content);
    }

    // focus the editor
    editor.commands.focus();
  }, [editor, content]);
  
  if(!editor) return null;

  return (
    <>
      <EditorBubbleMenu 
        editor={editor} 
        showBubbleMenu={showBubbleMenu} 
        showLinkSelector={showLinkSelector} 
        setShowLinkSelector={setShowLinkSelector} 
      />
      <EditorFloatingMenu
        editor={editor}
        showPlusButton={showPlusButton || false}
        showFloatingMenu={showFloatingMenu || false}
        setShowFloatingMenu={setShowFloatingMenu}
      />
      <EditorContent editor={editor} ref={ref} />
    </>
  );
};

export default Meditor;


