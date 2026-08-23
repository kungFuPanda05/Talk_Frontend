import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Avatar } from '@mui/material';

const ImageAvatar = ({ alt, src, sx = {}, fallback = 'A' }) => {
    const [hasError, setHasError] = useState(false);
    const width = sx.width || 40;
    const height = sx.height || 40;
    const fallbackText = String(fallback || 'U').charAt(0).toUpperCase();

    useEffect(() => {
        setHasError(false);
    }, [src]);

    const containerStyle = {
        width,
        height,
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'inline-block',
        ...sx,
    };

    return (
        <div style={containerStyle}>
            {src && !hasError ? (
                <Image
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={() => setHasError(true)}
                />
            ) : (
                <Avatar
                    alt={alt || fallbackText}
                    style={{
                        backgroundColor: `hsl(${fallbackText.charCodeAt(0) * 10 % 360}, 70%, 60%)`,
                        color: '#fff',
                        width: '100%',
                        height: '100%',
                        fontSize: '270%'
                    }}
                >
                    {fallbackText}
                </Avatar>
            )}
        </div>
    );
};

export default ImageAvatar;
