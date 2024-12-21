import React from 'react';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



/*
    # Three Dot component which open option Menu on Click, used in multiple child components of this module.
    # The containerClass argument is to assign class name to div container dynamically as EllipsisWithSpacing 
    is used by other components also
*/
export default function EllipsisWithSpacing({ containerClass }) {
    return (
        <div className={containerClass}>
            <FontAwesomeIcon icon={faCircle} style={{ fontSize: '0.2em' }} />
            <FontAwesomeIcon icon={faCircle} style={{ fontSize: '0.2em' }} />
            <FontAwesomeIcon icon={faCircle} style={{ fontSize: '0.2em' }} />
        </div>
    );
}