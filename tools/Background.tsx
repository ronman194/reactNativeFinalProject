import React from 'react';
import { FC } from 'react';
import { ImageBackground } from 'react-native';

const Background: FC<{ children: any }> = ({ children }) => (
    <ImageBackground
        source={require('../assets/wil-stewart-RpDA3uYkJWM-unsplash.jpg')}
        style={{ width: '100%', height: '100%' }}
    >
        {children}
    </ImageBackground >
);

export default Background;