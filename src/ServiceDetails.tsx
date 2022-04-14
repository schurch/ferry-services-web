import React from 'react';
import { useLocation } from "react-router-dom";
import { Service } from "./Types"

export default function ServiceDetails() {
    const location = useLocation();
    const service = location.state as Service
    return (
        <div>
            <h1>{service.area}</h1>
            <h2>{service.route}</h2>
            <p dangerouslySetInnerHTML={{ __html: service.additional_info ?? "" }}></p>
        </div>
    );
}
