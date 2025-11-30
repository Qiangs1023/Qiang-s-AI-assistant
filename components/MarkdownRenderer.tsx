import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-slate prose-sm max-w-none dark:prose-invert">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          // Override link rendering to open in new tab
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" />
          ),
          // Style tables specifically for the script format
          table: ({ node, ...props }) => (
             <div className="overflow-x-auto my-4 border rounded-lg">
                <table {...props} className="min-w-full divide-y divide-gray-200 text-sm" />
             </div>
          ),
          thead: ({ node, ...props }) => (
            <thead {...props} className="bg-gray-50 font-semibold text-gray-700" />
          ),
          tbody: ({ node, ...props }) => (
            <tbody {...props} className="divide-y divide-gray-200 bg-white text-gray-700" />
          ),
          tr: ({ node, ...props }) => (
            <tr {...props} className="hover:bg-gray-50 transition-colors" />
          ),
          th: ({ node, ...props }) => (
            <th {...props} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
          ),
          td: ({ node, ...props }) => (
            <td {...props} className="px-3 py-2 whitespace-pre-wrap" />
          ),
          // Style blockquotes for "Insight" section
          blockquote: ({ node, ...props }) => (
            <blockquote {...props} className="border-l-4 border-indigo-500 pl-4 py-1 my-4 bg-indigo-50 italic rounded-r-lg" />
          ),
          code: ({ node, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '')
            return !className?.includes('language-') ? (
              <code className="bg-slate-100 text-red-500 rounded px-1 py-0.5 text-xs font-mono" {...props}>
                {children}
              </code>
            ) : (
                <div className="bg-slate-800 text-slate-100 rounded-lg p-3 my-2 text-xs overflow-x-auto">
                    <code className={className} {...props}>
                        {children}
                    </code>
                </div>
            )
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
