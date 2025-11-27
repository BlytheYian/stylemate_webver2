import { User, ClothingItem } from './types';

export const AVATAR_OPTIONS = [
    'https://picsum.photos/seed/me/100/100',
    'https://picsum.photos/seed/avatar2/100/100',
    'https://picsum.photos/seed/avatar3/100/100',
    'https://picsum.photos/seed/avatar4/100/100',
];

export const INITIAL_DECK: ClothingItem[] = [
    {
        id: 'deck-1',
        userId: 'user-demo-1',
        userName: 'Jessica',
        userAvatar: 'https://i.pravatar.cc/150?u=jessica',
        imageUrls: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'],
        category: 'Dress',
        color: 'Yellow',
        style_tags: ['Summer', 'Floral', 'Casual'],
        estimatedPrice: 800,
    },
    {
        id: 'deck-2',
        userId: 'user-demo-2',
        userName: 'David',
        userAvatar: 'https://i.pravatar.cc/150?u=david',
        imageUrls: ['https://images.unsplash.com/photo-1551028919-ac66c9f80691?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'],
        category: 'Jacket',
        color: 'Brown',
        style_tags: ['Leather', 'Vintage', 'Biker'],
        estimatedPrice: 2500,
    },
    {
        id: 'deck-3',
        userId: 'user-demo-3',
        userName: 'Sarah',
        userAvatar: 'https://i.pravatar.cc/150?u=sarah',
        imageUrls: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'],
        category: 'Sneakers',
        color: 'Red',
        style_tags: ['Sport', 'Streetwear', 'Comfort'],
        estimatedPrice: 3200,
    },
    {
        id: 'deck-4',
        userId: 'user-demo-4',
        userName: 'Mike',
        userAvatar: 'https://i.pravatar.cc/150?u=mike',
        imageUrls: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'],
        category: 'T-Shirt',
        color: 'Black',
        style_tags: ['Basic', 'Minimalist', 'Cotton'],
        estimatedPrice: 400,
    },
    {
        id: 'deck-5',
        userId: 'user-demo-5',
        userName: 'Emily',
        userAvatar: 'https://i.pravatar.cc/150?u=emily',
        imageUrls: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'],
        category: 'Blouse',
        color: 'White',
        style_tags: ['Work', 'Chic', 'Elegant'],
        estimatedPrice: 1200,
    }
];
