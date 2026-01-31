import React, { useState, useRef } from "react";
import { Image, MapPin, Smile, X, Upload } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const EMOJI_LIST = ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😍', '🥰', '😘', '👍', '👋', '❤️', '🎉', '🔥', '✨', '😂', '🥺', '😭', '🤔', '🙃', '😎', '🤗', '😜', '🤪'];

const CreatePost = ({ onClose, onPost }) => {
  const { currentUser } = useAuth();
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

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
      reader.onloadend = () => setImagePreview(reader.result);
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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEmojiSelect = (emoji) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.slice(0, start) + emoji + content.slice(end);
      setContent(newContent);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    } else {
      setContent((prev) => prev + emoji);
    }
    setShowEmojiPicker(false);
  };

  const handleLocationClick = async () => {
    if (!navigator.geolocation) {
      alert('Location is not supported by your browser.');
      return;
    }
    setLocationLoading(true);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });
      const { latitude, longitude } = position.coords;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      const place = data.display_name || data.address?.city || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      const locationText = `📍 ${place}`;
      setContent((prev) => (prev ? `${prev}\n${locationText}` : locationText));
    } catch (err) {
      console.error('Location error:', err);
      if (err.code === 1) {
        alert('Location access was denied. Please enable location in your browser.');
      } else {
        alert('Could not get your location. Please try again.');
      }
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (content.trim() === "" && !selectedImage) return;
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('userId', currentUser.id);
      
      if (selectedImage) formData.append('image', selectedImage);

      const response = await fetch('http://localhost:8800/api/posts', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to create post');

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
    <div className="w-full max-w-lg bg-white rounded-xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#E5E7EB] flex justify-between items-center">
        <button 
          onClick={onClose} 
          className="text-[#6B7280] hover:text-[#1F2937] font-medium transition-colors"
        >
          Cancel
        </button>
        <h3 className="font-semibold text-[#1F2937]">Create Post</h3>
        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting || (content.trim() === "" && !selectedImage)}
          className="text-[#6366F1] font-semibold hover:text-[#4F46E5] disabled:text-[#9CA3AF] disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Posting...' : 'Share'}
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* User */}
        <div className="flex items-center gap-3 px-5 py-4">
          <img 
            src={currentUser?.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.id}`} 
            alt="" 
            className="w-11 h-11 rounded-full object-cover bg-[#F3F4F6]"
          />
          <div>
            <p className="font-semibold text-[#1F2937]">{currentUser?.username}</p>
            <p className="text-xs text-[#9CA3AF]">Sharing to Feed</p>
          </div>
        </div>

        {/* Content */}
        <div className="px-5">
          <textarea
            ref={textareaRef}
            className="w-full min-h-[100px] resize-none outline-none text-[#374151] placeholder-[#9CA3AF] text-[15px] leading-relaxed"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            autoFocus
          />
        </div>

        {/* Image Preview / Upload */}
        <div className="px-5 pb-4">
          {imagePreview ? (
            <div className="relative rounded-xl overflow-hidden bg-[#F3F4F6] animate-fadeIn">
              <img src={imagePreview} alt="Preview" className="w-full max-h-[300px] object-contain" />
              <button
                onClick={removeImage}
                className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                isDragging 
                  ? 'border-[#6366F1] bg-[#EEF2FF]' 
                  : 'border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#F9FAFB]'
              }`}
            >
              <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center transition-colors ${
                isDragging ? 'bg-[#6366F1]/10' : 'bg-[#F3F4F6]'
              }`}>
                <Upload className={`w-6 h-6 ${isDragging ? 'text-[#6366F1]' : 'text-[#9CA3AF]'}`} />
              </div>
              <p className="text-[#374151] font-medium mb-1">
                {isDragging ? 'Drop your image here' : 'Add photos to your post'}
              </p>
              <p className="text-[#9CA3AF] text-sm">
                Drag and drop or click to upload
              </p>
            </div>
          )}
        </div>

        {/* Tools */}
        <div className="flex justify-between items-center px-5 py-3 border-t border-[#E5E7EB] bg-[#F9FAFB] relative">
          <div className="flex items-center gap-1">
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 hover:bg-white rounded-lg text-[#6B7280] hover:text-green-500 transition-all"
              title="Add photo"
            >
              <Image size={22} />
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker((p) => !p)}
                className={`p-2.5 hover:bg-white rounded-lg transition-all ${showEmojiPicker ? 'bg-white text-yellow-500' : 'text-[#6B7280] hover:text-yellow-500'}`}
                title="Add emoji"
              >
                <Smile size={22} />
              </button>
              {showEmojiPicker && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowEmojiPicker(false)}
                  />
                  <div className="absolute left-0 bottom-full mb-2 bg-white rounded-xl shadow-lg border border-[#E5E7EB] p-2 z-20 w-[240px] flex flex-wrap gap-1">
                    {EMOJI_LIST.map((emoji, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleEmojiSelect(emoji)}
                        className="w-8 h-8 text-lg hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={handleLocationClick}
              disabled={locationLoading}
              className="p-2.5 hover:bg-white rounded-lg text-[#6B7280] hover:text-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Add location"
            >
              {locationLoading ? (
                <div className="w-[22px] h-[22px] border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <MapPin size={22} />
              )}
            </button>
          </div>
          <span className={`text-xs font-medium ${content.length > 2000 ? 'text-red-500' : 'text-[#9CA3AF]'}`}>
            {content.length}/2200
          </span>
        </div>

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
