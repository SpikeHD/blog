import { PropsWithChildren } from "react";
import Markdown from "react-markdown";
import { Prism } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

// from https://stackoverflow.com/a/77468989
export function MarkdownWithCode({ children }: PropsWithChildren) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        code({ node: _, inline, className, children, ...props}: any) {
          const match = /language-(\w+)/.exec(className || '');

          return !inline && match ? (
            <Prism
              style={oneDark}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </Prism>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        }
      }}
    >
      {children as string}
    </Markdown>
  )
}
