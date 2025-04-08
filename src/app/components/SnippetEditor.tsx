'use client';

import { useState, useRef, useEffect } from 'react';
import { ExpirationTime, getExpirationDescription } from '@/app/lib/util';
import { FadeIn } from '@/app/components/animations/FadeIn';
import { motion } from 'framer-motion';
import { FiClock, FiFileText, FiCode, FiEdit3 } from 'react-icons/fi';
import { showToast } from '@/app/components/ui/Toast';

interface SnippetEditorProps {
    content: string;
    setContent: (content: string) => void;
    contentType: 'plain' | 'markdown' | 'code';
    setContentType: (type: 'plain' | 'markdown' | 'code') => void;
    language: string;
    setLanguage: (language: string) => void;
    expirationDays: ExpirationTime;
    setExpirationDays: (days: ExpirationTime) => void;
}

const SnippetEditor: React.FC<SnippetEditorProps> = ({
    content,
    setContent,
    contentType,
    setContentType,
    language,
    setLanguage,
    expirationDays,
    setExpirationDays,
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [rows, setRows] = useState(5);
    const MAX_HEIGHT = 400;

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';

            const scrollHeight = textareaRef.current.scrollHeight;
            if (scrollHeight > MAX_HEIGHT) {
                textareaRef.current.style.height = `${MAX_HEIGHT}px`;
                textareaRef.current.style.overflowY = 'auto';
            } else {
                textareaRef.current.style.height = `${Math.max(scrollHeight, 100)}px`;
                textareaRef.current.style.overflowY = 'hidden';
            }

            const contentLines = content.split('\n').length;
            setRows(Math.max(5, Math.min(15, contentLines)));
        }
    }, [content]);

    const handleContentTypeChange = (type: 'plain' | 'markdown' | 'code') => {
        setContentType(type);
        showToast.info(`Content type changed to ${type}`);
    };

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(e.target.value);
        if (e.target.value) {
            showToast.info(`Language set to ${e.target.value}`);
        }
    };

    const handleExpirationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setExpirationDays(Number(e.target.value) as ExpirationTime);
        showToast.info(`Expiration set to ${getExpirationDescription(Number(e.target.value) as ExpirationTime)}`);
    };

    return (
        <FadeIn className="space-y-4">
            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-100 mb-2">
                    Your Text Snippet
                </label>
                <div className="mt-1">
                    <textarea
                        ref={textareaRef}
                        id="content"
                        name="content"
                        rows={rows}
                        className="shadow-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-600 rounded-lg p-3 font-mono bg-gray-900 text-gray-100 resize-none transition-colors duration-200"
                        placeholder={
                            contentType === 'markdown'
                                ? "# Enter your markdown here\n\nYou can use **bold**, *italic*, and `code`"
                                : contentType === 'code'
                                    ? "Enter your code snippet here..."
                                    : "Enter your text here..."
                        }
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{ maxHeight: `${MAX_HEIGHT}px` }}
                    ></textarea>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-100 mb-2">
                        Content Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <ContentTypeButton
                            active={contentType === 'plain'}
                            onClick={() => handleContentTypeChange('plain')}
                            icon={<FiFileText className="mr-2" />}
                            label="Plain"
                        />
                        <ContentTypeButton
                            active={contentType === 'markdown'}
                            onClick={() => handleContentTypeChange('markdown')}
                            icon={<FiEdit3 className="mr-2" />}
                            label="Markdown"
                        />
                        <ContentTypeButton
                            active={contentType === 'code'}
                            onClick={() => handleContentTypeChange('code')}
                            icon={<FiCode className="mr-2" />}
                            label="Code"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-100 mb-2">
                        <div className="flex items-center">
                            <FiClock className="mr-2" />
                            Expires After
                        </div>
                    </label>
                    <select
                        id="expiration"
                        name="expiration"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg bg-gray-900 text-gray-100"
                        value={expirationDays}
                        onChange={handleExpirationChange}
                    >
                        <option value={1}>{getExpirationDescription(1)}</option>
                        <option value={3}>{getExpirationDescription(3)}</option>
                        <option value={7}>{getExpirationDescription(7)}</option>
                        <option value={30}>{getExpirationDescription(30)}</option>
                    </select>
                </div>
            </div>

            {contentType === 'code' && (
                <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-100 mb-2">
                        Programming Language
                    </label>
                    <select
                        id="language"
                        name="language"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg bg-gray-900 text-gray-100"
                        value={language}
                        onChange={handleLanguageChange}
                    >
                        <option value="">Auto-detect</option>
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="jsx">JSX/React</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="c">C</option>
                        <option value="cpp">C++</option>
                        <option value="csharp">C#</option>
                        <option value="php">PHP</option>
                        <option value="ruby">Ruby</option>
                        <option value="go">Go</option>
                        <option value="rust">Rust</option>
                        <option value="swift">Swift</option>
                        <option value="kotlin">Kotlin</option>
                        <option value="sql">SQL</option>
                        <option value="json">JSON</option>
                        <option value="yaml">YAML</option>
                        <option value="bash">Bash</option>
                    </select>
                </div>
            )}

            {contentType === 'markdown' && (
                <div className="text-xs text-gray-400 italic">
                    <p>Markdown formatting is supported, including headings, lists, links, and code blocks.</p>
                </div>
            )}
        </FadeIn>
    );
};

interface ContentTypeButtonProps {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}

const ContentTypeButton: React.FC<ContentTypeButtonProps> = ({ active, onClick, icon, label }) => (
    <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className={`flex items-center justify-center px-3 py-2 border rounded-lg text-sm font-medium transition-colors duration-200 ${active
            ? 'bg-indigo-800 text-indigo-100 border-indigo-600'
            : 'bg-gray-900 text-gray-300 border-gray-700 hover:bg-gray-800'
            }`}
    >
        {icon}
        {label}
    </motion.button>
);

export default SnippetEditor;