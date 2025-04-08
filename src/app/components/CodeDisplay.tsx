'use client';

import React, { useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { marked } from 'marked';
import { FiClipboard, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface CodeDisplayProps {
    content: string;
    contentType: 'plain' | 'markdown' | 'code';
    language: string;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ content, contentType, language }) => {
    const [copied, setCopied] = React.useState(false);

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
        } catch (err) {
            console.error('Failed to copy content: ', err);
        }
    };

    const renderContent = () => {
        switch (contentType) {
            case 'markdown':
                return (
                    <div
                        className="prose dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: marked.parse(content) as string }}
                    />
                );
            case 'code':
                return (
                    <div className="relative group">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={copyToClipboard}
                            className="absolute top-2 right-2 p-2 rounded-md bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 opacity-0 group-hover:opacity-100"
                            aria-label="Copy code"
                        >
                            {copied ? <FiCheck /> : <FiClipboard />}
                        </motion.button>
                        <SyntaxHighlighter
                            language={language || 'javascript'}
                            style={atomDark}
                            customStyle={{
                                margin: 0,
                                borderRadius: '0.5rem',
                                padding: '1rem',
                                fontSize: '0.875rem',
                                lineHeight: 1.5,
                                backgroundColor: '#0D1117',
                            }}
                            showLineNumbers
                        >
                            {content}
                        </SyntaxHighlighter>
                    </div>
                );
            default:
                return (
                    <div className="whitespace-pre-wrap break-words bg-gray-50 dark:bg-gray-900 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                        {content}
                    </div>
                );
        }
    };

    return <div className="w-full">{renderContent()}</div>;
};

export default CodeDisplay;