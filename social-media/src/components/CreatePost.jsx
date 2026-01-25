import React, { useState, useRef } from "react";
import { Image, MapPin, Smile, X, Upload, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const CreatePost = ({ onClose, onPost }) => {
  const { currentUser } = useAuth();
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size must be less than 10MB');
        return;
      }

      setSelectedImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageSelect(e);
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
    <div className="w-full max-w-lg bg-white rounded-2xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-scaleIn">
      
      {/* Header */}
      <div className="border-b border-gray-100 p-4 flex justify-between items-center bg-gradient-to-r from-indigo-500 to-pink-500">
        <button 
          onClick={onClose} 
          className="text-white/80 hover:text-white font-medium transition-colors"
        >
          Cancel
        </button>
        <div className="flex items-center gap-2 text-white">
          <Sparkles size={18} />
          <span className="font-semibold">Create Post</span>
        </div>
        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting || (content.trim() === "" && !selectedImage)}
          className="text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
        >
          {isSubmitting ? 'Posting...' : 'Share'}
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* User Info */}
        <div className="flex items-center gap-3 p-4 pb-3">
          <div className="avatar-ring">
            <img 
              src={currentUser?.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.id}`} 
              alt="" 
              className="w-11 h-11 rounded-full object-cover"
            />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{currentUser?.username}</p>
            <p className="text-xs text-gray-400">Sharing to Feed</p>
          </div>
        </div>

        {/* Text Area */}
        <div className="px-4">
          <textarea
            className="w-full min-h-[100px] resize-none outline-none text-gray-800 placeholder-gray-400 text-[15px] leading-relaxed"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            autoFocus
          />
        </div>

        {/* Image Preview or Upload Zone */}
        <div className="px-4 pb-4">
          {imagePreview ? (
            <div className="relative rounded-2xl overflow-hidden bg-gray-100 animate-fadeIn">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full max-h-[300px] object-contain"
              />
              <button
                onClick={removeImage}
                className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
                isDragging 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
              }`}
            >
              <div className={`w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors ${
                isDragging ? 'bg-indigo-100' : 'bg-gray-100'
              }`}>
                <Upload className={`w-7 h-7 ${isDragging ? 'text-indigo-500' : 'text-gray-400'}`} />
              </div>
              <p className="text-gray-600 font-medium mb-1">
                {isDragging ? 'Drop your image here' : 'Add photos to your post'}
              </p>
              <p className="text-gray-400 text-sm">
                Drag and drop or click to upload
              </p>
            </div>
          )}
        </div>

        {/* Tools Row */}
        <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-1">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 hover:bg-white rounded-xl text-gray-500 hover:text-green-500 transition-all"
            >
              <Image size={22} />
            </button>
            <button className="p-2.5 hover:bg-white rounded-xl text-gray-500 hover:text-yellow-500 transition-all">
              <Smile size={22} />
            </button>
            <button className="p-2.5 hover:bg-white rounded-xl text-gray-500 hover:text-red-500 transition-all">
              <MapPin size={22} />
            </button>
          </div>
          <span className={`text-xs font-medium ${content.length > 2000 ? 'text-red-500' : 'text-gray-400'}`}>
            {content.length}/2200
          </span>
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
