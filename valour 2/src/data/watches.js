// The Lucent collection. Images are generated into /public/media by scripts/prepare-assets.mjs.
export const WATCHES = [
  { slug: 'astral-blue', name: 'Astral Blue', accent: '#7aa5f5', glow: 'rgba(86, 136, 245, 0.42)', note: 'Twilight blue over a sunburst dial.' },
  { slug: 'aurora-mint', name: 'Aurora Mint', accent: '#93e6c9', glow: 'rgba(110, 224, 186, 0.36)', note: 'Cool mint, clear as sea glass.' },
  { slug: 'eclipse-black', name: 'Eclipse Black', accent: '#aab0bc', glow: 'rgba(150, 162, 186, 0.26)', note: 'Ink black, lit only by its lume.' },
  { slug: 'frost-silver', name: 'Frost Silver', accent: '#e3e7ee', glow: 'rgba(220, 228, 240, 0.28)', note: 'Bright silver, like winter light.' },
  { slug: 'nova-red', name: 'Nova Red', accent: '#ea2e42', glow: 'rgba(225, 34, 56, 0.40)', note: 'Our signature red, at full volume.' },
  { slug: 'sunseeker-yellow', name: 'Sunseeker Yellow', accent: '#f6bb12', glow: 'rgba(246, 180, 18, 0.38)', note: 'Warm as late-afternoon sun.' },
];

// Configurator layers (renders in /public/media/config, stacked strap → case → dial).
export const CASES = [
  { id: 'silver', name: 'Silver', swatch: 'linear-gradient(135deg, #f4f6f9 0%, #a3a8b0 55%, #dfe2e7 100%)' },
  { id: 'black', name: 'Black', swatch: 'linear-gradient(135deg, #5a5c62 0%, #141416 55%, #393a3f 100%)' },
  { id: 'gold', name: 'Gold', swatch: 'linear-gradient(135deg, #f5dfa0 0%, #a97f35 55%, #e6c675 100%)' },
];

export const DIALS = [
  { id: 'red', name: 'Red', swatch: '#d3202f', glow: 'rgba(225, 34, 56, 0.40)' },
  { id: 'light-blue', name: 'Light Blue', swatch: '#8fb0d2', glow: 'rgba(120, 165, 225, 0.38)' },
  { id: 'navy-blue', name: 'Navy Blue', swatch: '#23409a', glow: 'rgba(52, 86, 210, 0.42)' },
  { id: 'teal', name: 'Teal', swatch: '#14857c', glow: 'rgba(24, 160, 150, 0.38)' },
  { id: 'mint', name: 'Mint', swatch: '#8fc4a4', glow: 'rgba(110, 224, 186, 0.34)' },
  { id: 'yellow', name: 'Yellow', swatch: '#f0b315', glow: 'rgba(246, 180, 18, 0.38)' },
  { id: 'orange', name: 'Orange', swatch: '#f0612a', glow: 'rgba(240, 96, 40, 0.38)' },
  { id: 'purple', name: 'Purple', swatch: '#7b4fd0', glow: 'rgba(130, 84, 220, 0.40)' },
  { id: 'silver', name: 'Silver', swatch: '#c9ccd1', glow: 'rgba(220, 228, 240, 0.28)' },
  { id: 'black', name: 'Black', swatch: '#1c1c1f', glow: 'rgba(150, 162, 186, 0.24)' },
];

// Straps: a coloured strap with a grey or black rubber trim (ids match the render file names).
const GREY = { trim: 'Grey', base: '#7e8187' };
const BLACK = { trim: 'Black', base: '#0b0b0c' };
export const STRAPS = [
  { id: 'grey-red', name: 'Red', swatch: '#d3202f', ...GREY },
  { id: 'grey-light-blue', name: 'Light Blue', swatch: '#8fb3d0', ...GREY },
  { id: 'grey-blue', name: 'Blue', swatch: '#1f63c9', ...GREY },
  { id: 'grey-teal', name: 'Teal', swatch: '#14857c', ...GREY },
  { id: 'grey-yellow', name: 'Yellow', swatch: '#f0b315', ...GREY },
  { id: 'grey-orange', name: 'Orange', swatch: '#f0612a', ...GREY },
  { id: 'grey-purple', name: 'Purple', swatch: '#7b4fd0', ...GREY },
  { id: 'grey-silver', name: 'Silver', swatch: '#d4d6da', ...GREY },
  { id: 'grey-grey', name: 'Grey', swatch: '#5d6066', ...GREY },
  { id: 'grey-black', name: 'Black', swatch: '#1c1c1f', ...GREY },
  { id: 'black-black', name: 'Black', swatch: '#1c1c1f', ...BLACK },
  { id: 'black-grey', name: 'Grey', swatch: '#5d6066', ...BLACK },
  { id: 'black-silver', name: 'Silver', swatch: '#d4d6da', ...BLACK },
];

// Catalog prices used on the current site.
export const PRICE = '$525';
export const STRAP_PRICE = '$45';
