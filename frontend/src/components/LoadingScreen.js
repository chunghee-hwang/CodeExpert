import React from 'react';
import { Spinner } from 'react-bootstrap';
export default function LoadingScreen(props) {
    let variant = props.variant;
    let label = props.label;
    if (!variant) {
        variant = 'primary';
    }
    return <div className="loading-container">{label} <Spinner animation="grow" variant={variant} /></div>
}