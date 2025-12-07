import { GoogleGenAI } from "@google/genai";
import { Place, GroundingChunk, Itinerary } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to parse the raw text into structured Place objects
// Since we can't use JSON schema with tools (Maps), we use a structured text prompt and regex parsing.
const parsePlacesFromText = (text: string, chunks?: GroundingChunk[]): Place[] => {
  const places: Place[] = [];
  const entries = text.split(/###\s*Place\s*\d+:/i).filter(e => e.trim().length > 0);

  entries.forEach((entry, index) => {
    const nameMatch = entry.match(/\*\*Name\*\*:\s*(.+)/);
    const descMatch = entry.match(/\*\*Description\*\*:\s*(.+)/);
    const categoryMatch = entry.match(/\*\*Category\*\*:\s*(.+)/);
    const reasonMatch = entry.match(/\*\*Hidden Gem Factor\*\*:\s*(.+)/);
    const tagsMatch = entry.match(/\*\*Tags\*\*:\s*(.+)/);

    const name = nameMatch ? nameMatch[1].trim() : `Hidden Spot ${index + 1}`;
    
    // Find matching map chunk if available
    const mapChunk = chunks?.find(c => 
      c.maps?.title && name.toLowerCase().includes(c.maps.title.toLowerCase())
    ) || chunks?.find(c => 
      c.maps?.title && c.maps.title.toLowerCase().includes(name.toLowerCase())
    );

    places.push({
      id: `place-${index}-${Date.now()}`,
      name: name,
      description: descMatch ? descMatch[1].trim() : "Discover this unique local experience.",
      category: categoryMatch ? categoryMatch[1].trim() : "Experience",
      reason: reasonMatch ? reasonMatch[1].trim() : "Highly recommended by locals.",
      mapLink: mapChunk?.maps?.uri,
      location: mapChunk?.maps?.title,
      tags: tagsMatch ? tagsMatch[1].split(',').map(t => t.trim()) : ['Local', 'Authentic'],
      // Use a deterministic placeholder based on index to keep visuals stable but varied
      imageUrl: `https://picsum.photos/800/600?random=${index + 10}`
    });
  });

  return places;
};

export const discoverHiddenGems = async (
  destination: string, 
  interests: string[],
  userLocation?: { lat: number, lng: number }
): Promise<{ places: Place[], chunks: GroundingChunk[] }> => {
  
  const interestString = interests.length > 0 ? interests.join(", ") : "culture and food";
  
  const prompt = `
    I am a traveler in ${destination} looking for authentic, off-the-beaten-path experiences related to: ${interestString}.
    Please find 5 specific "hidden gems" or local favorites that are NOT mainstream tourist traps.
    
    For each place, provide the details in the following strict format:

    ### Place [Number]:
    **Name**: [Exact Name of the Place]
    **Description**: [A vivid 2-sentence description of what to do there]
    **Category**: [One word category e.g., Cafe, Park, Shop, Museum]
    **Hidden Gem Factor**: [Why is this special/authentic?]
    **Tags**: [3 comma separated tags]
    
    Use Google Maps to verify these locations exist and are currently relevant.
  `;

  const config: any = {
    tools: [{ googleMaps: {} }],
  };

  if (userLocation) {
    config.toolConfig = {
      retrievalConfig: {
        latLng: {
          latitude: userLocation.lat,
          longitude: userLocation.lng
        }
      }
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: config
    });

    const text = response.text || "";
    // Access grounding chunks safely
    const chunks = (response.candidates?.[0]?.groundingMetadata as any)?.groundingChunks || [];

    const places = parsePlacesFromText(text, chunks);
    return { places, chunks };

  } catch (error) {
    console.error("Discovery error:", error);
    throw new Error("Failed to discover places. Please try again.");
  }
};

export const generateItinerary = async (destination: string, selectedPlaces: Place[]): Promise<Itinerary> => {
  const placeNames = selectedPlaces.map(p => p.name).join(", ");
  
  const prompt = `
    Create a perfect one-day itinerary in ${destination} that includes these stops: ${placeNames}.
    Optimize the route logically. Add lunch/dinner suggestions if missing.
    
    Return the response as a valid JSON object with this schema:
    {
      "title": "A thematic title for the day",
      "items": [
        {
          "time": "09:00 AM",
          "activity": "Short activity name",
          "description": "2 sentences on what to do here."
        }
      ]
    }
    Ensure the JSON is raw and clean, no markdown code blocks.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Using flash for speed on pure text gen
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const jsonStr = response.text.trim();
    // Handle potential markdown wrapping just in case
    const cleanJson = jsonStr.replace(/```json/g, '').replace(/```/g, '');
    return JSON.parse(cleanJson) as Itinerary;

  } catch (error) {
    console.error("Itinerary error:", error);
    // Fallback if JSON parsing fails
    return {
      title: "Your Custom Day",
      items: selectedPlaces.map((p, i) => ({
        time: `${9 + (i * 2)}:00`,
        activity: `Visit ${p.name}`,
        description: p.description
      }))
    };
  }
};
