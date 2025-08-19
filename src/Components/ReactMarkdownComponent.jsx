import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";

const customSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), "iframe", "video", "source"],
  attributes: {
    ...defaultSchema.attributes,
    iframe: [
      ["src"],
      ["width"],
      ["height"],
      ["frameborder"],
      ["allow"],
      ["allowfullscreen"],
    ],
    video: [["src"], ["controls"], ["width"], ["height"]],
    source: [["src"], ["type"]],
  },
};


function remarkUnderline() {
  return (tree) => {
    visit(tree, "text", (node, index, parent) => {
      const regex = /\+\+(.+?)\+\+/g;
      let match;
      let lastIndex = 0;
      const newNodes = [];

      while ((match = regex.exec(node.value)) !== null) {
        if (match.index > lastIndex) {
          newNodes.push({
            type: "text",
            value: node.value.slice(lastIndex, match.index),
          });
        }
        newNodes.push({
          type: "underline",
          children: [{ type: "text", value: match[1] }],
        });
        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < node.value.length) {
        newNodes.push({
          type: "text",
          value: node.value.slice(lastIndex),
        });
      }

      if (newNodes.length) {
        parent.children.splice(index, 1, ...newNodes);
      }
    });
  };
}

const ReactMarkdownComponent = ({ md_text }) => (
    <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkUnderline]}
        rehypePlugins={[rehypeRaw, 
            rehypeHighlight, 
            [rehypeSanitize, customSchema]
        ]}
        components={{
            a: (props) => (
                <a
                    className="text-sm sm:text-base underline underline-offset-2 text-primary"
                    {...props}
                />
            ),
            h1: (props) => (
                <h1
                    className="text-xl sm:text-2xl md:text-4xl font-bold mb-4"
                    {...props}
                />
            ),
            h2: (props) => (
                <h2
                    className="text-lg sm:text-xl md:text-3xl font-semibold mb-3"
                    {...props}
                />
            ),
            h3: (props) => (
                <h3
                    className="text-base sm:text-lg md:text-2xl font-medium mb-2"
                    {...props}
                />
            ),
            h4: (props) => (
                <h4
                    className="text-sm sm:text-base md:text-xl font-medium mb-1"
                    {...props}
                />
            ),
            h5: (props) => (
                <h5
                    className="text-sm sm:text-base md:text-lg font-medium mb-1"
                    {...props}
                />
            ),
            p: (props) => (
                <p
                    className="text-sm sm:text-base leading-relaxed mb-2"
                    style={{
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                        hyphens: "auto",
                    }}
                    {...props}
                />
            ),
            ul: (props) => (
                <ul
                    className="list-disc list-inside pl-4 mb-3 space-y-1"
                    style={{
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                        hyphens: "auto",
                    }}
                    {...props}
                />
            ),
            ol: (props) => (
                <ol
                    className="list-decimal list-inside pl-4 mb-3 space-y-1"
                    style={{
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                        hyphens: "auto",
                    }}
                    {...props}
                />
            ),
            li: (props) => (
                <li
                    className="text-sm sm:text-base leading-relaxed"
                    style={{
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                        hyphens: "auto",
                    }}
                    {...props}
                />
            ),
            blockquote: (props) => (
                <blockquote
                    className="border-l-4 border-primary bg-base-200/50 pl-4 italic text-sm sm:text-base mb-3"
                    style={{
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                        hyphens: "auto",
                    }}
                    {...props}
                />
            ),
            u: (props) => (
                <u
                    className="decoration-primary underline underline-offset-2"
                    {...props}
                />
            ),
            hr: (props) => (
                <hr className="my-4 border-t border-base-300" {...props} />
            ),
            table: (props) => (
                <div className="overflow-x-auto my-4">
                    <table
                        className="table w-full bg-base-100 border rounded-lg text-sm sm:text-base"
                        {...props}
                    />
                </div>
            ),
            thead: (props) => (
                <thead
                    className="bg-base-300 text-base-content font-semibold"
                    {...props}
                />
            ),
            tbody: (props) => (
                <tbody className="divide-y divide-base-200" {...props} />
            ),
            tr: (props) => (
                <tr
                    className="hover:bg-base-200 transition-colors"
                    {...props}
                />
            ),
            th: (props) => (
                <th
                    className="text-left px-4 py-2 whitespace-normal"
                    style={{
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                        hyphens: "auto",
                    }}
                    {...props}
                />
            ),
            td: (props) => (
                <td
                    className="px-4 py-2 whitespace-normal"
                    style={{
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                        hyphens: "auto",
                    }}
                    {...props}
                />
            ),
            code: ({ className, children, ...props }) => (
                <code
                    className={`${className || ""} rounded px-1 py-0.5 text-xs sm:text-sm bg-base-300 text-base-content`}
                    {...props}
                >
                    {typeof children === "string"
                        ? children.replace(/\n/g, " ")
                        : children}
                </code>
            ),
            pre: ({ className, children, ...props }) => (
                <pre
                    className={`${className || ""} bg-base-300 text-base-content text-xs sm:text-sm p-3 rounded overflow-x-auto`}
                    {...props}
                >
                    {children}
                </pre>
            ),
            underline: ({ children }) => (
                <span className="underline">{children}</span>
            ),
            video: ({ node }) => (
                <video
                    src={node.url}
                    controls
                    className="rounded-2xl shadow-md my-4 w-full max-w-2xl"
                />
                ),
        }}
    >
        {md_text || ""}
    </ReactMarkdown>
);

export default ReactMarkdownComponent;
