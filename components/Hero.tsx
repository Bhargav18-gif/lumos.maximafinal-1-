import React, { useState } from 'react';
import { Search, Compass, Map, Coffee, Music, Camera } from 'lucide-react';

interface HeroProps {
  onSearch: (dest: string, interests: string[]) => void;
  isLoading: boolean;
}

const INTERESTS = [
  { id: 'food', label: 'Culinary', icon: Coffee },
  { id: 'art', label: 'Art & Design', icon: Camera },
  { id: 'nature', label: 'Nature', icon: Compass },
  { id: 'history', label: 'History', icon: Map },
  { id: 'music', label: 'Nightlife', icon: Music },
];

const Hero: React.FC<HeroProps> = ({ onSearch, isLoading }) => {
  const [destination, setDestination] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination.trim()) {
      onSearch(destination, selectedInterests);
    }
  };

  return (
    <div className="relative min-h-[600px] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/1920/1080?grayscale" 
          alt="Travel background" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/0 via-brand-50/50 to-sand-50"></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        <div className="mb-8 animate-fade-in-up">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-widest text-brand-600 uppercase bg-brand-100 rounded-full">
            Discover the Undiscovered
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 mb-6 leading-tight">
            Find the <span className="text-brand-600 italic">soul</span> of<br/> your destination.
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            AI-powered local discovery that takes you beyond the tourist traps. 
            Curated hidden gems, authentic eats, and real stories.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-2xl mx-auto transform transition-all hover:scale-[1.01]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Where do you want to go? (e.g., Kyoto, Mexico City)"
                className="w-full pl-12 pr-4 py-4 text-lg border-b-2 border-gray-100 focus:border-brand-500 focus:outline-none bg-transparent transition-colors text-gray-800 placeholder-gray-400"
              />
            </div>

            <div>
              <p className="text-left text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                What's your vibe?
              </p>
              <div className="flex flex-wrap gap-3">
                {INTERESTS.map((interest) => {
                  const Icon = interest.icon;
                  const isSelected = selectedInterests.includes(interest.id);
                  return (
                    <button
                      key={interest.id}
                      type="button"
                      onClick={() => toggleInterest(interest.id)}
                      className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                        isSelected 
                          ? 'bg-brand-500 text-white border-brand-500 shadow-md' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300 hover:text-brand-600'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {interest.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !destination.trim()}
              className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all transform ${
                isLoading || !destination.trim()
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-brand-600 hover:bg-brand-700 hover:shadow-lg active:scale-95'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Uncovering Hidden Gems...
                </div>
              ) : (
                'Start Exploring'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Hero;