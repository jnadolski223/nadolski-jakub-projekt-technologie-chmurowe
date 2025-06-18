db = db.getSiblingDB('eventsdb');

db.events.insertMany([
  {
    eventId: '1a1a1a1a-aaaa-4aaa-aaaa-aaaaaaaaaaaa',
    userId: '7e1a0f53-8ae1-4b77-95b3-30920d878730',
    title: 'Warsztaty React',
    location: 'Warszawa',
    date: '2025-06-21',
    time: '10:00',
    description: 'Poznaj Reacta w praktyce!'
  },
  {
    eventId: '2b2b2b2b-bbbb-4bbb-bbbb-bbbbbbbbbbbb',
    userId: 'f6b74b0b-5e25-4703-ae3a-35671e43b1d2',
    title: 'Hackathon AI',
    location: 'Kraków',
    date: '2025-06-22',
    time: '12:00',
    description: 'Intensywny maraton kodowania z AI.'
  },
  {
    eventId: '3c3c3c3c-cccc-4ccc-cccc-cccccccccccc',
    userId: '0a4fa6c4-b7d1-4da5-bf57-172a0a58e601',
    title: 'Zlot frontendowców',
    location: 'Gdańsk',
    date: '2025-06-23',
    time: '15:30',
    description: 'Prelekcje, quizy i networking dla frontów.'
  },
  {
    eventId: '4d4d4d4d-dddd-4ddd-dddd-dddddddddddd',
    userId: 'c8072902-1e5c-4b0e-9985-97ee33ba4039',
    title: 'UX Meetup',
    location: 'Poznań',
    date: '2025-06-24',
    time: '18:00',
    description: 'Świeże spojrzenie na użyteczność interfejsów.'
  },
  {
    eventId: '5e5e5e5e-eeee-4eee-eeee-eeeeeeeeeeee',
    userId: '20a86123-0b41-4cd1-81ae-72a32e878a3c',
    title: 'Web3 i blockchain',
    location: 'Wrocław',
    date: '2025-06-25',
    time: '17:00',
    description: 'Czy zdecentralizowany internet to przyszłość?'
  },
  {
    eventId: '6f6f6f6f-ffff-4fff-ffff-ffffffffffff',
    userId: '5e92b3e4-6f83-4273-aea1-77b1a6b57a93',
    title: 'Deep Learning w Pythonie',
    location: 'Łódź',
    date: '2025-06-26',
    time: '11:00',
    description: 'Zbuduj własną sieć neuronową.'
  },
  {
    eventId: '7a7a7a7a-aaaa-4aaa-aaaa-aaaaaaaaaaab',
    userId: 'a679b021-316b-4a63-90b8-84834f7e8de3',
    title: 'Node.js w backendzie',
    location: 'Rzeszów',
    date: '2025-06-27',
    time: '14:30',
    description: 'Szybki serwer, czysty kod.'
  },
  {
    eventId: '8b8b8b8b-bbbb-4bbb-bbbb-bbbbbbbbbbba',
    userId: '3f3b06bb-e3f5-4427-9ef5-98e7e07c8024',
    title: 'Startup Pitch Night',
    location: 'Lublin',
    date: '2025-06-28',
    time: '19:00',
    description: 'Nowe pomysły, inwestorzy, networking.'
  },
  {
    eventId: '9c9c9c9c-cccc-4ccc-cccc-cccccccccccb',
    userId: 'd7a2c2cb-295c-4215-8b83-1ef59d7a3472',
    title: 'Bezpieczeństwo aplikacji',
    location: 'Szczecin',
    date: '2025-06-29',
    time: '16:00',
    description: 'Ochrona danych, testy penetracyjne.'
  },
  {
    eventId: 'aaaabbbb-cccc-dddd-eeee-ffff00000001',
    userId: 'b49f3d5f-1af6-4fb4-9890-3c65c16e8930',
    title: 'Retro Game Jam',
    location: 'Katowice',
    date: '2025-06-30',
    time: '09:00',
    description: 'Tworzymy gry w klimacie 8-bit!'
  },
  {
    eventId: 'aaaabbbb-cccc-dddd-eeee-ffff00000002',
    userId: '7e1a0f53-8ae1-4b77-95b3-30920d878730',
    title: 'Festiwal Technologii',
    location: 'Bydgoszcz',
    date: '2025-07-01',
    time: '10:00',
    description: 'Nowinki, prelekcje, pokazy sprzętu.'
  },
  {
    eventId: 'aaaabbbb-cccc-dddd-eeee-ffff00000003',
    userId: 'f6b74b0b-5e25-4703-ae3a-35671e43b1d2',
    title: 'Cloud & DevOps',
    location: 'Opole',
    date: '2025-07-02',
    time: '13:00',
    description: 'CI/CD, kontenery, skalowalność.'
  },
  {
    eventId: 'aaaabbbb-cccc-dddd-eeee-ffff00000004',
    userId: '0a4fa6c4-b7d1-4da5-bf57-172a0a58e601',
    title: 'Figma Sprint',
    location: 'Toruń',
    date: '2025-07-03',
    time: '11:30',
    description: 'Projektujemy interfejsy w 5 godzin.'
  },
  {
    eventId: 'aaaabbbb-cccc-dddd-eeee-ffff00000005',
    userId: 'c8072902-1e5c-4b0e-9985-97ee33ba4039',
    title: 'Cypress i testowanie UI',
    location: 'Kielce',
    date: '2025-07-04',
    time: '15:00',
    description: 'Automatyzacja i niezawodność.'
  },
  {
    eventId: 'aaaabbbb-cccc-dddd-eeee-ffff00000006',
    userId: '20a86123-0b41-4cd1-81ae-72a32e878a3c',
    title: 'Web Accessibility',
    location: 'Białystok',
    date: '2025-07-05',
    time: '17:30',
    description: 'Strony internetowe dla wszystkich.'
  }
]);