import React, { useState, useRef } from "react";
import { Image, MapPin, Smile, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const CreatePost = ({ onClose, onPost }) => {
  const { currentUser } = useAuth();
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }
      
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size must be less than 10MB');
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (content.trim() === "" && !selectedImage) return;
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('userId', currentUser.id);
      
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const response = await fetch('http://localhost:8800/api/posts', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const newPost = await response.json();
      
      setContent("");
      setSelectedImage(null);
      setImagePreview(null);
      
      if (onPost) onPost(newPost);
      if (onClose) onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-xl overflow-hidden flex flex-col max-h-[90vh]">
      
      {/* Header */}
      <div className="border-b border-gray-200 p-3 flex justify-between items-center bg-white">
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Cancel</button>
        <span className="font-semibold text-gray-700">Create new post</span>
        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting || (content.trim() === "" && !selectedImage)}
          className="text-blue-500 font-bold hover:text-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sharing...' : 'Share'}
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* User Info Row */}
        <div className="flex items-center gap-3 p-4 pb-2">
          <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
            <img 
              src={currentUser?.profilePic || "https://i.pravatar.cc/150?u=" + currentUser?.id} 
              alt="" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-semibold text-sm text-gray-800">{currentUser?.username}</span>
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="relative mx-4 mb-3">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-full max-h-[300px] object-contain rounded-lg bg-gray-100"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full p-1 hover:bg-opacity-80"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Text Area */}
        <div className="px-4 flex-1">
          <textarea
            className="w-full min-h-[120px] resize-none outline-none text-base placeholder-gray-400"
            placeholder="Write a caption..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            autoFocus
          />
        </div>

        {/* Tools Row */}
        <div className="flex justify-between items-center p-4 border-t border-gray-100">
          <div className="flex gap-4 text-gray-400">
            <Smile size={24} className="cursor-pointer hover:text-gray-600"/>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="hover:text-gray-600"
            >
              <Image size={24} />
            </button>
            <MapPin size={24} className="cursor-pointer hover:text-gray-600"/>
          </div>
          <span className="text-xs text-gray-400">{content.length}/2200</span>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          className="hidden"
        />
      </div>
    </div>
  );
};

export default CreatePost;
