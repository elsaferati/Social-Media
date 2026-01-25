import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, ChevronLeft, ChevronRight, Eye, Upload } from 'lucide-react';
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
    if (currentUser) fetchStories();
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
    if (!selectedStory && selectedStory.currentIndex > 0) {
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
      <div className="card p-4 flex gap-4 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 min-w-[66px] animate-pulse">
            <div className="w-[66px] h-[66px] rounded-full skeleton"></div>
            <div className="w-10 h-2.5 skeleton rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Stories Bar */}
      <div className="card p-4 relative">
        {stories.length > 4 && (
          <>
            <button
              onClick={() => scroll('left')}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-md border border-[#E5E7EB] rounded-full flex items-center justify-center hover:bg-[#F3F4F6] transition-colors"
            >
              <ChevronLeft size={16} className="text-[#4B5563]" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-md border border-[#E5E7EB] rounded-full flex items-center justify-center hover:bg-[#F3F4F6] transition-colors"
            >
              <ChevronRight size={16} className="text-[#4B5563]" />
            </button>
          </>
        )}

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide">
          {/* Create Story */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex flex-col items-center gap-2 min-w-[66px] group"
          >
            <div className="w-[66px] h-[66px] rounded-full border-2 border-dashed border-[#D1D5DB] flex items-center justify-center bg-[#F9FAFB] group-hover:border-[#6366F1] group-hover:bg-[#EEF2FF] transition-all">
              <Plus size={24} className="text-[#9CA3AF] group-hover:text-[#6366F1] transition-colors" />
            </div>
            <span className="text-xs text-[#6B7280] font-medium">Add story</span>
          </button>

          {/* User Stories */}
          {stories.map((userStories, index) => (
            <button
              key={userStories.userId}
              onClick={() => handleViewStory(userStories)}
              className="flex flex-col items-center gap-2 min-w-[66px] animate-fadeIn"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-[66px] h-[66px] rounded-full p-[2px] story-ring">
                <img 
                  src={userStories.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userStories.userId}`} 
                  className="w-full h-full rounded-full object-cover border-2 border-white" 
                  alt={userStories.username}
                />
              </div>
              <span className="text-xs text-[#374151] truncate w-[66px] text-center font-medium">
                {userStories.username}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Create Story Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full overflow-hidden shadow-2xl animate-scaleIn">
            <div className="p-5 border-b border-[#E5E7EB] flex justify-between items-center">
              <h3 className="font-semibold text-[#1F2937]">Create Story</h3>
              <button 
                onClick={() => {
                  setShowCreateModal(false);
                  setCreateForm({ content: '', image: null });
                  setPreview(null);
                }}
                className="p-2 hover:bg-[#F3F4F6] rounded-full transition-colors"
              >
                <X size={20} className="text-[#6B7280]" />
              </button>
            </div>
            
            <div className="p-5">
              {preview ? (
                <div className="relative mb-4 rounded-xl overflow-hidden bg-[#F3F4F6]">
                  <img src={preview} alt="Preview" className="w-full max-h-[300px] object-contain" />
                  <button 
                    onClick={() => {
                      setCreateForm({ ...createForm, image: null });
                      setPreview(null);
                    }}
                    className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-[#E5E7EB] rounded-xl p-10 text-center cursor-pointer hover:border-[#6366F1] hover:bg-[#F9FAFB] transition-all mb-4"
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-[#F3F4F6] rounded-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-[#9CA3AF]" />
                  </div>
                  <p className="text-[#374151] font-medium">Click to add an image</p>
                  <p className="text-[#9CA3AF] text-sm mt-1">PNG, JPG up to 10MB</p>
                </button>
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
            
            <div className="p-5 border-t border-[#E5E7EB] bg-[#F9FAFB]">
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
          
          {/* Progress */}
          <div className="absolute top-4 left-4 right-4 flex gap-1">
            {selectedStory.stories.map((_, i) => (
              <div 
                key={i}
                className={`h-1 flex-1 rounded-full transition-all ${
                  i <= selectedStory.currentIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
          
          {/* User */}
          <div className="absolute top-10 left-4 flex items-center gap-3">
            <img 
              src={selectedStory.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedStory.userId}`}
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
              alt={selectedStory.username}
            />
            <div>
              <p className="text-white font-semibold">{selectedStory.username}</p>
              <p className="text-white/70 text-sm">
                {new Date(selectedStory.stories[selectedStory.currentIndex].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          
          {/* Content */}
          <div className="max-w-lg w-full mx-auto" onClick={handleNextStory}>
            {selectedStory.stories[selectedStory.currentIndex].img && (
              <img 
                src={selectedStory.stories[selectedStory.currentIndex].img.startsWith('http') 
                  ? selectedStory.stories[selectedStory.currentIndex].img 
                  : `http://localhost:8800${selectedStory.stories[selectedStory.currentIndex].img}`
                }
                className="w-full max-h-[80vh] object-contain rounded-xl"
                alt="Story"
              />
            )}
            {selectedStory.stories[selectedStory.currentIndex].content && (
              <div className="absolute bottom-20 left-0 right-0 p-4">
                <p className="text-white text-center text-lg bg-black/50 backdrop-blur-sm p-4 rounded-xl">
                  {selectedStory.stories[selectedStory.currentIndex].content}
                </p>
              </div>
            )}
          </div>
          
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
