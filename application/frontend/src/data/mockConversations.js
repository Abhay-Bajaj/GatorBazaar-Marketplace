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
      { id: 1, sender: 'buyer', body: 'Is this available?', created_at: '2026-05-16 06:38:30' },
      { id: 2, sender: 'seller', body: 'Yes, it comes with the HDMI cable!', created_at: '2026-05-16 06:41:12' },
      { id: 3, sender: 'buyer', body: 'What\'s the condition?', created_at: '2026-05-16 06:45:08' },
      { id: 4, sender: 'seller', body: 'Good condition, barely used.', created_at: '2026-05-16 06:49:27' },
      { id: 5, sender: 'buyer', body: 'Does it have any dead pixels?', created_at: '2026-05-16 06:53:44' },
      { id: 6, sender: 'seller', body: 'No dead pixels, screen is perfect.', created_at: '2026-05-16 06:58:19' },
      { id: 7, sender: 'buyer', body: 'What\'s the refresh rate?', created_at: '2026-05-16 07:02:51' },
      { id: 8, sender: 'seller', body: '60Hz, perfect for office work.', created_at: '2026-05-16 07:07:03' },
      { id: 9, sender: 'buyer', body: 'Can you do $80?', created_at: '2026-05-16 07:11:29' },
      { id: 10, sender: 'seller', body: 'I can do $82, final price.', created_at: '2026-05-16 07:16:42' },
      { id: 11, sender: 'buyer', body: 'Deal! When can we meet?', created_at: '2026-05-16 07:20:15' },
      { id: 12, sender: 'seller', body: 'How about tomorrow at 2 PM?', created_at: '2026-05-16 07:24:58' },
      { id: 13, sender: 'buyer', body: 'Perfect! Where should we meet?', created_at: '2026-05-16 07:29:31' },
      { id: 14, sender: 'seller', body: 'Let\'s meet outside the Student Center.', created_at: '2026-05-16 07:34:10' },
      { id: 15, sender: 'buyer', body: 'Sounds good! See you tomorrow.', created_at: '2026-05-16 07:38:46' },
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
      { id: 1, sender: 'buyer', body: 'Are you available to meet this weekend?', created_at: '2026-05-16 07:43:05' },
      { id: 2, sender: 'seller', body: 'I can arrange pickup this weekend', created_at: '2026-05-16 07:47:50' },
      { id: 3, sender: 'buyer', body: 'Perfect, Where can we meet?', created_at: '2026-05-16 07:52:14' },
    ]
  },
  {
    id: 3,
    read: true,
    itemId: 103,
    itemName: 'Data Structures bodybook',
    itemImage: '/images/item-placeholder.png',
    sellerName: 'Mike Rodriguez',
    price: '$25.00',
    lastMessage: 'Yes, all notes are included',
    messages: [
      { id: 1, sender: 'buyer', body: 'Are the notes in the book?', created_at: '2026-05-16 07:56:37' },
      { id: 2, sender: 'seller', body: 'Yes, all notes are included', created_at: '2026-05-16 08:01:09' },
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
      { id: 1, sender: 'buyer', body: 'How long is the battery life?', created_at: '2026-05-16 08:05:48' },
      { id: 2, sender: 'seller', body: 'Battery is in excellent condition, lasts the full 30 hours', created_at: '2026-05-16 08:10:26' },
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
      { id: 1, sender: 'buyer', body: 'Does RGB still work?', created_at: '2026-05-16 08:14:57' },
      { id: 2, sender: 'seller', body: 'RGB is still working great', created_at: '2026-05-16 08:19:33' },
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
      { id: 1, sender: 'buyer', body: 'Is there any highlighting?', created_at: '2026-05-16 08:24:11' },
      { id: 2, sender: 'seller', body: 'Book is in great condition, minimal marks', created_at: '2026-05-16 08:28:45' },
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
      { id: 1, sender: 'buyer', body: 'How old is the desk?', created_at: '2026-05-16 08:33:22' },
      { id: 2, sender: 'seller', body: 'It\'s about 2 years old', created_at: '2026-05-16 08:37:58' },
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
      { id: 1, sender: 'buyer', body: 'Is the charger included?', created_at: '2026-05-16 08:42:17' },
      { id: 2, sender: 'seller', body: 'Charger included with original cable', created_at: '2026-05-16 08:46:59' },
    ]
  },
]