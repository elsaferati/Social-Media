import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, ChevronLeft, ChevronRight, Eye, Upload, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storyAPI } from '../services/api';

const StoriesBar = () => {
  const { currentUser } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ content: '', image: null });
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      fetchStories();
    }
  }, [currentUser]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const data = await storyAPI.getFeed(currentUser.id);
      const grouped = groupStoriesByUser(data);
      setStories(grouped);
    } catch (err) {
      console.error('Error fetching stories:', err);
    } finally {
      setLoading(false);
    }
  };

  const groupStoriesByUser = (storiesArray) => {
    const grouped = {};
    storiesArray.forEach(story => {
      if (!grouped[story.userId]) {
        grouped[story.userId] = {
          userId: story.userId,
          username: story.username,
          profilePic: story.profilePic,
          stories: []
        };
      }
      grouped[story.userId].stories.push(story);
    });
    return Object.values(grouped);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Image must be less than 10MB');
        return;
      }
      setCreateForm({ ...createForm, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCreateStory = async () => {
    if (!createForm.content && !createForm.image) {
      alert('Please add content or an image');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('userId', currentUser.id);
      if (createForm.content) formData.append('content', createForm.content);
      if (createForm.image) formData.append('image', createForm.image);

      const response = await fetch('http://localhost:8800/api/stories', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to create story');

      setShowCreateModal(false);
      setCreateForm({ content: '', image: null });
      setPreview(null);
      fetchStories();
    } catch (err) {
      console.error('Error creating story:', err);
      alert('Failed to create story');
    } finally {
      setUploading(false);
    }
  };

  const handleViewStory = async (userStories, index = 0) => {
    setSelectedStory({ ...userStories, currentIndex: index });
    
    const story = userStories.stories[index];
    if (story && story.userId !== currentUser.id) {
      try {
        await storyAPI.view(story.id, currentUser.id);
      } catch (err) {
        console.error('Error marking story as viewed:', err);
      }
    }
  };

  const handleNextStory = () => {
    if (!selectedStory) return;
    
    if (selectedStory.currentIndex < selectedStory.stories.length - 1) {
      const newIndex = selectedStory.currentIndex + 1;
      setSelectedStory({ ...selectedStory, currentIndex: newIndex });
      
      const story = selectedStory.stories[newIndex];
      if (story && story.userId !== currentUser.id) {
        storyAPI.view(story.id, currentUser.id).catch(console.error);
      }
    } else {
      setSelectedStory(null);
    }
  };

  const handlePrevStory = () => {
    if (!selectedStory) return;
    
    if (selectedStory.currentIndex > 0) {
      setSelectedStory({ ...selectedStory, currentIndex: selectedStory.currentIndex - 1 });
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="card-flat p-4 flex gap-4 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 min-w-[72px] animate-pulse">
            <div className="w-[72px] h-[72px] rounded-2xl skeleton"></div>
            <div className="w-12 h-3 skeleton rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Stories Bar */}
      <div className="card-flat p-4 relative">
        {/* Scroll Buttons */}
        {stories.length > 4 && (
          <>
            <button
              onClick={() => scroll('left')}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide">
          {/* Create Story */}
          <div 
            className="flex flex-col items-center gap-2 min-w-[72px] cursor-pointer group"
            onClick={() => setShowCreateModal(true)}
          >
            <div className="w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-indigo-100 to-pink-100 relative overflow-hidden group-hover:from-indigo-200 group-hover:to-pink-200 transition-all border-2 border-dashed border-indigo-300">
              <img 
                src={currentUser?.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.id}`} 
                className="w-full h-full object-cover opacity-50" 
                alt="Me" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center shadow-lg">
                  <Plus size={18} className="text-white" />
                </div>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-600">Add story</span>
          </div>

          {/* User Stories */}
          {stories.map((userStories, index) => (
            <div 
              key={userStories.userId}
              className="flex flex-col items-center gap-2 min-w-[72px] cursor-pointer animate-fadeIn"
              onClick={() => handleViewStory(userStories)}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-[72px] h-[72px] rounded-2xl p-[3px] story-ring">
                <img 
                  src={userStories.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userStories.userId}`} 
                  className="w-full h-full rounded-xl object-cover border-2 border-white" 
                  alt={userStories.username}
                />
              </div>
              <span className="text-xs text-gray-700 truncate w-[72px] text-center font-medium">
                {userStories.username}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Create Story Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-scaleIn">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center gradient-bg">
              <div className="flex items-center gap-2 text-white">
                <Sparkles size={20} />
                <h3 className="font-semibold">Create Story</h3>
              </div>
              <button 
                onClick={() => {
                  setShowCreateModal(false);
                  setCreateForm({ content: '', image: null });
                  setPreview(null);
                }}
                className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {preview ? (
                <div className="relative mb-4 rounded-2xl overflow-hidden bg-gray-100">
                  <img src={preview} alt="Preview" className="w-full max-h-[300px] object-contain" />
                  <button 
                    onClick={() => {
                      setCreateForm({ ...createForm, image: null });
                      setPreview(null);
                    }}
                    className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/50 transition-all mb-4"
                >
                  <div className="w-14 h-14 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                    <Upload className="w-7 h-7 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">Click to add an image</p>
                  <p className="text-gray-400 text-sm mt-1">PNG, JPG up to 10MB</p>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              
              <textarea
                value={createForm.content}
                onChange={(e) => setCreateForm({ ...createForm, content: e.target.value })}
                placeholder="Add text to your story..."
                className="input resize-none"
                rows={3}
              />
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={handleCreateStory}
                disabled={uploading || (!createForm.content && !createForm.image)}
                className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Posting...' : 'Share Story'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Story Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button 
            onClick={() => setSelectedStory(null)}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full z-10 transition-colors"
          >
            <X size={28} />
          </button>
          
          {/* Navigation */}
          {selectedStory.currentIndex > 0 && (
            <button 
              onClick={handlePrevStory}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 hover:bg-white/20 rounded-full transition-colors"
            >
              <ChevronLeft size={32} />
            </button>
          )}
          {selectedStory.currentIndex < selectedStory.stories.length - 1 && (
            <button 
              onClick={handleNextStory}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 hover:bg-white/20 rounded-full transition-colors"
            >
              <ChevronRight size={32} />
            </button>
          )}
          
          {/* Progress Bar */}
          <div className="absolute top-4 left-4 right-4 flex gap-1.5">
            {selectedStory.stories.map((_, i) => (
              <div 
                key={i}
                className={`h-1 flex-1 rounded-full transition-all ${
                  i <= selectedStory.currentIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
          
          {/* User Info */}
          <div className="absolute top-12 left-4 flex items-center gap-3">
            <div className="avatar-ring">
              <img 
                src={selectedStory.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedStory.userId}`}
                className="w-10 h-10 rounded-full object-cover"
                alt={selectedStory.username}
              />
            </div>
            <div>
              <p className="text-white font-semibold">{selectedStory.username}</p>
              <p className="text-white/70 text-sm">
                {new Date(selectedStory.stories[selectedStory.currentIndex].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          
          {/* Story Content */}
          <div className="max-w-lg w-full mx-auto" onClick={handleNextStory}>
            {selectedStory.stories[selectedStory.currentIndex].img && (
              <img 
                src={selectedStory.stories[selectedStory.currentIndex].img.startsWith('http') 
                  ? selectedStory.stories[selectedStory.currentIndex].img 
                  : `http://localhost:8800${selectedStory.stories[selectedStory.currentIndex].img}`
                }
                className="w-full max-h-[80vh] object-contain rounded-2xl"
                alt="Story"
              />
            )}
            {selectedStory.stories[selectedStory.currentIndex].content && (
              <div className="absolute bottom-20 left-0 right-0 p-4">
                <p className="text-white text-center text-lg bg-black/50 backdrop-blur-sm p-4 rounded-2xl">
                  {selectedStory.stories[selectedStory.currentIndex].content}
                </p>
              </div>
            )}
          </div>
          
          {/* Views count */}
          {selectedStory.userId === currentUser.id && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
              <Eye size={18} />
              <span className="font-medium">{selectedStory.stories[selectedStory.currentIndex].viewCount || 0} views</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default StoriesBar;
