
export const CANNED_RESPONSES = [
  "Have you tried turning the chimney off and on again?",
  "This sounds like a Layer 8 problem (PEBCAK).",
  "I've checked the logs, it's definitely a DNS issue. It's always DNS.",
  "Please clear your cookie cache (and bring me some real cookies).",
  "It works on my sleigh.",
  "That's not a bug, it's a feature of the North Pole ecosystem.",
  "I'm escalating this to the Ghost of Christmas Future Support.",
  "Did you try power-cycling the reindeer?",
  "Please provide a traceroute from the Grotto to your location.",
  "The server is currently under heavy load (1,000,000 elves/sec)."
];

export interface LocalTicket {
  id: string;
  sender: string;
  subject: string;
  body: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  keywords: string[];
  successMessage: string;
}

export const TICKET_POOL: LocalTicket[] = [
  {
    id: '1',
    sender: 'Rudolph@rednose.mail',
    subject: 'Nose Glow flickering after firmware update',
    body: "Hey Santa, ever since the v12.2 'Fog-Cutter' update, my nose keeps flickering in Morse code. It's spelling 'HELP'. Is this a driver issue?",
    difficulty: 'Easy',
    keywords: ['firmware', 'driver', 'update', 'reboot', 'off and on'],
    successMessage: "Rudolph's nose is steady now. He's back on the flight line!"
  },
  {
    id: '2',
    sender: 'Grinch@mt-crumpit.org',
    subject: 'URGENT: Heart size exceeds buffer capacity',
    body: "I tried to scale my Christmas spirit but I'm getting a '3x_Overflow_Error'. My chest feels tight. Is this a hardware limitation?",
    difficulty: 'Medium',
    keywords: ['overflow', 'buffer', 'memory', 'leak', 'patch', 'hardware'],
    successMessage: "The Grinch's heart is now efficiently allocated. No more memory leaks!"
  },
  {
    id: '3',
    sender: 'Bernard_The_Elf@workshop.it',
    subject: 'Naughty-Nice List Database is DOWN',
    body: "Boss, the SQL database for the Big List is returning 500 errors. I think Mrs. Claus tried to 'DROP TABLE Naughty'. Please assist immediately.",
    difficulty: 'Hard',
    keywords: ['sql', 'database', 'drop', 'table', 'restore', 'backup', 'query'],
    successMessage: "Database restored from the 'Midnight Snack' backup. The list is safe."
  },
  {
    id: '4',
    sender: 'Frosty@snow-solutions.net',
    subject: 'Internal temperature rising (Fan failure?)',
    body: "I'm seeing a massive spike in my core temperature metrics. My 'Carrot.exe' is lagging. Do I need a thermal paste application or just a reboot?",
    difficulty: 'Medium',
    keywords: ['thermal', 'paste', 'fan', 'cooling', 'temp', 'reboot'],
    successMessage: "Frosty is chilled out. Core temps stabilized at 0°C."
  },
  {
    id: '5',
    sender: 'Dasher@fast-mail.np',
    subject: 'Sleigh navigation API returning 404',
    body: "I'm trying to fetch the coordinates for London, but the API says 'Chimney Not Found'. Is the endpoint down?",
    difficulty: 'Easy',
    keywords: ['api', '404', 'endpoint', 'dns', 'not found', 'url'],
    successMessage: "API routes updated. Dasher is currently hovering over Big Ben."
  },
  {
    id: '6',
    sender: 'Sugarplum_Fairy@ballet.os',
    subject: 'Permission Denied on dance_routine.sh',
    body: "I'm trying to execute my new routine but I keep getting 'sudo: command not found'. I need root access to the Nutcracker suite.",
    difficulty: 'Hard',
    keywords: ['sudo', 'root', 'permission', 'chmod', 'execute', 'access'],
    successMessage: "Permissions granted. The routine is performing with 99.9% uptime."
  },
  {
    id: '7',
    sender: 'Jack_Frost@nipping.io',
    subject: 'Windows keep freezing (Literally)',
    body: "I know my name is Jack Frost, but my OS windows are literally frozen. I can't move the cursor. Is this a kernel panic?",
    difficulty: 'Medium',
    keywords: ['frozen', 'windows', 'os', 'kernel', 'task manager', 'restart'],
    successMessage: "System thawed. Jack Frost is back to nipping at noses (electronically)."
  }
];
