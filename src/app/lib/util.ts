export const generateCode = (): string => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};
export type ExpirationTime = 1 | 3 | 7 | 30
export const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const calculateExpiryDate = (days: ExpirationTime = 1): Date => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
};

export const getExpirationDescription = (days: ExpirationTime): string => {
    return days === 1 ? '1 day' : `${days} days`;
};

export const detectLanguage = (content: string): string => {
    if (content.includes('function') || content.includes('const') || content.includes('let') || content.includes('var')) {
        return 'javascript';
    }
    if (content.includes('import') && content.includes('from') && content.includes('react')) {
        return 'jsx';
    }
    if (content.includes('class') && content.includes('public') && content.includes('{')) {
        return 'java';
    }
    if (content.includes('def ') && content.includes(':')) {
        return 'python';
    }
    if (content.includes('<div') || content.includes('<span') || content.includes('</')) {
        return 'html';
    }
    if (content.includes('{') && content.includes(':') && content.includes(';')) {
        return 'css';
    }
    return '';
};

export const sanitizeContent = (content: string): string => {
    return content;
};