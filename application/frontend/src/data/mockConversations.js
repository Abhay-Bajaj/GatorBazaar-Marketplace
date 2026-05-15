export const mockConversations = [
  {
    id: 1,
    read: false,
    itemId: 101,
    itemName: 'Dell 24" Monitor',
    itemImage: '/images/item-placeholder.png',
    sellerName: 'Alex Chen',
    price: '$85.00',
    lastMessage: 'Sounds good! See you tomorrow.',
    messages: [
      { id: 1, sender: 'buyer', text: 'Is this available?', timestamp: '10:30 AM' },
      { id: 2, sender: 'seller', text: 'Yes, it comes with the HDMI cable!', timestamp: '10:45 AM' },
      { id: 3, sender: 'buyer', text: 'What\'s the condition?', timestamp: '11:00 AM' },
      { id: 4, sender: 'seller', text: 'Good condition, barely used.', timestamp: '11:15 AM' },
      { id: 5, sender: 'buyer', text: 'Does it have any dead pixels?', timestamp: '11:30 AM' },
      { id: 6, sender: 'seller', text: 'No dead pixels, screen is perfect.', timestamp: '11:45 AM' },
      { id: 7, sender: 'buyer', text: 'What\'s the refresh rate?', timestamp: '12:00 PM' },
      { id: 8, sender: 'seller', text: '60Hz, perfect for office work.', timestamp: '12:15 PM' },
      { id: 9, sender: 'buyer', text: 'Can you do $80?', timestamp: '12:30 PM' },
      { id: 10, sender: 'seller', text: 'I can do $82, final price.', timestamp: '12:45 PM' },
      { id: 11, sender: 'buyer', text: 'Deal! When can we meet?', timestamp: '1:00 PM' },
      { id: 12, sender: 'seller', text: 'How about tomorrow at 2 PM?', timestamp: '1:15 PM' },
      { id: 13, sender: 'buyer', text: 'Perfect! Where should we meet?', timestamp: '1:30 PM' },
      { id: 14, sender: 'seller', text: 'Let\'s meet outside the Student Center.', timestamp: '1:45 PM' },
      { id: 15, sender: 'buyer', text: 'Sounds good! See you tomorrow.', timestamp: '2:00 PM' },
    ]
  },
  {
    id: 2,
    itemId: 106,
    read: false,
    itemName: 'Ergonomic Office Chair',
    itemImage: '/images/item-placeholder.png',
    sellerName: 'Sarah Johnson',
    price: '$95.00',
    lastMessage: 'Perfect, Where can we meet?',
    messages: [
      { id: 1, sender: 'buyer', text: 'Are you available to meet this weekend?', timestamp: '9:00 AM' },
      { id: 2, sender: 'seller', text: 'I can arrange pickup this weekend', timestamp: '9:30 AM' },
      { id: 3, sender: 'buyer', text: 'Perfect, Where can we meet?', timestamp: '9:45 AM' },
    ]
  },
  {
    id: 3,
    read: true,
    itemId: 103,
    itemName: 'Data Structures Textbook',
    itemImage: '/images/item-placeholder.png',
    sellerName: 'Mike Rodriguez',
    price: '$25.00',
    lastMessage: 'Yes, all notes are included',
    messages: [
      { id: 1, sender: 'buyer', text: 'Are the notes in the book?', timestamp: '2:15 PM' },
      { id: 2, sender: 'seller', text: 'Yes, all notes are included', timestamp: '2:30 PM' },
    ]
  },
  {
    id: 4,
    read: false,
    itemId: 110,
    itemName: 'Noise Cancelling Headphones',
    itemImage: '/images/item-placeholder.png',
    sellerName: 'Emma Wilson',
    price: '$140.00',
    lastMessage: 'Battery is in excellent condition',
    messages: [
      { id: 1, sender: 'buyer', text: 'How long is the battery life?', timestamp: '1:00 PM' },
      { id: 2, sender: 'seller', text: 'Battery is in excellent condition, lasts the full 30 hours', timestamp: '1:20 PM' },
    ]
  },
  {
    id: 5,
    read: false,
    itemId: 102,
    itemName: 'Mechanical Keyboard',
    itemImage: '/images/item-placeholder.png',
    sellerName: 'David Park',
    price: '$60.00',
    lastMessage: 'RGB is still working great',
    messages: [
      { id: 1, sender: 'buyer', text: 'Does RGB still work?', timestamp: '3:00 PM' },
      { id: 2, sender: 'seller', text: 'RGB is still working great', timestamp: '3:15 PM' },
    ]
  },
  {
    id: 6,
    read: true,
    itemId: 104,
    itemName: 'JavaScript: The Good Parts',
    itemImage: '/images/item-placeholder.png',
    sellerName: 'Lisa Chen',
    price: '$12.00',
    lastMessage: 'Book is in great condition, minimal marks',
    messages: [
      { id: 1, sender: 'buyer', text: 'Is there any highlighting?', timestamp: '4:00 PM' },
      { id: 2, sender: 'seller', text: 'Book is in great condition, minimal marks', timestamp: '4:30 PM' },
    ]
  },
  {
    id: 7,
    read: false,
    itemId: 105,
    itemName: 'Study Desk',
    itemImage: '/images/item-placeholder.png',
    sellerName: 'James Wilson',
    price: '$70.00',
    lastMessage: 'It\'s about 2 years old',
    messages: [
      { id: 1, sender: 'buyer', text: 'How old is the desk?', timestamp: '5:00 PM' },
      { id: 2, sender: 'seller', text: 'It\'s about 2 years old', timestamp: '5:30 PM' },
    ]
  },
  {
    id: 8,
    read: false,
    itemId: 107,
    itemName: 'iPad 9th Gen',
    itemImage: '/images/item-placeholder.png',
    sellerName: 'Rachel Green',
    price: '$220.00',
    lastMessage: 'Charger included with original cable',
    messages: [
      { id: 1, sender: 'buyer', text: 'Is the charger included?', timestamp: '2:30 PM' },
      { id: 2, sender: 'seller', text: 'Charger included with original cable', timestamp: '2:45 PM' },
    ]
  },
]
