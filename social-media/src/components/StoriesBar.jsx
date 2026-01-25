import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
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
      // Group stories by user
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

      if (!response.ok) {
        throw new Error('Failed to create story');
      }

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
    
    // Mark as viewed
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
      
      // Mark as viewed
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
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1 min-w-[64px] animate-pulse">
            <div className="w-16 h-16 rounded-full bg-gray-200"></div>
            <div className="w-12 h-3 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Stories Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 relative shadow-sm">
        {/* Scroll Buttons */}
        {stories.length > 5 && (
          <>
            <button
              onClick={() => scroll('left')}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-1 hover:bg-gray-100"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-1 hover:bg-gray-100"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide"
        >
          {/* Create Story */}
          <div 
            className="flex flex-col items-center gap-1 min-w-[64px] cursor-pointer"
            onClick={() => setShowCreateModal(true)}
          >
            <div className="w-16 h-16 rounded-full border-2 border-white ring-2 ring-gray-200 relative overflow-hidden">
              <img 
                src={currentUser?.profilePic || `https://i.pravatar.cc/150?u=${currentUser?.id}`} 
                className="w-full h-full object-cover" 
                alt="Me" 
              />
              <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs border-2 border-white">
                <Plus size={14} />
              </div>
            </div>
            <span className="text-xs text-gray-500">Your story</span>
          </div>

          {/* User Stories */}
          {stories.map((userStories) => (
            <div 
              key={userStories.userId}
              className="flex flex-col items-center gap-1 min-w-[64px] cursor-pointer"
              onClick={() => handleViewStory(userStories)}
            >
              <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-pink-600">
                <img 
                  src={userStories.profilePic || `https://i.pravatar.cc/150?u=${userStories.userId}`} 
                  className="w-full h-full rounded-full border-2 border-white object-cover" 
                  alt={userStories.username}
                />
              </div>
              <span className="text-xs text-gray-700 truncate w-16 text-center">
                {userStories.username}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Create Story Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-lg">Create Story</h3>
              <button 
                onClick={() => {
                  setShowCreateModal(false);
                  setCreateForm({ content: '', image: null });
                  setPreview(null);
                }}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-4">
              {preview ? (
                <div className="relative mb-4">
                  <img src={preview} alt="Preview" className="w-full max-h-[300px] object-contain rounded-lg bg-gray-100" />
                  <button 
                    onClick={() => {
                      setCreateForm({ ...createForm, image: null });
                      setPreview(null);
                    }}
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 mb-4"
                >
                  <Plus size={40} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">Click to add an image</p>
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
                className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:border-blue-500 outline-none"
                rows={3}
              />
            </div>
            
            <div className="p-4 border-t">
              <button
                onClick={handleCreateStory}
                disabled={uploading || (!createForm.content && !createForm.image)}
                className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
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
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full z-10"
          >
            <X size={24} />
          </button>
          
          {/* Navigation */}
          {selectedStory.currentIndex > 0 && (
            <button 
              onClick={handlePrevStory}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/20 rounded-full"
            >
              <ChevronLeft size={32} />
            </button>
          )}
          {selectedStory.currentIndex < selectedStory.stories.length - 1 && (
            <button 
              onClick={handleNextStory}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/20 rounded-full"
            >
              <ChevronRight size={32} />
            </button>
          )}
          
          {/* Progress Bar */}
          <div className="absolute top-4 left-4 right-4 flex gap-1">
            {selectedStory.stories.map((_, i) => (
              <div 
                key={i}
                className={`h-1 flex-1 rounded-full ${
                  i <= selectedStory.currentIndex ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
          
          {/* User Info */}
          <div className="absolute top-10 left-4 flex items-center gap-3">
            <img 
              src={selectedStory.profilePic || `https://i.pravatar.cc/150?u=${selectedStory.userId}`}
              className="w-10 h-10 rounded-full border-2 border-white"
              alt={selectedStory.username}
            />
            <div>
              <p className="text-white font-medium">{selectedStory.username}</p>
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
                className="w-full max-h-[80vh] object-contain"
                alt="Story"
              />
            )}
            {selectedStory.stories[selectedStory.currentIndex].content && (
              <div className="absolute bottom-20 left-0 right-0 p-4">
                <p className="text-white text-center text-lg bg-black/40 p-4 rounded-lg">
                  {selectedStory.stories[selectedStory.currentIndex].content}
                </p>
              </div>
            )}
          </div>
          
          {/* Views count for own stories */}
          {selectedStory.userId === currentUser.id && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white">
              <Eye size={20} />
              <span>{selectedStory.stories[selectedStory.currentIndex].viewCount || 0} views</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default StoriesBar;
