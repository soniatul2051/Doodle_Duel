import {
  SpecificWordCategory,
  WordCategory,
  WordDifficulty,
  WordEntry,
} from '@/types/game';

export const SPECIFIC_CATEGORIES: SpecificWordCategory[] = [
  'Animals',
  'Food and Drinks',
  'Objects',
  'Movies and Characters',
  'Places',
  'Sports',
  'Nature',
  'Actions',
  'Professions',
  'Technology',
];

export const ALL_CATEGORIES: WordCategory[] = [
  'Random/Mixed',
  ...SPECIFIC_CATEGORIES,
];

export const WORD_BANK: WordEntry[] = [
  // ================= ANIMALS =================
  {
    id: 'animals-easy-1',
    word: 'Elephant',
    category: 'Animals',
    difficulty: 'easy',
    hint: 'Largest land mammal with a long trunk and big ears',
    drawingDescription: 'A large round body with four thick legs, floppy ears, curved tusks, and a long curving trunk.',
    drawingSteps: [
      'Draw a big oval body and four thick pillar legs.',
      'Add a round head with two giant fan-shaped ears.',
      'Extend a long S-shaped trunk from the front and add two curved tusks.',
    ],
  },
  {
    id: 'animals-easy-2',
    word: 'Giraffe',
    category: 'Animals',
    difficulty: 'easy',
    hint: 'Tallest safari animal with a very long neck and spots',
    drawingDescription: 'A spotted four-legged animal with an extremely tall neck and two little horn-like ossicones on top.',
    drawingSteps: [
      'Draw a medium oval body with four long skinny legs.',
      'Extend a very tall diagonal neck up to a small head with two little topped horns.',
      'Add patchy spots along the neck and body plus a tufted tail.',
    ],
  },
  {
    id: 'animals-easy-3',
    word: 'Octopus',
    category: 'Animals',
    difficulty: 'easy',
    hint: 'Eight-armed sea creature',
    drawingDescription: 'A bulbous dome head with two expressive eyes and eight wavy tentacles with suction cups.',
    drawingSteps: [
      'Draw a large rounded bulb for the head with two big eyes.',
      'Add eight wavy, curling arms radiating out from the bottom.',
      'Dot small circles along the underside of the tentacles for suction cups.',
    ],
  },
  {
    id: 'animals-easy-4',
    word: 'Butterfly',
    category: 'Animals',
    difficulty: 'easy',
    hint: 'Colorful winged insect that starts as a caterpillar',
    drawingDescription: 'A thin center body with two curled antennae and four symmetrical patterned wings.',
    drawingSteps: [
      'Draw a thin vertical oval body with a round head and two spiral antennae.',
      'Attach two large upper wings and two rounded lower wings symmetrically.',
      'Decorate the wings with circles and swirls.',
    ],
  },
  {
    id: 'animals-medium-1',
    word: 'Kangaroo',
    category: 'Animals',
    difficulty: 'medium',
    hint: 'Hopping Australian marsupial with a belly pouch',
    drawingDescription: 'An upright animal with huge hind feet, a long muscular tail, a joey peeking from a front pouch, and tall ears.',
    drawingSteps: [
      'Sketch an upright pear-shaped torso with a long thick tail resting on the ground.',
      'Add oversized L-shaped hind feet and short bent front paws.',
      'Draw a pouch on the belly with a tiny baby head peeking out.',
    ],
  },
  {
    id: 'animals-medium-2',
    word: 'Chameleon',
    category: 'Animals',
    difficulty: 'medium',
    hint: 'Color-changing lizard with a spiral tail and long tongue',
    drawingDescription: 'A crested lizard perched on a branch with a tightly curled spiral tail and a long zapping tongue catching a fly.',
    drawingSteps: [
      'Draw an arched lizard body gripping a horizontal tree branch.',
      'Curl the tail into a tight spiral like a cinnamon roll.',
      'Add a cone-shaped head, turret eye, and a long tongue shooting out toward a tiny bug.',
    ],
  },
  {
    id: 'animals-medium-3',
    word: 'Porcupine',
    category: 'Animals',
    difficulty: 'medium',
    hint: 'Rodent covered in sharp defensive quills',
    drawingDescription: 'A low, rounded woodland creature with a cute snout and dozens of sharp spikes radiating off its back.',
    drawingSteps: [
      'Draw a low dome-shaped body with four short paws and a small pointed nose.',
      'Cover the entire back and tail with dozens of sharp straight lines pointing backward.',
      'Add small eyes, whiskers, and warning motion lines around the quills.',
    ],
  },
  {
    id: 'animals-hard-1',
    word: 'Platypus',
    category: 'Animals',
    difficulty: 'hard',
    hint: 'Egg-laying mammal with a duck bill and beaver tail',
    drawingDescription: 'A sleek swimming creature combining a wide duck bill, webbed feet, and a flat cross-hatched beaver tail.',
    drawingSteps: [
      'Draw a low streamlined furry body with short webbed feet.',
      'Attach a wide flat duck bill at the front of the head.',
      'Add a wide, flat paddle-shaped beaver tail with criss-cross lines at the back.',
    ],
  },
  {
    id: 'animals-hard-2',
    word: 'Narwhal',
    category: 'Animals',
    difficulty: 'hard',
    hint: 'Arctic whale known as the unicorn of the sea',
    drawingDescription: 'A spotted whale swimming under icebergs with a single long spiral tusk projecting from its forehead.',
    drawingSteps: [
      'Draw a plump whale body tapering to a horizontal two-fluked tail.',
      'Add a long, straight spiral horn sticking out from the front of the head.',
      'Include ocean waves above to show it is a marine mammal.',
    ],
  },

  // ================= FOOD AND DRINKS =================
  {
    id: 'food-easy-1',
    word: 'Pizza',
    category: 'Food and Drinks',
    difficulty: 'easy',
    hint: 'Italian flatbread topped with melted cheese and pepperoni',
    drawingDescription: 'A triangular slice of pizza with a puffy crust, dripping melted cheese, and round pepperoni slices.',
    drawingSteps: [
      'Draw a large triangle with a curved, puffy outer crust.',
      'Add wavy lines along the edges for gooey melted cheese.',
      'Draw several circles inside the triangle for pepperoni toppings.',
    ],
  },
  {
    id: 'food-easy-2',
    word: 'Ice Cream Cone',
    category: 'Food and Drinks',
    difficulty: 'easy',
    hint: 'Frozen dessert scooped onto a crispy waffle cone',
    drawingDescription: 'A V-shaped waffle cone with criss-cross lines topped with two round scoops and a cherry on top.',
    drawingSteps: [
      'Draw a tall upside-down triangle with diagonal grid lines for the waffle cone.',
      'Stack one or two fluffy cloud-edged circles on top for scoops.',
      'Finish with a small round cherry and curved stem at the very peak.',
    ],
  },
  {
    id: 'food-easy-3',
    word: 'Cupcake',
    category: 'Food and Drinks',
    difficulty: 'easy',
    hint: 'Single-serving frosted cake in a pleated paper liner',
    drawingDescription: 'A fluted paper cup topped with a tall swirl of frosting, sprinkles, and a cherry.',
    drawingSteps: [
      'Draw a trapezoid base with vertical pleats for the baking cup.',
      'Pile three stacked wavy layers of swirled icing on top.',
      'Add tiny confetti dashes for sprinkles.',
    ],
  },
  {
    id: 'food-medium-1',
    word: 'Spaghetti',
    category: 'Food and Drinks',
    difficulty: 'medium',
    hint: 'Long tangled pasta noodles with meatballs and a twirling fork',
    drawingDescription: 'A wide plate piled with squiggly noodles, round meatballs, and a fork lifting a twirled strand.',
    drawingSteps: [
      'Draw an oval dinner plate at the bottom.',
      'Fill the center with a mound of looping squiggly lines and three dark circles for meatballs.',
      'Draw a fork above the plate with noodles wrapped around its tines.',
    ],
  },
  {
    id: 'food-medium-2',
    word: 'Bubble Tea',
    category: 'Food and Drinks',
    difficulty: 'medium',
    hint: 'Iced milk tea drink with chewy tapioca pearls and a wide straw',
    drawingDescription: 'A tall sealed cup with dark round boba pearls at the bottom and a thick angled straw poking through the lid.',
    drawingSteps: [
      'Draw a tall cup with a domed or flat sealed top.',
      'Insert an extra-wide straw down to the bottom of the cup.',
      'Fill the bottom layer of the drink with dark solid circles for tapioca pearls.',
    ],
  },
  {
    id: 'food-medium-3',
    word: 'Sushi Roll',
    category: 'Food and Drinks',
    difficulty: 'medium',
    hint: 'Japanese seaweed roll with rice, fish, and chopsticks',
    drawingDescription: 'Cylindrical maki rolls showing rice and filling inside, held by a pair of wooden chopsticks.',
    drawingSteps: [
      'Draw two short cylinders standing upright with concentric circles on top.',
      'Add two long narrow chopsticks pinching one of the rolls.',
      'Include a tiny dish of soy sauce on the side.',
    ],
  },
  {
    id: 'food-hard-1',
    word: 'Eggs Benedict',
    category: 'Food and Drinks',
    difficulty: 'hard',
    hint: 'Brunch dish with English muffin, poached egg, and hollandaise sauce',
    drawingDescription: 'Two halves of a toasted muffin stacked with ham, a round poached egg oozing yolk, and draped in thick sauce.',
    drawingSteps: [
      'Draw two flat circular muffin halves on a plate.',
      'Stack a slice of ham and a domed poached egg on each half.',
      'Draw thick wavy sauce dripping over the top and a fork cutting into a runny yolk.',
    ],
  },
  {
    id: 'food-hard-2',
    word: 'Charcuterie Board',
    category: 'Food and Drinks',
    difficulty: 'hard',
    hint: 'Wooden platter arranged with cured meats, cheeses, crackers, and grapes',
    drawingDescription: 'A wooden paddle board crowded with wedge cheeses, folded meat slices, grape clusters, and crackers.',
    drawingSteps: [
      'Draw a large rectangular wooden cutting board with a handle.',
      'Add a triangular wedge of Swiss cheese with holes and a bunch of round grapes.',
      'Arrange overlapping circles of salami and square crackers around the board.',
    ],
  },

  // ================= OBJECTS =================
  {
    id: 'objects-easy-1',
    word: 'Umbrella',
    category: 'Objects',
    difficulty: 'easy',
    hint: 'Handheld canopy that keeps you dry in the rain',
    drawingDescription: 'A ribbed dome canopy on a straight shaft ending in a curved J-shaped handle with raindrops falling.',
    drawingSteps: [
      'Draw a wide semi-circle dome with scalloped bottom edges.',
      'Extend a vertical rod down from the center ending in a J-hook handle.',
      'Add slanted raindrop lines bouncing off the top canopy.',
    ],
  },
  {
    id: 'objects-easy-2',
    word: 'Scissors',
    category: 'Objects',
    difficulty: 'easy',
    hint: 'Two-bladed cutting tool with finger loops',
    drawingDescription: 'Two crossed metal blades joined at a center pivot screw with two round finger handles.',
    drawingSteps: [
      'Draw an X shape using two long pointed blades.',
      'Place a small screw dot where the blades cross.',
      'Attach two oval finger loops at the bottom ends.',
    ],
  },
  {
    id: 'objects-easy-3',
    word: 'Backpack',
    category: 'Objects',
    difficulty: 'easy',
    hint: 'Bag worn on the shoulders for school or hiking',
    drawingDescription: 'A rounded bag with a front zippered pocket, top loop handle, and two curved shoulder straps.',
    drawingSteps: [
      'Draw a rounded vertical rectangle with a smaller curved pocket on the front.',
      'Add zipper teeth and a small top hanging loop.',
      'Draw two curved shoulder straps on the sides.',
    ],
  },
  {
    id: 'objects-medium-1',
    word: 'Hourglass',
    category: 'Objects',
    difficulty: 'medium',
    hint: 'Ancient timer that measures time with falling sand',
    drawingDescription: 'Two connected glass bulbs in a wooden frame with sand trickling from the top bulb to a mound at the bottom.',
    drawingSteps: [
      'Draw two horizontal bars for the top and bottom frame with vertical posts.',
      'Draw a figure-8 pinched glass shape between the bars.',
      'Show sand draining in a thin stream from the top chamber into a pile below.',
    ],
  },
  {
    id: 'objects-medium-2',
    word: 'Chandelier',
    category: 'Objects',
    difficulty: 'medium',
    hint: 'Ornate hanging ceiling light with many branches and crystals',
    drawingDescription: 'A grand tiered fixture hanging by a chain from the ceiling with curved arms, candle bulbs, and dangling crystals.',
    drawingSteps: [
      'Draw a ceiling plate and a short vertical chain at the top.',
      'Branch out symmetrical S-curved arms holding upright candle bulbs.',
      'Drape dotted swags and teardrop crystal pendants underneath.',
    ],
  },
  {
    id: 'objects-medium-3',
    word: 'Telescope',
    category: 'Objects',
    difficulty: 'medium',
    hint: 'Optical tube on a tripod used for stargazing',
    drawingDescription: 'An angled segmented tube mounted on a three-legged tripod pointing toward a crescent moon and stars.',
    drawingSteps: [
      'Draw a long tapered cylinder tilted upward toward the sky.',
      'Attach three tripod legs extending from the middle of the tube to the ground.',
      'Draw stars and a ringed planet near the wide lens end.',
    ],
  },
  {
    id: 'objects-hard-1',
    word: 'Sewing Machine',
    category: 'Objects',
    difficulty: 'hard',
    hint: 'Mechanical device that stitches fabric together with needle and thread',
    drawingDescription: 'An overhanging C-shaped machine with a spool of thread on top, a sharp needle pressing down, and fabric feeding through.',
    drawingSteps: [
      'Draw a flat base and an overhanging arm forming a C-shape facing left.',
      'Add a vertical needle at the tip of the overhang and a thread spool pin on top.',
      'Draw a wavy piece of fabric with a dashed stitch line underneath the needle.',
    ],
  },
  {
    id: 'objects-hard-2',
    word: 'Kaleidoscope',
    category: 'Objects',
    difficulty: 'hard',
    hint: 'Rotating optical tube showing symmetrical geometric patterns',
    drawingDescription: 'A handheld cylinder held to an eye, projecting a burst of symmetrical triangles, stars, and diamonds.',
    drawingSteps: [
      'Draw a cylinder tube with an eye looking into the narrow end.',
      'At the wide end, draw a large circle divided like a pie into 6 or 8 wedges.',
      'Fill each wedge with identical geometric stars and triangles.',
    ],
  },

  // ================= MOVIES AND CHARACTERS =================
  {
    id: 'movies-easy-1',
    word: 'Superhero',
    category: 'Movies and Characters',
    difficulty: 'easy',
    hint: 'Caped crime-fighter flying through the sky',
    drawingDescription: 'A muscular figure with a domino mask, chest emblem, and flowing cape soaring with one fist raised.',
    drawingSteps: [
      'Draw a person tilted diagonally in mid-air with one arm stretched forward.',
      'Add a big flowing cape billowing from the shoulders.',
      'Draw an eye mask and a diamond or shield emblem on the chest.',
    ],
  },
  {
    id: 'movies-easy-2',
    word: 'Pirate Captain',
    category: 'Movies and Characters',
    difficulty: 'easy',
    hint: 'Swashbuckler with an eye patch, hook hand, and parrot',
    drawingDescription: 'A grinning sailor wearing a tricorn hat and eye patch, with a hook for a hand, peg leg, and shoulder parrot.',
    drawingSteps: [
      'Draw a character wearing a wide three-cornered pirate hat and an eye patch.',
      'Replace one hand with a curved metal hook and one leg with a wooden peg.',
      'Perch a small bird on the shoulder.',
    ],
  },
  {
    id: 'movies-medium-1',
    word: 'Wizard',
    category: 'Movies and Characters',
    difficulty: 'medium',
    hint: 'Magic spellcaster with a pointed hat, long beard, and glowing staff',
    drawingDescription: 'An robed figure with a tall starry cone hat, long flowing beard, and wooden staff shooting magical sparks.',
    drawingSteps: [
      'Draw a tall pointed cone hat with a wide brim and star decorations.',
      'Add a long wavy beard reaching down over a flowing robe.',
      'Draw a crooked wooden staff or wand with sparkling star bursts at the tip.',
    ],
  },
  {
    id: 'movies-medium-2',
    word: 'Detective',
    category: 'Movies and Characters',
    difficulty: 'medium',
    hint: 'Mystery solver in a trench coat examining clues with a magnifying glass',
    drawingDescription: 'A sleuth wearing a deerstalker hat and trench coat peering through a large magnifying glass at footprints.',
    drawingSteps: [
      'Draw a figure in a collared coat and brimmed cap leaning forward.',
      'Place a large round magnifying glass in their hand, enlarging their eye.',
      'Add a trail of shoe footprints on the ground in front of them.',
    ],
  },
  {
    id: 'movies-hard-1',
    word: 'Time Traveler',
    category: 'Movies and Characters',
    difficulty: 'hard',
    hint: 'Adventurer stepping through a swirling clock portal between eras',
    drawingDescription: 'A character surrounded by floating clocks and lightning bolts stepping out of a swirling vortex portal.',
    drawingSteps: [
      'Draw a large swirling spiral portal with lightning sparks around the rim.',
      'Sketch a person stepping out of the spiral holding a pocket watch.',
      'Draw floating clock faces with spinning hands and calendar pages flying around.',
    ],
  },
  {
    id: 'movies-hard-2',
    word: 'Silent Film Actor',
    category: 'Movies and Characters',
    difficulty: 'hard',
    hint: 'Vintage black-and-white cinema performer with bowler hat, cane, and title cards',
    drawingDescription: 'A slapstick performer in a bowler hat twirling a bamboo cane next to an ornate dialogue title screen.',
    drawingSteps: [
      'Draw a character wearing a round bowler hat, baggy trousers, and twirling a cane.',
      'Frame them inside an old-fashioned film strip border with sprocket holes.',
      'Add a vintage ornate speech frame next to a film camera on a hand-crank tripod.',
    ],
  },

  // ================= PLACES =================
  {
    id: 'places-easy-1',
    word: 'Lighthouse',
    category: 'Places',
    difficulty: 'easy',
    hint: 'Tall coastal tower with a bright beacon guiding ships at night',
    drawingDescription: 'A striped tower standing on a rocky cliff by crashing ocean waves, shining two bright beams of light.',
    drawingSteps: [
      'Draw a tall slightly tapered tower with horizontal stripes on a rocky cliff.',
      'Add a glass lantern room at the top with two wide triangles of light shining out.',
      'Draw ocean waves and a small sailboat in the water below.',
    ],
  },
  {
    id: 'places-easy-2',
    word: 'Castle',
    category: 'Places',
    difficulty: 'easy',
    hint: 'Medieval stone fortress with towers, flags, and a drawbridge',
    drawingDescription: 'A grand stone fortress with crenellated battlements, tall corner turrets topped with flags, and an arched gate.',
    drawingSteps: [
      'Draw a central wall flanked by two taller side towers.',
      'Top the walls with square notched battlements and triangular turret roofs with pennants.',
      'Add a large arched wooden drawbridge gate over a water moat.',
    ],
  },
  {
    id: 'places-medium-1',
    word: 'Treehouse',
    category: 'Places',
    difficulty: 'medium',
    hint: 'Cozy wooden clubhouse built high in the branches of a tree',
    drawingDescription: 'A small wooden cabin nestled inside a leafy oak tree with a rope ladder hanging down.',
    drawingSteps: [
      'Draw a thick tree trunk branching out into a wide leafy canopy.',
      'Nestle a small house with a pitched roof and window right between the branches.',
      'Hang a runged rope ladder or tire swing down from the platform.',
    ],
  },
  {
    id: 'places-medium-2',
    word: 'Roller Coaster',
    category: 'Places',
    difficulty: 'medium',
    hint: 'Amusement park ride with steep drops and giant upside-down loops',
    drawingDescription: 'A lattice-supported track rising up a steep hill and curling through a vertical loop with a train of cheering riders.',
    drawingSteps: [
      'Draw a wavy line that rises high, drops steeply, and forms a big vertical circular loop.',
      'Add vertical scaffolding support lines underneath the track.',
      'Draw linked open carts on the track with stick figures raising their arms.',
    ],
  },
  {
    id: 'places-hard-1',
    word: 'Observatory',
    category: 'Places',
    difficulty: 'hard',
    hint: 'Domed hilltop building housing a giant astronomical telescope',
    drawingDescription: 'A round building on a mountain peak with an open slit in its hemisphere dome and a giant telescope peering at stars.',
    drawingSteps: [
      'Draw a hemisphere dome building sitting on top of a curved hill.',
      'Draw an open vertical slot in the dome with a large telescope barrel poking out.',
      'Fill the sky above with constellations, stars, and a ringed planet.',
    ],
  },
  {
    id: 'places-hard-2',
    word: 'Drive-In Theater',
    category: 'Places',
    difficulty: 'hard',
    hint: 'Outdoor cinema where people watch a giant screen from parked cars',
    drawingDescription: 'Rows of parked cars facing a towering outdoor movie screen under a starry night sky.',
    drawingSteps: [
      'Draw a massive elevated rectangular screen at the top showing a movie scene.',
      'Sketch the backs of several parked cars in rows facing the screen.',
      'Add stars in the night sky and speaker posts beside the cars.',
    ],
  },

  // ================= SPORTS =================
  {
    id: 'sports-easy-1',
    word: 'Basketball',
    category: 'Sports',
    difficulty: 'easy',
    hint: 'Court game played with a ribbed orange ball and an elevated hoop with a net',
    drawingDescription: 'A backboard and hoop with a woven net as a ribbed ball swishes through.',
    drawingSteps: [
      'Draw a rectangular backboard with a horizontal rim ring attached.',
      'Hang a criss-cross mesh net below the rim.',
      'Draw a round ball with curved seams dropping into the hoop.',
    ],
  },
  {
    id: 'sports-easy-2',
    word: 'Bowling',
    category: 'Sports',
    difficulty: 'easy',
    hint: 'Rolling a heavy three-holed ball down a lane to knock over ten pins',
    drawingDescription: 'A heavy ball with three finger holes rolling down a wooden lane crashing into flying bottle-shaped pins.',
    drawingSteps: [
      'Draw two converging perspective lines for the bowling lane.',
      'Draw a large circle with three small finger holes in the foreground.',
      'At the far end, draw several bottle-shaped pins tipping and flying outward.',
    ],
  },
  {
    id: 'sports-medium-1',
    word: 'Archery',
    category: 'Sports',
    difficulty: 'medium',
    hint: 'Shooting feathered arrows with a bow at a bullseye target',
    drawingDescription: 'A curved bow with a taut string launching a feathered arrow straight into the center of a concentric circular target.',
    drawingSteps: [
      'Draw a D-shaped bow on the left and a circular bullseye target on a stand on the right.',
      'Draw an arrow with a pointed tip and feathered tail piercing the center ring.',
      'Add motion streaks behind the arrow.',
    ],
  },
  {
    id: 'sports-medium-2',
    word: 'Surfing',
    category: 'Sports',
    difficulty: 'medium',
    hint: 'Riding a board across the crest of a curling ocean wave',
    drawingDescription: 'An athlete balancing with outstretched arms on a pointed surfboard inside a giant curling ocean wave.',
    drawingSteps: [
      'Draw a large curling wave with foamy splashes at the crest.',
      'Place an elongated oval surfboard riding diagonally down the wave face.',
      'Draw a figure with bent knees and arms stretched out for balance.',
    ],
  },
  {
    id: 'sports-hard-1',
    word: 'Pole Vault',
    category: 'Sports',
    difficulty: 'hard',
    hint: 'Track and field event using a long flexible pole to leap over a high bar',
    drawingDescription: 'An athlete catapulting upside down over a very tall horizontal crossbar using a deeply bent flexible pole.',
    drawingSteps: [
      'Draw two tall upright posts supporting a high horizontal crossbar and a landing mat below.',
      'Draw a long curved pole planted in the ground bending like a bow.',
      'Sketch an athlete arching high over the crossbar.',
    ],
  },
  {
    id: 'sports-hard-2',
    word: 'Synchronized Swimming',
    category: 'Sports',
    difficulty: 'hard',
    hint: 'Water routine where swimmers perform matching choreography together',
    drawingDescription: 'Three swimmers in a pool performing identical leg lifts above the water surface to musical notes.',
    drawingSteps: [
      'Draw a horizontal wavy water line across the middle.',
      'Have three identical bent legs pointing gracefully out of the water in unison.',
      'Add splash droplets and floating musical notes above the water.',
    ],
  },

  // ================= NATURE =================
  {
    id: 'nature-easy-1',
    word: 'Volcano',
    category: 'Nature',
    difficulty: 'easy',
    hint: 'Mountain with a crater that erupts hot lava and ash clouds',
    drawingDescription: 'A cone-shaped mountain with a flat crater top spewing glowing lava streams, rocks, and a giant plume of smoke.',
    drawingSteps: [
      'Draw a mountain with sloped sides and a dipped crater opening at the peak.',
      'Add wavy streams of lava flowing down the slopes.',
      'Draw a huge billowing cloud of smoke and flying sparks rising from the top.',
    ],
  },
  {
    id: 'nature-easy-2',
    word: 'Rainbow',
    category: 'Nature',
    difficulty: 'easy',
    hint: 'Colorful arch in the sky appearing after rain and sunshine',
    drawingDescription: 'A wide multi-banded arch stretching between two fluffy clouds with a smiling sun peeking out.',
    drawingSteps: [
      'Draw two fluffy clouds on the left and right.',
      'Connect them with 5 or 6 concentric curved arches.',
      'Add a bright sun with rays peeking from behind one cloud.',
    ],
  },
  {
    id: 'nature-medium-1',
    word: 'Waterfall',
    category: 'Nature',
    difficulty: 'medium',
    hint: 'River plunging over a steep rocky cliff into a misty pool below',
    drawingDescription: 'A river at the top of a rocky ledge cascading down in vertical rushing streams with foamy mist at the base.',
    drawingSteps: [
      'Draw two stepped rocky cliffs on either side.',
      'Fill the center drop with long vertical curved lines for falling water.',
      'Add bubbling clouds of foam and spray where the water hits the pool below.',
    ],
  },
  {
    id: 'nature-medium-2',
    word: 'Tornado',
    category: 'Nature',
    difficulty: 'medium',
    hint: 'Spinning funnel cloud touching down from a thunderstorm',
    drawingDescription: 'A tall twisting cone of wind swirling down from dark storm clouds with debris spinning around it.',
    drawingSteps: [
      'Draw a wide funnel shape tapering down to a narrow point on the ground.',
      'Fill the funnel with tight horizontal spiral lines to show fast rotation.',
      'Add dark storm clouds above and tiny leaves or debris swirling around the sides.',
    ],
  },
  {
    id: 'nature-hard-1',
    word: 'Venus Flytrap',
    category: 'Nature',
    difficulty: 'hard',
    hint: 'Carnivorous plant with hinged toothed leaves that snap shut on insects',
    drawingDescription: 'A potted plant with wide jaw-like leaves lined with spikes snapping after a buzzing fly.',
    drawingSteps: [
      'Draw a flower pot with curving stems rising up.',
      'At the end of each stem, draw two hinged clamshell lobes with spiky teeth along the edges.',
      'Draw a tiny fly with a dotted flight path buzzing near an open trap.',
    ],
  },
  {
    id: 'nature-hard-2',
    word: 'Aurora Borealis',
    category: 'Nature',
    difficulty: 'hard',
    hint: 'Northern Lights glowing in wavy curtains across the polar night sky',
    drawingDescription: 'Shimmering ribbon-like curtains of light waving across a starry sky above snowy pine trees and an igloo.',
    drawingSteps: [
      'Draw snowy mountain peaks and pine trees along the bottom horizon.',
      'Across the starry night sky, draw wide S-curved ribbons with vertical shading lines.',
      'Add twinkling stars and a compass arrow pointing North (N).',
    ],
  },

  // ================= ACTIONS =================
  {
    id: 'actions-easy-1',
    word: 'Jump Rope',
    category: 'Actions',
    difficulty: 'easy',
    hint: 'Hopping over a swinging cord held in both hands',
    drawingDescription: 'A person mid-jump in the air while swinging a curved rope handle-to-handle over their head.',
    drawingSteps: [
      'Draw a stick figure or character with bent knees floating above the ground.',
      'Place a handle in each hand and connect them with a high arch going over the head.',
      'Add motion lines under the feet to show jumping.',
    ],
  },
  {
    id: 'actions-easy-2',
    word: 'Fishing',
    category: 'Actions',
    difficulty: 'easy',
    hint: 'Sitting by water with a rod and hook waiting for a fish to bite',
    drawingDescription: 'A person on a dock holding a bent fishing rod with a line and bobber hooked onto a jumping fish.',
    drawingSteps: [
      'Draw a person on a boat or dock holding a long curved pole.',
      'Drop a vertical line from the tip of the pole into wavy water.',
      'Draw a J-hook underwater with a fish swimming up to bite it.',
    ],
  },
  {
    id: 'actions-medium-1',
    word: 'Juggling',
    category: 'Actions',
    difficulty: 'medium',
    hint: 'Tossing and catching multiple balls or pins in a continuous circle',
    drawingDescription: 'A performer with upturned hands tossing five balls in a high dotted arc in the air.',
    drawingSteps: [
      'Draw a person from the waist up with both hands open and palms facing up.',
      'Draw five circles or bowling pins arranged in a rainbow arc above their hands.',
      'Connect the balls with dashed curved arrows showing the circular motion.',
    ],
  },
  {
    id: 'actions-medium-2',
    word: 'Tightrope Walking',
    category: 'Actions',
    difficulty: 'medium',
    hint: 'Balancing carefully across a high wire holding a long pole',
    drawingDescription: 'An acrobat stepping carefully along a thin wire stretched between two towers while holding a long balancing pole.',
    drawingSteps: [
      'Draw a straight horizontal wire stretched high between two tall platforms.',
      'Draw a figure standing on one foot directly on the wire.',
      'Place a very long horizontal balancing pole across both of their hands.',
    ],
  },
  {
    id: 'actions-hard-1',
    word: 'Sleepwalking',
    category: 'Actions',
    difficulty: 'hard',
    hint: 'Strolling out of bed with eyes closed and arms stretched forward',
    drawingDescription: 'A person in pajamas walking with closed eyes, outstretched zombie-like arms, and floating Zzz sleep bubbles.',
    drawingSteps: [
      'Draw a bed on one side with tossed-back covers.',
      'Draw a person walking away with eyes shut and both arms held straight out in front.',
      'Add a trail of "Zzz" sleep symbols floating above their head.',
    ],
  },
  {
    id: 'actions-hard-2',
    word: 'Parallel Parking',
    category: 'Actions',
    difficulty: 'hard',
    hint: 'Maneuvering a car backward into a tight curb space between two parked cars',
    drawingDescription: 'Top-down view of a car angling backward with curved arrows into a tight gap between two parked cars along a curb.',
    drawingSteps: [
      'Draw a vertical sidewalk line with two rectangular cars parked along it, leaving a gap in the middle.',
      'Draw a third car angled diagonally beside the gap.',
      'Add S-shaped dashed arrows pointing from the angled car into the empty space.',
    ],
  },

  // ================= PROFESSIONS =================
  {
    id: 'professions-easy-1',
    word: 'Chef',
    category: 'Professions',
    difficulty: 'easy',
    hint: 'Kitchen cook wearing a tall white toque hat and holding a frying pan',
    drawingDescription: 'A smiling cook wearing a tall puffy chef hat and apron, flipping a pancake in a skillet.',
    drawingSteps: [
      'Draw a tall cylinder hat with a fluffy cloud-like top.',
      'Sketch a person in a double-breasted apron holding a long-handled pan.',
      'Draw a round pancake flipping in mid-air above the skillet.',
    ],
  },
  {
    id: 'professions-easy-2',
    word: 'Firefighter',
    category: 'Professions',
    difficulty: 'easy',
    hint: 'First responder with a helmet and hose spraying water on flames',
    drawingDescription: 'A rescuer in a protective helmet aiming a heavy hose spraying a stream of water onto flickering flames.',
    drawingSteps: [
      'Draw a person wearing a ridged safety helmet and coat.',
      'Place a thick hose in their hands with a fan of water lines spraying out.',
      'Draw jagged flames on the other side being put out by the water.',
    ],
  },
  {
    id: 'professions-medium-1',
    word: 'Astronaut',
    category: 'Professions',
    difficulty: 'medium',
    hint: 'Space explorer in a bubble helmet floating in zero gravity',
    drawingDescription: 'A suited explorer with a round visor helmet and life-support pack floating beside a rocket and planet.',
    drawingSteps: [
      'Draw a large round fishbowl helmet over a puffy suit with ribbed arms and boots.',
      'Attach a rectangular backpack with a tether cord floating in a wave.',
      'Add a crescent moon, stars, and a ringed planet in the background.',
    ],
  },
  {
    id: 'professions-medium-2',
    word: 'Beekeeper',
    category: 'Professions',
    difficulty: 'medium',
    hint: 'Honey caretaker wearing a veiled hat next to wooden beehives',
    drawingDescription: 'A person in a wide-brimmed mesh veil hat holding a honeycomb frame while bees buzz around a stacked hive.',
    drawingSteps: [
      'Draw a wide hat with a mesh net hanging around the face and a puffy suit.',
      'Add a stacked box beehive or hanging hive nearby.',
      'Draw several small striped bees with wings and dotted flight loops.',
    ],
  },
  {
    id: 'professions-hard-1',
    word: 'Archaeologist',
    category: 'Professions',
    difficulty: 'hard',
    hint: 'Scientist excavating ancient fossils and artifacts with a brush',
    drawingDescription: 'An explorer in a sun hat kneeling in a dig pit, carefully brushing sand off a dinosaur skeleton and ancient pot.',
    drawingSteps: [
      'Draw a stepped excavation pit in the ground.',
      'Sketch a person in a wide brim hat holding a small brush and magnifying glass.',
      'Draw a dinosaur skull, ribs, and a cracked amphora vase half-buried in the dirt.',
    ],
  },
  {
    id: 'professions-hard-2',
    word: 'Air Traffic Controller',
    category: 'Professions',
    difficulty: 'hard',
    hint: 'Aviation specialist in a control tower guiding planes with radar or wands',
    drawingDescription: 'A control tower and a marshaller with headset and glowing wands directing an airplane on a runway.',
    drawingSteps: [
      'Draw a tall airport control tower with a wide angled glass cab on top and radar dish.',
      'Draw an airplane approaching a dashed runway.',
      'Include a figure wearing headphones holding two glowing baton cones.',
    ],
  },

  // ================= TECHNOLOGY =================
  {
    id: 'tech-easy-1',
    word: 'Robot',
    category: 'Technology',
    difficulty: 'easy',
    hint: 'Mechanical machine with a boxy body, antenna, and glowing eyes',
    drawingDescription: 'A friendly metallic robot with a square head, top antenna bulb, chest dials, and accordion arms with claw hands.',
    drawingSteps: [
      'Draw a square head with two round eyes and a single antenna with a ball on top.',
      'Attach a larger rectangular torso with buttons, gears, and a meter dial.',
      'Add segmented accordion arms ending in U-shaped pincer claws.',
    ],
  },
  {
    id: 'tech-easy-2',
    word: 'Headphones',
    category: 'Technology',
    difficulty: 'easy',
    hint: 'Padded ear cups connected by a headband for listening to music',
    drawingDescription: 'An arched headband connecting two plush ear cushions with floating musical notes between them.',
    drawingSteps: [
      'Draw a wide upside-down U arch for the headband.',
      'Attach two thick oval ear pads facing inward at the bottom ends.',
      'Draw musical notes and soundwaves radiating around the ear cups.',
    ],
  },
  {
    id: 'tech-medium-1',
    word: 'Drone',
    category: 'Technology',
    difficulty: 'medium',
    hint: 'Flying quadcopter with four spinning propellers and an underside camera',
    drawingDescription: 'A four-armed aerial quadcopter hovering in the air with spinning rotor blades and a gimbal camera underneath.',
    drawingSteps: [
      'Draw a central body pod with four diagonal arms extending out in an X pattern.',
      'Top each arm with a flat oval propeller blur.',
      'Hang a small round camera lens underneath the center pod.',
    ],
  },
  {
    id: 'tech-medium-2',
    word: 'Virtual Reality Headset',
    category: 'Technology',
    difficulty: 'medium',
    hint: '3D goggles worn strapped over the eyes with handheld motion controllers',
    drawingDescription: 'A person wearing chunky visor goggles over their eyes while waving two ringed motion controllers in empty space.',
    drawingSteps: [
      'Draw a head wearing a thick visor block strapped over the eyes.',
      'Sketch both hands holding controllers with circular tracking rings.',
      'Draw a 3D grid floor and floating digital cubes around them.',
    ],
  },
  {
    id: 'tech-hard-1',
    word: '3D Printer',
    category: 'Technology',
    difficulty: 'hard',
    hint: 'Machine that builds solid objects layer by layer from heated filament',
    drawingDescription: 'An open-frame cube machine with a heated nozzle moving on rails, extruding layers to build a miniature statue.',
    drawingSteps: [
      'Draw a square frame with horizontal and vertical guide rods.',
      'Draw a pointed extruder nozzle hanging from the crossbar with a spool of filament on the side.',
      'Below the nozzle, draw a half-built layered object sitting on a flat build plate.',
    ],
  },
  {
    id: 'tech-hard-2',
    word: 'Solar Panel',
    category: 'Technology',
    difficulty: 'hard',
    hint: 'Grid of photovoltaic cells tilted toward the sun to generate electricity',
    drawingDescription: 'An angled grid panel mounted on a roof or stand absorbing sunbeams and sending a lightning bolt to a battery.',
    drawingSteps: [
      'Draw a tilted rectangle divided into a checkerboard grid of cells.',
      'Draw a bright sun in the upper corner with dashed rays hitting the panel.',
      'Connect a wire from the panel to a battery or lightbulb icon with a lightning bolt.',
    ],
  },
  // ================= ADDITIONAL CORE PICTIONARY WORDS =================
  {
    id: 'animals-easy-5',
    word: 'Dog',
    category: 'Animals',
    difficulty: 'easy',
    hint: 'Loyal barking pet with floppy ears, collar, and wagging tail',
    drawingDescription: 'A friendly sitting dog with floppy ears, a dark nose, a collar with a round tag, and a wagging tail with motion lines.',
    drawingSteps: [
      'Draw a round head with two soft floppy ears and a dark oval nose.',
      'Sketch a sitting body with four paws and a collar with a round medal tag.',
      'Add an upward curving tail at the back with small curved motion lines to show wagging.',
    ],
  },
  {
    id: 'animals-easy-6',
    word: 'Bat',
    category: 'Animals',
    difficulty: 'easy',
    hint: 'Nocturnal flying mammal with scalloped leathery wings that sleeps upside down',
    drawingDescription: 'A winged nocturnal mammal flying across a crescent moon with pointed ears and wide scalloped bat wings.',
    drawingSteps: [
      'Draw a small oval furry body in the center with two pointed ears on the head.',
      'Extend two wide, scalloped umbrella-like wings out to the left and right.',
      'Add two tiny feet at the bottom and a crescent moon in the corner.',
    ],
  },
  {
    id: 'food-easy-4',
    word: 'Apple',
    category: 'Food and Drinks',
    difficulty: 'easy',
    hint: 'Crisp round orchard fruit with a top stem and green leaf',
    drawingDescription: 'A plump red apple with a slight dip at the top, a short brown stem, and a single veined green leaf.',
    drawingSteps: [
      'Draw a rounded heart-like fruit shape with a gentle dip at the top and bottom.',
      'Add a short curved wooden stem rising from the top indentation.',
      'Attach a pointed oval leaf to the side of the stem and a curved shine mark on the fruit.',
    ],
  },
  {
    id: 'objects-easy-4',
    word: 'Bicycle',
    category: 'Objects',
    difficulty: 'easy',
    hint: 'Two-wheeled pedal vehicle with handlebars, frame, and saddle seat',
    drawingDescription: 'A side-view two-wheeled bicycle with spoked tires, a diamond frame, curved handlebars, a seat, and center pedals.',
    drawingSteps: [
      'Draw two equal-sized circles spaced apart for the front and back wheels with hub dots.',
      'Connect the wheel hubs with a triangular diamond frame and a pedal crank gear in the middle.',
      'Add a riser post with handlebars over the front wheel and a saddle seat over the rear frame.',
    ],
  },
  {
    id: 'objects-easy-5',
    word: 'Toothbrush',
    category: 'Objects',
    difficulty: 'easy',
    hint: 'Bristled bathroom tool used with toothpaste to clean teeth',
    drawingDescription: 'An angled long handle topped with a rectangular row of vertical bristles and a wavy swirl of toothpaste.',
    drawingSteps: [
      'Draw a long, slightly angled slender handle.',
      'At one end, draw a block of densely packed vertical lines for the bristles.',
      'Top the bristles with a curved S-shaped dollop of toothpaste and sparkle stars.',
    ],
  },
  {
    id: 'objects-medium-4',
    word: 'Helicopter',
    category: 'Objects',
    difficulty: 'medium',
    hint: 'Aircraft that hovers using spinning overhead rotor blades and a tail rotor',
    drawingDescription: 'A rounded cabin cockpit on landing skids with a long tail boom, tail propeller, and wide horizontal main rotor blades on top.',
    drawingSteps: [
      'Draw a rounded bubble cabin with a front glass windshield and two curved landing skids underneath.',
      'Extend a narrow tail boom out the back ending in a small spinning tail rotor.',
      'Add a short mast on top of the cabin with wide horizontal rotor blades and motion arcs.',
    ],
  },
  {
    id: 'actions-easy-3',
    word: 'Swimming',
    category: 'Actions',
    difficulty: 'easy',
    hint: 'Propelling through water using arm strokes and kicks',
    drawingDescription: 'A swimmer with goggles in wavy blue water reaching one arm forward in a freestyle stroke with water splashes.',
    drawingSteps: [
      'Draw two horizontal wavy lines across the middle to represent the water surface.',
      'Above the water line, draw a head wearing swim goggles and one bent arm reaching overhead.',
      'Add kicking feet and splashing water droplets at the back.',
    ],
  },
  {
    id: 'sports-easy-3',
    word: 'Bat',
    category: 'Sports',
    difficulty: 'easy',
    hint: 'Smooth wooden or metal club swung to hit a baseball or cricket ball',
    drawingDescription: 'An angled wooden baseball bat with a taped grip handle and thick barrel striking a stitched ball.',
    drawingSteps: [
      'Draw a long diagonal club that starts narrow at the knobbed handle and widens into a smooth barrel.',
      'Add criss-cross grip tape lines near the thin handle knob.',
      'Draw a small round ball with curved stitches flying off the barrel with impact lines.',
    ],
  },
];

export interface GenerateWordResult {
  word: WordEntry;
  updatedUsedWordIds: string[];
  wasReset: boolean;
}

/**
 * Selects a random word matching the configured difficulty and categories.
 * Avoids repeating words in the current session when allowWordRepetition is false,
 * resets the used word pool if all eligible words have been used,
 * and avoids picking lastWordId consecutively whenever >1 eligible word exists.
 */
export function generateWord(params: {
  difficulty: WordDifficulty;
  categories: WordCategory[];
  usedWordIds: string[];
  lastWordId: string | null;
  allowWordRepetition: boolean;
  randomFn?: () => number;
}): GenerateWordResult {
  const {
    difficulty,
    categories,
    usedWordIds,
    lastWordId,
    allowWordRepetition,
    randomFn = Math.random,
  } = params;

  const isAllCategories =
    categories.length === 0 || categories.includes('Random/Mixed');

  // Filter by category and difficulty
  let eligible = WORD_BANK.filter((entry) => {
    const categoryMatch =
      isAllCategories || categories.includes(entry.category);
    const difficultyMatch =
      difficulty === 'mixed' || entry.difficulty === difficulty;
    return categoryMatch && difficultyMatch;
  });

  // Fallback if filter combination is somehow empty
  if (eligible.length === 0) {
    eligible = [...WORD_BANK];
  }

  let currentUsedIds = [...usedWordIds];
  let wasReset = false;

  if (!allowWordRepetition) {
    const unusedEligible = eligible.filter(
      (entry) => !currentUsedIds.includes(entry.id)
    );

    if (unusedEligible.length > 0) {
      eligible = unusedEligible;
    } else {
      // Eligible word bank exhausted! Reset used words for these eligible items and continue
      const eligibleIds = new Set(eligible.map((e) => e.id));
      currentUsedIds = currentUsedIds.filter((id) => !eligibleIds.has(id));
      wasReset = true;
    }
  }

  // Prevent selecting the exact same word twice consecutively unless only 1 word is available
  if (eligible.length > 1 && lastWordId) {
    const nonConsecutive = eligible.filter((entry) => entry.id !== lastWordId);
    if (nonConsecutive.length > 0) {
      eligible = nonConsecutive;
    }
  }

  const randomIndex = Math.min(
    eligible.length - 1,
    Math.floor(randomFn() * eligible.length)
  );
  const selected = eligible[randomIndex];

  const nextUsedIds = currentUsedIds.includes(selected.id)
    ? currentUsedIds
    : [...currentUsedIds, selected.id];

  return {
    word: selected,
    updatedUsedWordIds: nextUsedIds,
    wasReset,
  };
}
