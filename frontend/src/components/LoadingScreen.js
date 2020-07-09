import React from 'react';
import { Spinner } from 'react-bootstrap';
export default function LoadingScreen(props) {
    let variant = props.variant;
    let label = props.label;
    let animation = props.animation;
    let size = props.size;
    if (!variant) {
        variant = 'primary';
    }
    if (!animation) {
        animation = 'grow'
    }
    if (!size) {
        size = '';
    }
    return <div className="loading-container"> {label} <Spinner animation={animation} variant={variant} size={size} /></div>
}