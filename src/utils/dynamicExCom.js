/**
 * Utility to dynamically import Executive Committee member images and parse their details.
 */

// Import 2025/26 member images
const memberImages = import.meta.glob('../assets/ExCom/*.{png,jpg,jpeg,JPG,JPEG}', { eager: true, as: 'url' });

// Import past committee posters/posts
const postImages = import.meta.glob('../assets/ExCom/post/*.{png,jpg,jpeg,JPG,JPEG}', { eager: true, as: 'url' });

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
  const lower = p.toLowerCase();
  if (lower === 'chair') return 'Chairperson';
  if (lower === 'vice chair') return 'Vice Chairperson';
  return p;
};

export const getDynamicExComMembers = () => {
  const members = Object.keys(memberImages).map((path) => {
    // Extract filename and decode URI components (e.g., %20 -> space)
    const filename = decodeURIComponent(path.split('/').pop().replace(/\.[^/.]+$/, ""));
    
    // Split by _ or -
    let name = "";
    let position = "Committee Member";
    
    if (filename.includes('_')) {
      const parts = filename.split('_');
      name = parts[0];
      position = parts[1] || "Committee Member";
    } else if (filename.includes('-')) {
      const parts = filename.split('-');
      name = parts[0];
      position = parts[1] || "Committee Member";
    } else {
      name = filename;
    }
    
    const normalizedPos = normalizePosition(position);
    const trimmedName = name.trim();
    const capitalizedName = trimmedName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    return {
      name: capitalizedName,
      position: normalizedPos,
      image: memberImages[path],
      isTop: normalizedPos === 'Chairperson',
      hierarchy: POSITION_HIERARCHY[normalizedPos] || 99
    };
  });

  return members.sort((a, b) => a.hierarchy - b.hierarchy);
};

// Explicit mapping for posters to ensure they match their years correctly
const POSTER_MAPPING = {
  '2edeae87-f710-4667-868d-b9cd974d5638.jpg': '2025/2026',
  'a166456b-9bad-434e-a307-babf50103fdf.jpg': '2024/2025',
  '0ab69d1f-734f-4937-b4ad-c7ee95b37262.jpg': '2024/2025',
  '55b20c99-717e-48bf-b00a-3daa11c14ad4.jpg': '2023/2024',
  'd34ce940-48c0-40ab-888a-bb13454d2ff6.jpg': '2023/2024',
  '05a96743-5a7b-4c2e-9362-8d54910b1558.jpg': '2022/2023',
  'c412e663-1e57-4a48-9a35-95fdacefa736.jpg': '2022/2023',
  '12a5fb54-3e9c-40a3-8f55-2850e48e6707.jpg': '2021/2022',
  '7d08ef5a-5d5f-41a5-96f7-4f367e63fe86.jpg': '2021/2022',
  'f85d0746-6b9b-4b4e-82ef-0514ba4171b3.jpg': '2020/2021',
  'a757dadf-6377-4512-ab2f-95246c55e8e1.jpg': '2019/2020',
  '82713fa6-782d-4752-ad6b-2083b6e484f9.jpg': '2018/2019'
};

export const getPastCommittees = () => {
  const paths = Object.keys(postImages);
  
  return paths.map((path) => {
    const filename = path.split('/').pop();
    const year = POSTER_MAPPING[filename] || "Unknown Year";
    
    return {
      year,
      image: postImages[path],
      type: 'poster'
    };
  }).filter(p => p.year !== "Unknown Year").sort((a, b) => b.year.localeCompare(a.year));
};
