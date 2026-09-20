// No external pixels are loaded. A future consent-aware adapter can consume these events.
export function track(event,properties={}){const data={event,...properties};window.dataLayer=window.dataLayer||[];window.dataLayer.push(data);window.dispatchEvent(new CustomEvent('presell:analytics',{detail:data}));}
