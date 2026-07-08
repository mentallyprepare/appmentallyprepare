const prompts = [
  '"What\'s one thing you wish someone would just ask you about?"',
  '"What did you hide today because it felt too small to explain?"',
  '"When do you become distant, even when you want closeness?"',
  '"What are you tired of carrying alone?"',
  '"Where do you make yourself smaller to stay accepted?"',
  '"What truth would you write if nobody judged it?"',
  '"What moment made you feel seen, even a little?"',
  '"What does emotional effort look like to you?"',
  '"What kind of connection are you ready for now?"',
  '"What\'s the last thing that genuinely moved you?"',
  '"If you could say one honest thing to someone you\'ve lost touch with, what would it be?"',
  '"What are you pretending isn\'t affecting you?"',
  '"When was the last time you let someone see the real version of you?"',
  '"What part of yourself do you think people misread?"',
  '"What would it look like if you stopped performing?"',
  '"What scares you about being known?"',
  '"If your loneliness had a shape, what would it look like?"',
  '"What\'s one boundary you need but can\'t set?"',
  '"What is the thing you most want someone to understand about you?"',
  '"Write a letter to the person you\'ll meet on Day 21."',
  '"Would you like to know who has been writing to you?"'
];

const SAFETY_KEYWORDS = [
  'suicide','kill myself','end my life','want to die','self harm','self-harm',
  'cutting myself','overdose','no reason to live','can\'t go on',
  'hurt myself','ending it all','take my life','not worth living'
];

const CONTENT_FLAGS = [
  'instagram','snapchat','whatsapp','phone number','@gmail','@yahoo',
  'my number is','call me at','dm me','follow me'
];

const HELPLINES = {
  iCall: '9152987821',
  vandrevala: '1860-2662-345',
  nimhans: '080-46110007'
};

const EMOTIONAL_THEMES = {
  isolation: {
    keywords: ['alone','lonely','isolated','nobody','no one','invisible','ignored','forgotten','empty','hollow','left out'],
    prompts: [
      '"What does your loneliness feel like when it\'s at its loudest?"',
      '"If loneliness were a room, what would yours look like?"',
      '"Who was the last person who made you feel less alone — and what exactly did they do?"'
    ]
  },
  family: {
    keywords: ['mom','dad','mother','father','parents','family','sibling','brother','sister','home','childhood'],
    prompts: [
      '"What\'s one conversation with your family you keep replaying?"',
      '"What did your parents teach you about emotions — without saying a word?"',
      '"If you could rewrite one rule from how you grew up, what would it be?"'
    ]
  },
  self_worth: {
    keywords: ['not good enough','worthless','failure','imposter','fake','pretend','doubt myself','not enough','inadequate','deserve'],
    prompts: [
      '"Where did you first learn that you weren\'t enough?"',
      '"What would change if you believed you deserved the good things?"',
      '"Write about a moment you were genuinely proud of yourself — even if you never told anyone."'
    ]
  },
  fear: {
    keywords: ['scared','afraid','fear','anxious','panic','worry','terrified','nervous','dread','overwhelm'],
    prompts: [
      '"What\'s the fear behind the fear — the deeper one you don\'t usually name?"',
      '"If your anxiety could speak honestly, what would it say it\'s trying to protect you from?"',
      '"What would you do tomorrow if fear wasn\'t a factor?"'
    ]
  },
  hope: {
    keywords: ['hope','better','dream','someday','future','wish','imagine','possible','light','grateful','thankful'],
    prompts: [
      '"What small thing is quietly giving you hope right now?"',
      '"Write about the version of yourself you\'re slowly becoming."',
      '"What\'s one thing you\'re learning to trust again?"'
    ]
  },
  anger: {
    keywords: ['angry','frustrated','rage','unfair','hate','furious','tired of','sick of','fed up','resentment'],
    prompts: [
      '"What are you angry about that you haven\'t let yourself fully feel yet?"',
      '"What boundary would your anger set if you actually listened to it?"',
      '"Behind your frustration — what do you actually need?"'
    ]
  },
  grief: {
    keywords: ['miss','lost','gone','grief','mourning','death','passed away','used to be','remember when','nostalgia'],
    prompts: [
      '"What are you grieving that nobody around you sees?"',
      '"Write about something you lost that changed who you are."',
      '"If you could have one more conversation with someone you\'ve lost, what would you say?"'
    ]
  },
  connection: {
    keywords: ['friend','close','trust','open up','vulnerable','bond','deep','Understand','listen','seen','heard'],
    prompts: [
      '"What makes someone safe enough to be real with?"',
      '"Describe a moment where you felt truly heard — what made it different?"',
      '"What\'s the kindest thing someone could do for you right now without you having to ask?"'
    ]
  },
  pressure: {
    keywords: ['pressure','expectations','perfect','grades','career','perform','compete','comparison','achievement','success','burnout'],
    prompts: [
      '"Whose voice is loudest when you feel like you\'re not doing enough?"',
      '"What would rest actually look like if you gave yourself permission?"',
      '"What if being ordinary was allowed — what would you do differently?"'
    ]
  }
};

const complementary = {
  protector: 'connector', connector: 'protector',
  performer: 'disconnector', disconnector: 'performer'
};

const PRODUCTS = {
  'archetype-pdf': { amount: 99900, name: 'Connection Profile PDF', currency: 'INR' },
  'second-cycle': { amount: 49900, name: 'Second 21-Day Cycle', currency: 'INR' }
};

const STRIPE_PRODUCTS = {
  'archetype-pdf': { amount: 1200, name: 'Connection Profile PDF', currency: 'usd' },
  'second-cycle': { amount: 600, name: 'Second 21-Day Cycle', currency: 'usd' }
};

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;

module.exports = {
  prompts, SAFETY_KEYWORDS, CONTENT_FLAGS, HELPLINES,
  EMOTIONAL_THEMES, complementary, PRODUCTS, STRIPE_PRODUCTS, PORT
};
