// Modal.jsx
import { useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './Modal.css';

function Modal({ isOpen, onClose, onProjectCreated, userId }) {
    const [projectData, setProjectData] = useState({
        name: '',
        description: '',
        url: '',
        date: '',
        status: 'active',
        types: [],
        subjects: [],
        images: [],
        owner: userId
    });

    const [imageFiles, setImageFiles] = useState({
        main: null,
        optional1: null,
        optional2: null
    });

    const [imagePreviewUrls, setImagePreviewUrls] = useState({
        main: null,
        optional1: null,
        optional2: null
    });

    const [crops, setCrops] = useState({
        main: {
            unit: '%',
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            aspect: 16 / 9
        },
        optional1: {
            unit: '%',
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            aspect: 16 / 9
        },
        optional2: {
            unit: '%',
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            aspect: 16 / 9
        }
    });

    const [cropsAccepted, setCropsAccepted] = useState({
        main: false,
        optional1: false,
        optional2: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProjectData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e, imageType) => {
        const file = e.target.files[0];
        if (file) {
            // Reset crop acceptance when new image is selected
            setCropsAccepted(prev => ({
                ...prev,
                [imageType]: false
            }));

            const reader = new FileReader();
            reader.onload = () => {
                setImagePreviewUrls(prev => ({
                    ...prev,
                    [imageType]: reader.result
                }));
            };
            reader.readAsDataURL(file);

            setImageFiles(prev => ({
                ...prev,
                [imageType]: file
            }));
        }
    };

    const handleCropChange = (crop, imageType) => {
        setCrops(prev => ({
            ...prev,
            [imageType]: crop
        }));
        // Reset acceptance when crop is changed
        setCropsAccepted(prev => ({
            ...prev,
            [imageType]: false
        }));
    };

    const getCroppedImg = (imageSrc, crop) => {
        return new Promise((resolve) => {
            const image = new Image();
            image.src = imageSrc;
            
            image.onload = () => {
                const canvas = document.createElement('canvas');
                const scaleX = image.naturalWidth / image.width;
                const scaleY = image.naturalHeight / image.height;
                
                canvas.width = crop.width;
                canvas.height = crop.height;
                
                const ctx = canvas.getContext('2d');
                
                ctx.drawImage(
                    image,
                    crop.x * scaleX,
                    crop.y * scaleY,
                    crop.width * scaleX,
                    crop.height * scaleY,
                    0,
                    0,
                    crop.width,
                    crop.height
                );
                
                canvas.toBlob(blob => {
                    resolve(blob);
                }, 'image/jpeg', 0.95);
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (imagePreviewUrls.main && !cropsAccepted.main) {
            alert('Por favor, acepta el recorte de la imagen principal');
            return;
        }

        try {
            const formData = new FormData();
            
            // Añadir datos básicos del proyecto
            Object.keys(projectData).forEach(key => {
                if (key !== 'images' && key !== 'types' && key !== 'subjects') {
                    formData.append(key, projectData[key]);
                }
            });
    
            // Añadir imágenes
            if (imageFiles.main) {
                formData.append('mainImage', imageFiles.main, 'main.jpg');
            }
            if (imageFiles.optional1 && cropsAccepted.optional1) {
                formData.append('optional1', imageFiles.optional1, 'optional1.jpg');
            }
            if (imageFiles.optional2 && cropsAccepted.optional2) {
                formData.append('optional2', imageFiles.optional2, 'optional2.jpg');
            }
    
            // Aquí iría la llamada al backend
            // const response = await fetch('/api/projects', {
            //     method: 'POST',
            //     body: formData
            // });
            
            console.log('Proyecto a crear:', formData);
            onClose();
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>×</button>
                <h2>Create New Project</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Project Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={projectData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter project name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={projectData.description}
                            onChange={handleChange}
                            required
                            placeholder="Describe your project"
                            rows="4"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="url">Project URL</label>
                        <input
                            type="url"
                            id="url"
                            name="url"
                            value={projectData.url}
                            onChange={handleChange}
                            required
                            placeholder="https://example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="date">Launch Date</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={projectData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="images-upload-section">
                        <div className="image-upload-group">
                            <label htmlFor="mainImage">Main Picture (Required)</label>
                            <input
                                type="file"
                                id="mainImage"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, 'main')}
                                required
                            />
                            {imagePreviewUrls.main && (
                                <div className="image-preview-container">
                                    <ReactCrop
                                        crop={crops.main}
                                        onChange={(crop) => handleCropChange(crop, 'main')}
                                        aspect={16/9}
                                    >
                                        <img src={imagePreviewUrls.main} alt="Preview" />
                                    </ReactCrop>
                                    <div className="preview-actions">
                                        <p className="preview-hint">Arrastra para ajustar el recorte (16:9)</p>
                                        <button 
                                            type="button" 
                                            className={`accept-crop-button ${cropsAccepted.main ? 'accepted' : ''}`}
                                            onClick={async () => {
                                                const croppedImage = await getCroppedImg(imagePreviewUrls.main, crops.main);
                                                setImageFiles(prev => ({
                                                    ...prev,
                                                    main: croppedImage
                                                }));
                                                setCropsAccepted(prev => ({
                                                    ...prev,
                                                    main: true
                                                }));
                                            }}
                                        >
                                            {cropsAccepted.main ? 'Recorte aceptado ✓' : 'Aceptar recorte'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="image-upload-group">
                            <label htmlFor="optional1">Additional Picture (Optional)</label>
                            <input
                                type="file"
                                id="optional1"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, 'optional1')}
                            />
                            {imagePreviewUrls.optional1 && (
                                <div className="image-preview-container">
                                    <ReactCrop
                                        crop={crops.optional1}
                                        onChange={(crop) => handleCropChange(crop, 'optional1')}
                                        aspect={16/9}
                                    >
                                        <img src={imagePreviewUrls.optional1} alt="Preview" />
                                    </ReactCrop>
                                    <div className="preview-actions">
                                        <p className="preview-hint">Arrastra para ajustar el recorte (16:9)</p>
                                        <button 
                                            type="button" 
                                            className={`accept-crop-button ${cropsAccepted.optional1 ? 'accepted' : ''}`}
                                            onClick={async () => {
                                                const croppedImage = await getCroppedImg(imagePreviewUrls.optional1, crops.optional1);
                                                setImageFiles(prev => ({
                                                    ...prev,
                                                    optional1: croppedImage
                                                }));
                                                setCropsAccepted(prev => ({
                                                    ...prev,
                                                    optional1: true
                                                }));
                                            }}
                                        >
                                            {cropsAccepted.optional1 ? 'Recorte aceptado ✓' : 'Aceptar recorte'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="image-upload-group">
                            <label htmlFor="optional2">Additional Picture (Optional)</label>
                            <input
                                type="file"
                                id="optional2"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, 'optional2')}
                            />
                            {imagePreviewUrls.optional2 && (
                                <div className="image-preview-container">
                                    <ReactCrop
                                        crop={crops.optional2}
                                        onChange={(crop) => handleCropChange(crop, 'optional2')}
                                        aspect={16/9}
                                    >
                                        <img src={imagePreviewUrls.optional2} alt="Preview" />
                                    </ReactCrop>
                                    <div className="preview-actions">
                                        <p className="preview-hint">Arrastra para ajustar el recorte (16:9)</p>
                                        <button 
                                            type="button" 
                                            className={`accept-crop-button ${cropsAccepted.optional2 ? 'accepted' : ''}`}
                                            onClick={async () => {
                                                const croppedImage = await getCroppedImg(imagePreviewUrls.optional2, crops.optional2);
                                                setImageFiles(prev => ({
                                                    ...prev,
                                                    optional2: croppedImage
                                                }));
                                                setCropsAccepted(prev => ({
                                                    ...prev,
                                                    optional2: true
                                                }));
                                            }}
                                        >
                                            {cropsAccepted.optional2 ? 'Recorte aceptado ✓' : 'Aceptar recorte'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-button" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-button">
                            Create Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Modal;