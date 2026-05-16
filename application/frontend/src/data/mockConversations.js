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
      { id: 1, sender: 'buyer', text: 'Is this available?', timestamp: '2026-05-16 06:38:30' },
      { id: 2, sender: 'seller', text: 'Yes, it comes with the HDMI cable!', timestamp: '2026-05-16 06:41:12' },
      { id: 3, sender: 'buyer', text: 'What\'s the condition?', timestamp: '2026-05-16 06:45:08' },
      { id: 4, sender: 'seller', text: 'Good condition, barely used.', timestamp: '2026-05-16 06:49:27' },
      { id: 5, sender: 'buyer', text: 'Does it have any dead pixels?', timestamp: '2026-05-16 06:53:44' },
      { id: 6, sender: 'seller', text: 'No dead pixels, screen is perfect.', timestamp: '2026-05-16 06:58:19' },
      { id: 7, sender: 'buyer', text: 'What\'s the refresh rate?', timestamp: '2026-05-16 07:02:51' },
      { id: 8, sender: 'seller', text: '60Hz, perfect for office work.', timestamp: '2026-05-16 07:07:03' },
      { id: 9, sender: 'buyer', text: 'Can you do $80?', timestamp: '2026-05-16 07:11:29' },
      { id: 10, sender: 'seller', text: 'I can do $82, final price.', timestamp: '2026-05-16 07:16:42' },
      { id: 11, sender: 'buyer', text: 'Deal! When can we meet?', timestamp: '2026-05-16 07:20:15' },
      { id: 12, sender: 'seller', text: 'How about tomorrow at 2 PM?', timestamp: '2026-05-16 07:24:58' },
      { id: 13, sender: 'buyer', text: 'Perfect! Where should we meet?', timestamp: '2026-05-16 07:29:31' },
      { id: 14, sender: 'seller', text: 'Let\'s meet outside the Student Center.', timestamp: '2026-05-16 07:34:10' },
      { id: 15, sender: 'buyer', text: 'Sounds good! See you tomorrow.', timestamp: '2026-05-16 07:38:46' },
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
      { id: 1, sender: 'buyer', text: 'Are you available to meet this weekend?', timestamp: '2026-05-16 07:43:05' },
      { id: 2, sender: 'seller', text: 'I can arrange pickup this weekend', timestamp: '2026-05-16 07:47:50' },
      { id: 3, sender: 'buyer', text: 'Perfect, Where can we meet?', timestamp: '2026-05-16 07:52:14' },
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
      { id: 1, sender: 'buyer', text: 'Are the notes in the book?', timestamp: '2026-05-16 07:56:37' },
      { id: 2, sender: 'seller', text: 'Yes, all notes are included', timestamp: '2026-05-16 08:01:09' },
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
      { id: 1, sender: 'buyer', text: 'How long is the battery life?', timestamp: '2026-05-16 08:05:48' },
      { id: 2, sender: 'seller', text: 'Battery is in excellent condition, lasts the full 30 hours', timestamp: '2026-05-16 08:10:26' },
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
      { id: 1, sender: 'buyer', text: 'Does RGB still work?', timestamp: '2026-05-16 08:14:57' },
      { id: 2, sender: 'seller', text: 'RGB is still working great', timestamp: '2026-05-16 08:19:33' },
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
      { id: 1, sender: 'buyer', text: 'Is there any highlighting?', timestamp: '2026-05-16 08:24:11' },
      { id: 2, sender: 'seller', text: 'Book is in great condition, minimal marks', timestamp: '2026-05-16 08:28:45' },
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
      { id: 1, sender: 'buyer', text: 'How old is the desk?', timestamp: '2026-05-16 08:33:22' },
      { id: 2, sender: 'seller', text: 'It\'s about 2 years old', timestamp: '2026-05-16 08:37:58' },
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
      { id: 1, sender: 'buyer', text: 'Is the charger included?', timestamp: '2026-05-16 08:42:17' },
      { id: 2, sender: 'seller', text: 'Charger included with original cable', timestamp: '2026-05-16 08:46:59' },
    ]
  },
]