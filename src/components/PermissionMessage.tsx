import React from 'react';

interface PermissionMessageProps {
    message: string;
    type?: 'error' | 'warning' | 'info';
}

const PermissionMessage: React.FC<PermissionMessageProps> = ({ 
    message, 
    type = 'warning' 
}) => {
    const getStyles = () => {
        switch (type) {
            case 'error':
                return 'bg-red-100 border-red-400 text-red-700';
            case 'warning':
                return 'bg-yellow-100 border-yellow-400 text-yellow-700';
            case 'info':
                return 'bg-blue-100 border-blue-400 text-blue-700';
            default:
                return 'bg-yellow-100 border-yellow-400 text-yellow-700';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'error':
                return (
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                );
            case 'warning':
                return (
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                );
            case 'info':
                return (
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`border px-4 py-3 rounded-md flex items-center ${getStyles()}`}>
            {getIcon()}
            <span>{message}</span>
        </div>
    );
};

export default PermissionMessage; 