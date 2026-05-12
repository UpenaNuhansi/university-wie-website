export const formatDate = (value) => {
  if (!value) return 'N/A';
  
  try {
    // Handle Firestore Timestamp objects (which have a toDate() method)
    if (value && typeof value === 'object' && value.toDate) {
      return value.toDate().toLocaleDateString();
    }
    
    // Handle ISO strings and other date formats
    return new Date(value).toLocaleDateString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'N/A';
  }
};

export const formatDateTime = (value) => {
  if (!value) return 'N/A';
  
  try {
    // Handle Firestore Timestamp objects (which have a toDate() method)
    let date;
    if (value && typeof value === 'object' && value.toDate) {
      date = value.toDate();
    } else {
      date = new Date(value);
    }
    
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Error formatting date-time:', error);
    return 'N/A';
  }
};
