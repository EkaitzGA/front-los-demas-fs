import { useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import CheckIcon from '@mui/icons-material/Check';

const ImageUpload = ({ projectData, setProjectData, onSubmit, onBack }) => {
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

    const handleImageChange = (e, imageType) => {
        const file = e.target.files[0];
        if (file) {
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

    const handleSubmitForm = async (e) => {
        e.preventDefault();

        if (imagePreviewUrls.main && !cropsAccepted.main) {
            alert('Please accept the crop for the main image');
            return;
        }

        try {
            const formData = new FormData();
            
            // Add project data
            Object.keys(projectData).forEach(key => {
                if (key !== 'images') {
                    formData.append(key, projectData[key]);
                }
            });
    
            // Add images
            if (imageFiles.main) {
                formData.append('mainImage', imageFiles.main);
            }
            if (imageFiles.optional1 && cropsAccepted.optional1) {
                formData.append('optional1', imageFiles.optional1);
            }
            if (imageFiles.optional2 && cropsAccepted.optional2) {
                formData.append('optional2', imageFiles.optional2);
            }
    
            onSubmit(formData);
        } catch (error) {
            console.error('Error preparing form data:', error);
        }
    };

    return (
        <form onSubmit={handleSubmitForm} className="flex flex-col gap-6">
            <div className="images-upload-section space-y-6">
                {/* Main Image Upload */}
                <div className="image-upload-group">
                    <label 
                        htmlFor="mainImage"
                        className="block mb-2 text-sm font-medium text-gray-900"
                    >
                        Main Picture (Required)
                    </label>
                    <input
                        type="file"
                        id="mainImage"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, 'main')}
                        required
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                    />
                    {imagePreviewUrls.main && (
                        <div className="mt-4 image-preview-container">
                            <ReactCrop
                                crop={crops.main}
                                onChange={(crop) => handleCropChange(crop, 'main')}
                                aspect={16/9}
                            >
                                <img 
                                    src={imagePreviewUrls.main} 
                                    alt="Preview"
                                    className="max-w-full h-auto" 
                                />
                            </ReactCrop>
                            <div className="preview-actions mt-2">
                                <p className="text-sm text-gray-600">Drag to adjust crop (16:9)</p>
                                <button 
                                    type="button" 
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
                                    className={`mt-2 px-4 py-2 text-sm font-medium text-white rounded-lg ${
                                        cropsAccepted.main 
                                            ? 'bg-green-600 hover:bg-green-700'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                                >
                                    {cropsAccepted.main ? 'Crop accepted ✓' : 'Accept crop'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                
                {/* <div className="image-upload-group">
                    <label 
                        htmlFor="optional1"
                        className="block mb-2 text-sm font-medium text-gray-900"
                    >
                        Additional Picture (Optional)
                    </label>
                    
                </div>

                <div className="image-upload-group">
                    <label 
                        htmlFor="optional2"
                        className="block mb-2 text-sm font-medium text-gray-900"
                    >
                        Additional Picture (Optional)
                    </label>
                    
                </div> */}
            </div>

            <div className="navigation-buttons">
                <button
                    type="button"
                    onClick={onBack}
                    className="nav-button"
                >
                    Back
                </button>
                <button
                    type="submit"
                    className="check-icon"
                >
                    <CheckIcon />
                </button>
            </div>
        </form>
    );
};

export default ImageUpload;