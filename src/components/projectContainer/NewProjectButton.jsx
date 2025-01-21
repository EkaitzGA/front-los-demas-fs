import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import './NewProjectButton.css'

function NewProjectButton({ onClick }) {
    return (
        <div className='project-container-dsk'>
            <div 
                className='image-container new-project-button'
                onClick={onClick}
            >
                <AddIcon sx={{ 
                    fontSize: '64px',
                    color: '#666' 
                }} />
            </div>
        </div>
    );
}

export default NewProjectButton;