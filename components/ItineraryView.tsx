import React from 'react';
import { Itinerary } from '../types';
import { Clock, MapPin, ArrowLeft, Download } from 'lucide-react';

interface ItineraryViewProps {
  itinerary: Itinerary;
  destination: string;
  onBack: () => void;
}

const ItineraryView: React.FC<ItineraryViewProps> = ({ itinerary, destination, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-500 hover:text-brand-600 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Discovery
        </button>
        <button className="flex items-center px-4 py-2 bg-brand-100 text-brand-700 rounded-lg hover:bg-brand-200 transition-colors text-sm font-semibold">
          <Download className="w-4 h-4 mr-2" />
          Save Itinerary
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-sand-200">
        <div className="bg-brand-900 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-800 rounded-full opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10">
             <h2 className="text-3xl font-serif font-bold mb-2">{itinerary.title}</h2>
             <p className="text-brand-200 flex items-center">
               <MapPin className="w-4 h-4 mr-1" />
               One Day in {destination}
             </p>
          </div>
        </div>

        <div className="p-8">
          <div className="relative border-l-2 border-brand-100 ml-3 space-y-12">
            {itinerary.items.map((item, index) => (
              <div key={index} className="relative pl-8">
                {/* Timeline dot */}
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-brand-500"></div>
                
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="min-w-[100px] flex items-center text-brand-600 font-bold bg-brand-50 px-3 py-1 rounded-full self-start">
                    <Clock className="w-4 h-4 mr-2" />
                    {item.time}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{item.activity}</h4>
                    <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-sand-50 rounded-xl border border-sand-200 text-center">
            <h5 className="font-serif font-bold text-gray-800 mb-2">Local Tip</h5>
            <p className="text-gray-600 italic">"Don't forget to check opening hours before you go, as smaller authentic spots often have irregular schedules."</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryView;
