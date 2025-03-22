import Image from 'next/image';
import { useState } from 'react';
import { Avatar } from '@mui/material';

const ImageAvatar = ({ alt, src, sx = {}, fallback = 'A' }) => {
    const [hasError, setHasError] = useState(false);
    const width = sx.width || 40;
    const height = sx.height || 40;

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
            {!hasError ? (
                <Image
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    objectFit="cover"
                    onError={() => setHasError(true)}
                />
            ) : (
                <Avatar
                    alt={fallback}
                    src={src}
                    style={{
                        backgroundColor: `hsl(${fallback.charCodeAt(0)* 10 % 360}, 70%, 60%)`,
                        color: '#fff',
                        width: '100%',
                        height: '100%',
                        fontSize: '270%'
                    }}
                >
                    {fallback}
                </Avatar>
            )}
        </div>
    );
};

export default ImageAvatar;
