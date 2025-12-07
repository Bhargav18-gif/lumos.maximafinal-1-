import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import ExperienceCard from './components/ExperienceCard';
import ItineraryView from './components/ItineraryView';
import { discoverHiddenGems, generateItinerary } from './services/geminiService';
import { Place, ViewMode, Itinerary, GroundingChunk } from './types';
import { Map, List, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.HOME);
  const [destination, setDestination] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | undefined>(undefined);

  useEffect(() => {
    // Optional: Get user location for better grounding relevance if they search for "nearby"
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          console.log("Location access denied or unavailable");
        }
      );
    }
  }, []);

  const handleSearch = async (dest: string, interests: string[]) => {
    setIsLoading(true);
    setDestination(dest);
    try {
      const { places: newPlaces, chunks } = await discoverHiddenGems(dest, interests, userLocation);
      setPlaces(newPlaces);
      setGroundingChunks(chunks);
      setViewMode(ViewMode.RESULTS);
      setSelectedPlaces([]); // Reset selections on new search
    } catch (error) {
      alert("Failed to find places. Please ensure you have set a valid API KEY in the code environment.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlaceSelection = (place: Place) => {
    if (selectedPlaces.find(p => p.id === place.id)) {
      setSelectedPlaces(prev => prev.filter(p => p.id !== place.id));
    } else {
      if (selectedPlaces.length >= 5) {
        alert("You can only select up to 5 places for a day trip!");
        return;
      }
      setSelectedPlaces(prev => [...prev, place]);
    }
  };

  const handleCreateItinerary = async () => {
    if (selectedPlaces.length === 0) return;
    setIsLoading(true);
    try {
      const result = await generateItinerary(destination, selectedPlaces);
      setItinerary(result);
      setViewMode(ViewMode.ITINERARY);
    } catch (e) {
      alert("Could not generate itinerary.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800">
      
      {/* Header - Simple and Sticky */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setViewMode(ViewMode.HOME)}
          >
            <div className="bg-brand-600 text-white p-1.5 rounded-lg">
              <Map className="w-5 h-5" />
            </div>
            <span className="font-serif font-bold text-xl text-brand-900 tracking-tight">LocalLore</span>
          </div>
          
          {viewMode === ViewMode.RESULTS && (
             <div className="text-sm font-medium text-gray-500">
                Found {places.length} hidden gems in <span className="text-brand-700">{destination}</span>
             </div>
          )}
        </div>
      </header>

      <main className="flex-grow">
        {viewMode === ViewMode.HOME && (
          <Hero onSearch={handleSearch} isLoading={isLoading} />
        )}

        {viewMode === ViewMode.RESULTS && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Curated Experiences</h2>
                <p className="text-gray-600">Select the places you like to build your custom itinerary.</p>
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                 <div className="flex-1 md:flex-none text-right text-sm text-gray-500">
                    {selectedPlaces.length} selected
                 </div>
                 <button
                  onClick={handleCreateItinerary}
                  disabled={selectedPlaces.length === 0 || isLoading}
                  className={`flex items-center justify-center px-6 py-3 rounded-lg font-bold shadow-lg transition-all ${
                    selectedPlaces.length > 0 
                    ? 'bg-brand-600 text-white hover:bg-brand-700 transform hover:-translate-y-1' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                 >
                   {isLoading ? (
                     <span className="flex items-center"><Sparkles className="animate-spin w-4 h-4 mr-2"/> Magic happening...</span>
                   ) : (
                     <span className="flex items-center"><List className="w-4 h-4 mr-2"/> Build Itinerary</span>
                   )}
                 </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map((place) => (
                <ExperienceCard 
                  key={place.id} 
                  place={place} 
                  isSelected={!!selectedPlaces.find(p => p.id === place.id)}
                  onToggle={togglePlaceSelection}
                />
              ))}
            </div>

            {groundingChunks.length > 0 && (
              <div className="mt-16 border-t border-gray-200 pt-8">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Verified by Google Maps</h3>
                <div className="flex flex-wrap gap-3">
                   {groundingChunks.filter(c => c.maps?.uri).map((chunk, i) => (
                     <a 
                      key={i}
                      href={chunk.maps?.uri}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-brand-600 bg-brand-50 hover:bg-brand-100 px-3 py-1 rounded-full border border-brand-200 transition-colors"
                     >
                       {chunk.maps?.title || "Location source"}
                     </a>
                   ))}
                </div>
              </div>
            )}
          </div>
        )}

        {viewMode === ViewMode.ITINERARY && itinerary && (
          <ItineraryView 
            itinerary={itinerary} 
            destination={destination}
            onBack={() => setViewMode(ViewMode.RESULTS)}
          />
        )}
      </main>

      <footer className="bg-sand-900 text-sand-100 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="font-serif font-bold text-2xl text-white mb-2">LocalLore</h3>
            <p className="text-sand-400 text-sm max-w-xs">
              Connecting travelers with the untold stories and hidden corners of the world.
            </p>
          </div>
          <div className="text-right">
             <p className="text-sand-500 text-xs">&copy; 2024 LocalLore AI. All rights reserved.</p>
             <p className="text-sand-600 text-[10px] mt-1">Powered by Gemini 2.5 Flash & Google Maps</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
