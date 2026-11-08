/* Build My Room: all content lives here. Pages are rendered by app.js. */

const BASE_ROOM = {
  file: "empty-room.jpg",
  title: "The empty room",
  note: "Grey walls, light oak floor, one wide window onto a city skyline. Every design below starts from this shell."
};

/* Shared opening for every prompt so results stay faithful to the real room. */
const BASE_LOCK =
  "Use the attached photo of my empty room as the base. Keep the exact camera position, lens, " +
  "room proportions, ceiling height, window size and placement, and floor direction. " +
  "Do not move or resize the window. Photorealistic interior render, natural perspective, 16:9.";

const THEMES = [
  {
    id: "innovation-floor",
    name: "Innovation Floor",
    tagline: "A full robotics R&D lab, no bed",
    mood: "Clean, clinical, industrial",
    palette: ["#e9edf1", "#9aa6b2", "#3b4652", "#1fb6d9"],
    description:
      "The room becomes a working lab: a glass-walled precision fabrication module with a robot arm, a ceiling-mounted manipulator, a central steel workbench with an AMR prototype, AMR robots on the floor and a multi-screen fleet-monitoring desk.",
    elements: [
      "Glass \"Precision Fabrication Module\" enclosure",
      "Ceiling-mounted robot arm on a gantry rail",
      "Central steel bench with an AMR prototype stack",
      "Labelled grey parts bins floor to ceiling",
      "Filament wall and 3D printers",
      "Floor cable trays and roaming AMRs",
      "Wide monitoring desk with fleet dashboard",
      "Skylight and track lighting"
    ],
    images: [
      { file: "innovation-floor-1.jpg", title: "Fabrication module with arm", note: "Robot arm inside the glass module; manipulator over the bench." },
      { file: "innovation-floor-2.jpg", title: "Gantry + rack build", note: "CNC-style gantry in the module, filament rack under it." },
      { file: "innovation-floor-3.jpg", title: "Laser cutter + PCB bench", note: "Laser cutter in the module, PCB assembly bench, more AMRs." }
    ],
    prompts: [
      "Turn the room into a compact robotics R&D lab called \"RoboJain Labs - Innovation Floor\". On the left, a glass-walled precision fabrication module with a white six-axis robot arm inside. A steel workbench in the centre holding a stacked AMR prototype, oscilloscope and parts trays. Grey labelled storage bins on steel shelving covering both side walls. A wide desk on the right with three monitors showing a robot fleet map. Cool white LED panels, skylight, polished floor with recessed cable trays.",
      "Same lab, but add a ceiling gantry rail along the right wall carrying a white robot arm that reaches over the bench. Put two small warehouse-style AMRs on charging pads near the window. Keep everything tidy and labelled, like a professional research facility.",
      "Night version of the lab: city lights through the window, bench lit by a single task lamp, monitors glowing cyan, status LEDs on the AMRs, soft reflections on the floor. Moody, cinematic, still photorealistic."
    ]
  },
  {
    id: "workshop-lounge",
    name: "Workshop + Lounge",
    tagline: "Maker lab with a place to sit",
    mood: "Bright, practical, friendly",
    palette: ["#f2efe9", "#c9b79c", "#5a636d", "#25c2e8"],
    description:
      "A hands-on electronics workshop on the left (whiteboard with the assistive-tech plan, scopes, bench supplies, a mobile robot build) with a grey L-shaped sofa and coffee corner on the right. Good for working and for having people over.",
    elements: [
      "Whiteboard: \"RoboJain: Assistive Tech\" roadmap",
      "Long steel workbench with oscilloscope and PSU",
      "Wooden-frame mobile robot (later with arm)",
      "Warm LED under-shelf strips on wall shelving",
      "Window desk with dual monitors (CARA on screen)",
      "Grey L-shaped sofa with RoboJain and CARA cushions",
      "Patterned rug and side table",
      "RoboJain logo above the window"
    ],
    images: [
      { file: "workshop-lounge-1.jpg", title: "Workshop only", note: "First pass: bench, whiteboard and big gaming-style monitors, no sofa yet." },
      { file: "workshop-lounge-2.jpg", title: "Workshop + sofa", note: "Monitors move to the window desk; L-sofa and branded cushions added." },
      { file: "workshop-lounge-3.jpg", title: "Robot with arm", note: "Same layout; mobile robot now carries a manipulator arm." }
    ],
    prompts: [
      "Left side of the room: a long steel electronics workbench with an oscilloscope, bench power supply, soldering station and a wooden-frame four-wheeled mobile robot. A whiteboard on the left wall titled \"RoboJain: Assistive Tech\" with circuit sketches and goals. Steel shelving with labelled clear bins and warm LED strips under each shelf. Centre: a small desk in front of the window with two monitors and an ergonomic chair.",
      "Right side of the same room: a grey L-shaped fabric sofa with cushions printed with a small robot logo and the word \"CARA\", a patterned grey rug, a side table with books and a mug, a potted plant. Keep the left side as a workshop so the room feels half lab, half lounge.",
      "Same layout at golden hour: warm sunlight from the window across the floor, LED strips dimmed, a coffee cup steaming on the side table. Calm, lived-in, inviting."
    ]
  },
  {
    id: "urban-lab-bedroom",
    name: "Urban Lab Bedroom",
    tagline: "Sleep, study and build in one room",
    mood: "Modern, compact, organised",
    palette: ["#e4e4e2", "#8c8f93", "#3a3d42", "#2ea9d6"],
    description:
      "The most realistic everyday version: a mobile workbench and storage wall on the left, a desk in front of the window, and a bed set into dark grey built-in wardrobes on the right, with certificates and books on the wall.",
    elements: [
      "Dark grey built-in wardrobes around the bed",
      "Mobile workbench on castors",
      "Labelled storage bins with warm under-shelf LEDs",
      "Desk at the window with CARA on screen",
      "Hanging plants either side of the window",
      "Framed certificates and a bookshelf column",
      "Charcoal bedding with RoboJain / CARA pillows",
      "Glass bedside table with a tablet"
    ],
    images: [
      { file: "urban-lab-bedroom-1.jpg", title: "Day, quadruped on bench", note: "Bed in the wardrobe niche; a robot dog on the mobile bench." },
      { file: "urban-lab-bedroom-2.jpg", title: "Day, arm robot", note: "Same layout with a mobile robot carrying an arm." },
      { file: "urban-lab-bedroom-night.jpg", title: "Night", note: "City at night, drone on the bench, humanoid near the window." }
    ],
    prompts: [
      "Make this a bedroom-lab for a robotics engineer. Right wall: a double bed built into dark grey floor-to-ceiling wardrobes with a reading light, charcoal bedding and two pillows printed \"RoboJain\" and \"CARA\". Left wall: steel shelving with labelled bins and warm LED strips, a whiteboard and a mobile workbench on castors with a small robot on it. A desk in front of the window with two monitors and an office chair. Hanging plants beside the window, framed certificates on the right wall.",
      "Same bedroom-lab, but make it feel larger: replace the wardrobes with a wall bed that folds up, show it half open, and put a slim desk that folds down from the same unit. Keep the left workshop wall.",
      "Same room at night. City skyline lit up through the window, warm lamp by the bed, cool glow from the monitors, LED strips at 30%. Bed made neatly, a tablet on the glass bedside table showing a robot dashboard."
    ]
  },
  {
    id: "coastal-biojain",
    name: "Sri Lankan Coastal",
    tagline: "\"BioJain\": a lab by the sea",
    mood: "Warm, tropical, personal",
    palette: ["#f1e3c8", "#b98a55", "#4d3624", "#3fc8b9"],
    description:
      "The window looks onto a palm-lined Sri Lankan beach. Rattan baskets, teak furniture, a mosquito-net canopy bed with fairy lights and Tamil lettering on the wall, and a bio-medical twist: robot hand prototypes, medical-imaging screens and a \"Local Medicine Devices\" chalkboard.",
    elements: [
      "Window replaced with a palm-and-ocean view",
      "Teak four-poster bed with sheer canopy and fairy lights",
      "Tamil wall lettering behind the bed",
      "Chalkboard: \"Sri Lankan Innovation for Big Dreams\"",
      "Robotic hand / arm prototype on the workbench",
      "Glowing specimen jars and rattan storage baskets",
      "Humanoid robot by the desk",
      "Plants, brass oil lamp, jute rug"
    ],
    images: [
      { file: "coastal-biojain-sunset.jpg", title: "Sunset", note: "Golden light over the sea, canopy open." },
      { file: "coastal-biojain-night.jpg", title: "Night", note: "Crescent moon, fairy lights on, BioJain sign lit." }
    ],
    prompts: [
      "Change the view through the window to a Sri Lankan beach with coconut palms and the Indian Ocean. Furnish the room with teak and rattan: a four-poster bed on the right with a sheer white canopy and warm fairy lights, cushions in natural linen, a brass oil lamp on the bedside table. Left side: a wooden workbench with a robotic prosthetic hand prototype, test equipment and rattan storage baskets. A chalkboard titled \"Sri Lankan Innovation for Big Dreams\". Lots of potted tropical plants.",
      "Same coastal room, but daytime monsoon: rain on the window, grey-green sea, soft diffuse light, the canopy tied back, a cup of Ceylon tea on the desk. Calm and cosy.",
      "Same room at blue hour with a crescent moon over the sea. Fairy lights on, a glowing wooden sign on the wall reading \"RoboJain\", medical-imaging scans on the desk monitors, the humanoid robot standing by the window."
    ]
  },
  {
    id: "kandyan-heritage",
    name: "Kandyan Heritage",
    tagline: "Hill-country wood, temple craft, future tech",
    mood: "Rich, crafted, cinematic",
    palette: ["#f3d9a4", "#a8693a", "#4a2a17", "#41c7e0"],
    description:
      "Warm timber ceiling and shelving inspired by Kandyan architecture, a carved wooden bed with a \"Dream Awake\" plaque, woven mats, and a balance of heritage objects with holographic dashboards and small robots. The window looks out to misty hills or palms.",
    elements: [
      "Timber-beamed ceiling with a pendant lantern",
      "Carved wooden bed with \"DREAM AWAKE\" plaque",
      "Sign: \"RoboJain: Autonomous Systems & Material Science Laboratory\"",
      "Wall screens with dashboards and clocks",
      "Woven rattan baskets and floor mats with traditional patterns",
      "Brass-and-wood rover robots",
      "Glass-dome specimen displays",
      "Hill or palm view through sheer curtains"
    ],
    images: [
      { file: "kandyan-heritage-1.jpg", title: "Palm view", note: "Daylight, palms outside, terrarium on a stand by the window." },
      { file: "kandyan-heritage-sunset.jpg", title: "Hill-country sunset", note: "Misty hills at sunset, warm and dramatic." },
      { file: "kandyan-heritage-filament.jpg", title: "Filament tower", note: "A lit filament and parts tower replaces the terrarium." }
    ],
    prompts: [
      "Restyle the room with Kandyan hill-country craftsmanship: a dark timber beamed ceiling with a carved brass pendant lantern, honey-toned wooden shelving with woven baskets on every wall, a carved wooden bed on the left with a small brass plaque reading \"DREAM AWAKE\", a traditional patterned floor mat. Above the window, a carved wooden sign reading \"RoboJain: Autonomous Systems Lab\". Wall-mounted screens with soft blue dashboards blend into the woodwork. Sheer curtains, misty green hills outside.",
      "Same Kandyan room, but swap the bed side for a reading nook: a low wooden daybed with cushions, a brass oil lamp and a stack of robotics books. Put a small wooden rover robot on the mat. Morning light, mist on the hills.",
      "Same room during Vesak at night: paper lanterns outside the window, warm lantern light inside, screens dimmed, glass domes on the shelves glowing faintly. Festive but calm."
    ]
  },
  {
    id: "neon-creator-studio",
    name: "Neon Creator Studio",
    tagline: "Content-ready robotics studio",
    mood: "Bold, glowing, on-camera",
    palette: ["#f6efe2", "#d9a35c", "#1b2b4a", "#5ab0ff"],
    description:
      "Made to be filmed: backlit RoboJain branding on the wall, a long desk with dual monitors showing CARA, a pegboard tool wall, a humanoid robot and a rover on the window console, warm LED cove lighting and lots of plants. Comes with either a bed or a sofa.",
    elements: [
      "Backlit RoboJain logo wall with focus areas",
      "\"Dream Build Innovate\" light panel",
      "Long desk with dual monitors (code + CARA)",
      "Pegboard tool wall and parts drawers",
      "Humanoid robot and rover on the window console",
      "Warm LED cove lighting and floating shelves",
      "Bed or sofa with RoboJain cushion",
      "Goals board: MSc, CARA, UAE robotics job"
    ],
    images: [
      { file: "neon-studio-bedroom.png", title: "Studio bedroom", note: "Two desks, pegboard, filament wall, bed in the corner." },
      { file: "neon-bedroom-workshop.png", title: "Bedroom workshop", note: "Pegboard and drone above, CARA project list on the right wall." },
      { file: "neon-creator-lounge.png", title: "Creator lounge", note: "Sofa replaces the bed; CARA feature board and \"Build Smart Live Better\" poster." },
      { file: "neon-creator-goals.png", title: "Goals wall", note: "Goals whiteboard, MSc Robotics shelf, coffee table." }
    ],
    prompts: [
      "Turn the room into a robotics content-creator studio. Left wall: an illuminated \"RoboJain - Innovating for a Smarter Tomorrow\" logo with a list of focus areas (Robotics, AI & HRI, Assistive Technology, Affordable Solutions). Along it, a long wooden desk with an ergonomic chair and two monitors, one showing code and one showing a humanoid robot labelled \"CARA\". A pegboard of tools above. A low console under the window with a white humanoid robot and a small rover. Warm LED cove lighting, floating shelves with plants.",
      "Same studio, but the right side becomes a lounge: a grey sofa with a RoboJain cushion, a wooden coffee table with a robot mug, a framed poster reading \"Build Smart Live Better\" and a whiteboard titled \"My Goals\". Bright and camera-ready, like a YouTube set.",
      "Same studio set up for filming at night: key light on the desk, ring light in the corner, logo glowing cyan, city lights outside, everything else dimmed so the robots and screens pop."
    ]
  }
];

/* Mix-and-match modifiers you can add to the end of any prompt. */
const MODIFIERS = [
  { group: "Time of day", items: ["early morning, soft blue light", "golden hour, warm low sun across the floor", "blue hour, city lights coming on", "late night, only lamps and screens lit"] },
  { group: "Camera", items: ["same view, but wider lens to show more of the side walls", "close-up of the workbench at desk height", "view from the window looking back into the room", "top-down floor plan render of the same layout"] },
  { group: "Budget reality", items: ["using only affordable IKEA-style furniture", "student budget, mostly DIY shelving and second-hand furniture", "premium finishes, custom joinery"] },
  { group: "Clean-up", items: ["remove all text and logos", "fewer objects, more empty floor space", "make all labels readable and correctly spelled"] }
];

/* Prompts for new directions not yet tried. */
const NEW_DIRECTIONS = [
  { name: "Minimal Japandi lab", prompt: "Restyle the room in a minimal Japandi style: pale oak, white walls, paper lamp, a low platform bed, one clean desk at the window with a single monitor and a small robot arm, all tools hidden in flat-front cabinets. Calm, almost empty, very tidy." },
  { name: "Dubai high-rise studio", prompt: "Make the window view a Dubai skyline with the Burj Khalifa at dusk. Furnish the room as a sleek modern apartment studio: marble-effect desk, black metal shelving with robot parts in acrylic boxes, a gold-accent RoboJain sign, a compact bed with a grey headboard, warm cove lighting." },
  { name: "Elder-care test room", prompt: "Turn the room into a home-like test space for an elder-care companion robot: a comfortable armchair, a side table with a pill organiser, a small bed with safety rails, soft warm lighting, and a white companion robot standing near the chair. One corner has a discreet engineer desk with a laptop and a sensor kit." },
  { name: "Cyberpunk night lab", prompt: "Cyberpunk version of the room at night: magenta and cyan neon strips, rain on the window over a dense neon city, a cluttered workbench with an exposed robot torso, dark metal shelving, holographic screens, haze in the air." },
  { name: "Kids' STEM corner", prompt: "Split the room so one corner is a colourful kids' robotics learning area: a low table, building kits, a small friendly robot, a pegboard with large tools, and a wall chart of simple circuits. The rest stays an adult workspace." },
  { name: "Greenhouse lab", prompt: "Fill the room with plants: a hydroponic grow rack along one wall with purple grow lights, a desk with a robot arm tending seedlings, terrariums, a hanging-plant ceiling, and a bed tucked in a green corner." }
];
