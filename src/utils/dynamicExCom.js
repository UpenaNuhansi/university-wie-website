/**
 * Utility to dynamically import Executive Committee member images and parse their details.
 * 
 * Filename format expected: "Name _ Position.extension" or "Name - Position.extension"
 */

// Import all images from the ExCom assets folder as URLs
const imageModules = import.meta.glob('../assets/ExCom/*.{png,jpg,jpeg,JPG,JPEG}', { eager: true, as: 'url' });

const POSITION_HIERARCHY = {
  'Chairperson': 1,
  'Chair': 1,
  'Vice Chairperson': 2,
  'Vice Chair': 2,
  'Secretary': 3,
  'Vice Secretary': 4,
  'Treasurer': 5,
  'Public Relations Manager': 6,
  'Event Coordinator': 7,
  'Volunteer Coordinator': 8,
  'Committee Member': 9
};

const normalizePosition = (pos) => {
  const p = pos.trim();
  if (p.toLowerCase() === 'chair') return 'Chairperson';
  if (p.toLowerCase() === 'vice chair') return 'Vice Chairperson';
  return p;
};

export const getDynamicExComMembers = () => {
  const members = Object.keys(imageModules).map((path) => {
    // Extract filename without extension
    const filename = path.split('/').pop().replace(/\.[^/.]+$/, "");
    
    // Split by _ or -
    let name = "";
    let position = "Committee Member";
    
    if (filename.includes('_')) {
      [name, position] = filename.split('_');
    } else if (filename.includes('-')) {
      [name, position] = filename.split('-');
    } else {
      name = filename;
    }
    
    const normalizedPos = normalizePosition(position || 'Committee Member');
    
    return {
      name: name.trim(),
      position: normalizedPos,
      image: imageModules[path],
      isTop: normalizedPos === 'Chairperson',
      hierarchy: POSITION_HIERARCHY[normalizedPos] || 99
    };
  });

  // Sort by hierarchy
  return members.sort((a, b) => a.hierarchy - b.hierarchy);
};
