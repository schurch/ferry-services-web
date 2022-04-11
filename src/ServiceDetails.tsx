import React from 'react';
import { useParams } from "react-router-dom";

export default function ServiceDetails() {
    let params = useParams();
    return (
        <p>SERVICE DETAIL {params.serviceID}</p>
    );
}
