import React from 'react';
import { Place } from '../types';
import { MapPin, Star, Tag, ExternalLink } from 'lucide-react';

interface ExperienceCardProps {
  place: Place;
  isSelected: boolean;
  onToggle: (place: Place) => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ place, isSelected, onToggle }) => {
  return (
    <div 
      className={`group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border-2 ${isSelected ? 'border-brand-500 ring-2 ring-brand-100' : 'border-transparent'}`}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={place.imageUrl} 
          alt={place.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
           <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggle(place);
            }}
            className={`p-2 rounded-full shadow-md transition-colors ${isSelected ? 'bg-brand-500 text-white' : 'bg-white/90 text-gray-500 hover:text-brand-600'}`}
           >
             <Star className={`w-5 h-5 ${isSelected ? 'fill-current' : ''}`} />
           </button>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-xs font-semibold text-brand-900 uppercase tracking-wider">
            {place.category}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-serif font-bold text-gray-900 leading-tight">
            {place.name}
          </h3>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {place.description}
        </p>

        <div className="bg-sand-100 p-3 rounded-lg mb-4">
          <p className="text-xs text-brand-900 font-medium flex items-start gap-1">
            <span className="text-lg leading-none">✨</span>
            <span className="italic">"{place.reason}"</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {place.tags.map(tag => (
            <span key={tag} className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
           {place.mapLink ? (
             <a 
              href={place.mapLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-brand-600 hover:text-brand-800 text-sm font-medium transition-colors"
            >
              <MapPin className="w-4 h-4 mr-1" />
              View on Map
            </a>
           ) : (
             <span className="text-gray-400 text-sm flex items-center cursor-not-allowed">
                <MapPin className="w-4 h-4 mr-1" />
                Map unavailable
             </span>
           )}
           
           {place.mapLink && (
              <a href={place.mapLink} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-brand-600">
                <ExternalLink className="w-4 h-4" />
              </a>
           )}
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
