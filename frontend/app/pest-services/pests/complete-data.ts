'use client';

export interface PestData {
  slug: string;
  name: string;
  description: string;
  biology: string;
  signs: string;
  prevention: string;
  treatment: string;
  diy: string;
  image: string; // Single image path (kept for backward compatibility)
  images: string[]; // Array of image paths
  folderName: string; // matches folder in public/mga pesti sa pinas
}

// Mapping of folder names to their respective image files
const pestImages: Record<string, string[]> = {
  'American Cockroach': [
    'Periplaneta-americana – American-cockroach – Kuwagong-amerikano.jpg',
    'Periplaneta-americana – American-cockroach – Kuwagong-amerikano1.jpg',
    'Periplaneta-americana – American-cockroach – Kuwagong-amerikano2.jpg',
    'Periplaneta-americana – American-cockroach – Kuwagong-amerikano3.jpg',
    'Periplaneta-americana – American-cockroach – Kuwagong-amerikano4.jpg'
  ],
  'Aphid': [
    'Aphid – Aphid – Dapulak.jpg',
    'Aphid – Aphid – Dapulak1.jpg',
    'Aphid – Aphid – Dapulak2.jpg',
    'Aphid – Aphid – Dapulak3.jpg',
    'Aphid – Aphid – Dapulak4.jpg'
  ],
  'Apple Snail': [
    'Pomacea-canaliculata – Apple-snail – Kuhol.jpg',
    'Pomacea-canaliculata – Apple-snail – Kuhol1.jpg',
    'Pomacea-canaliculata – Apple-snail – Kuhol2.jpg',
    'Pomacea-canaliculata – Apple-snail – Kuhol3.jpg'
  ],
  'ArmyWorm': [
    'Spodoptera-litura – Armyworm – Utok-ng-gulay.jpg',
    'Spodoptera-litura – Armyworm – Utok-ng-gulay1.jpg',
    'Spodoptera-litura – Armyworm – Utok-ng-gulay2.webp',
    'Spodoptera-litura – Armyworm – Utok-ng-gulay3.jpg',
    'Spodoptera-litura – Armyworm – Utok-ng-gulay4.jpg',
    'Spodoptera-litura – Armyworm – Utok-ng-gulay5.jpg'
  ],
  'Bed Bug': [
    'Cimex-lectularius – Bed-bug – Aninong-dilig.jpg',
    'Cimex-lectularius – Bed-bug – Aninong-dilig2.jpg',
    'Cimex-lectularius – Bed-bug – Aninong-dilig3.jpg',
    'Cimex-lectularius – Bed-bug – Aninong-dilig4.jpg',
    'Cimex-lectularius – Bed-bug.avif',
    'Cimex-lectularius – Bed-bug1.jpg'
  ],
  'Brown Plant Hopper': [
    'Nilaparvata-lugens – Brown-plant-hopper – Kayumangging-dahon.jpg',
    'Nilaparvata-lugens – Brown-plant-hopper – Kayumangging-dahon1.jpg',
    'Nilaparvata-lugens – Brown-plant-hopper – Kayumangging-dahon2.jpg'
  ],
  'Carpenter Ant': [
    'Camponotus-pennsylvanicus – Carpenter-ant – Langgam-karpintero.jpg',
    'Camponotus-pennsylvanicus – Carpenter-ant – Langgam-karpintero1.jpg',
    'Camponotus-pennsylvanicus – Carpenter-ant – Langgam-karpintero2.jpg'
  ],
  'Coconut Rhinoceros': [
    'Oryctes-rhinoceros – Coconut-rhinoceros-beetle – U-ok.jpg',
    'Oryctes-rhinoceros – Coconut-rhinoceros-beetle – U-ok1.jpg',
    'Oryctes-rhinoceros – Coconut-rhinoceros-beetle – U-ok2.jpg'
  ],
  'Colorado Potato Beetle': [
    'Leptinotarsa-decemlineata – Colorado-potato-beetle – Salagubang-patatas.jpg',
    'Leptinotarsa-decemlineata – Colorado-potato-beetle – Salagubang-patatas1.jpg',
    'Leptinotarsa-decemlineata – Colorado-potato-beetle – Salagubang-patatas2.jpg'
  ],
  'Corn Root Worm': [
    'Diabrotica-virgifera – Corn-rootworm – Uod-ng-ugat-ng-mais.jpg',
    'Diabrotica-virgifera – Corn-rootworm – Uod-ng-ugat-ng-mais1.jpg',
    'Diabrotica-virgifera – Corn-rootworm – Uod-ng-ugat-ng-mais2.jpg'
  ],
  'Diamond Back Moth': [
    'Plutella-xylostella – Diamondback-moth – Gamugamo.jpg',
    'Plutella-xylostella – Diamondback-moth – Gamugamo1.jpg',
    'Plutella-xylostella – Diamondback-moth – Gamugamo2.jpg'
  ],
  'Fire-Ant': [
    'Solenopsis-invicta – Fire-ant – Langgam-apoy.jpg',
    'Solenopsis-invicta – Fire-ant – Langgam-apoy1.jpg',
    'Solenopsis-invicta – Fire-ant – Langgam-apoy2.jpg'
  ],
  'Garden-snail': [
    'Cornu-aspersum – Garden-snail – Suso-sa-hardin.jpg',
    'Cornu-aspersum – Garden-snail – Suso-sa-hardin1.jpg',
    'Cornu-aspersum – Garden-snail – Suso-sa-hardin2.jpg'
  ],
  'German Cockroach': [
    'Blattella-germanica – German-cockroach – Ipis-aleman.jpg',
    'Blattella-germanica – German-cockroach – Ipis-aleman1.jpg',
    'Blattella-germanica – German-cockroach – Ipis-aleman2.jpg'
  ],
  'House Fly': [
    'Musca-domestica – House-fly – Langaw.jpg',
    'Musca-domestica – House-fly – Langaw1.jpg',
    'Musca-domestica – House-fly – Langaw2.jpg'
  ],
  'Mango Leaf Hopper': [
    'Idioscopus-niveosparsus – Mango-leafhopper – Dapulak-ng-mangga.jpg',
    'Idioscopus-niveosparsus – Mango-leafhopper – Dapulak-ng-mangga1.jpg',
    'Idioscopus-niveosparsus – Mango-leafhopper – Dapulak-ng-mangga2.jpg'
  ],
  'Mosquito': [
    'Aedes-aegypti – Mosquito – Lamok.jpg',
    'Aedes-aegypti – Mosquito – Lamok1.jpg',
    'Aedes-aegypti – Mosquito – Lamok2.jpg'
  ],
  'Red Flour beetle': [
    'Tribolium-castaneum – Red-flour-beetle – Salagubang-pulang-harina.jpg',
    'Tribolium-castaneum – Red-flour-beetle – Salagubang-pulang-harina1.jpg',
    'Tribolium-castaneum – Red-flour-beetle – Salagubang-pulang-harina2.jpg'
  ],
  'Rice Bug': [
    'Leptocorisa-acuta – Rice-bug – Katutubong-tipaklong.avif',
    'Leptocorisa-acuta – Rice-bug – Katutubong-tipaklong.jpg',
    'Leptocorisa-acuta – Rice-bug – Katutubong-tipaklong1.jpg',
    'Leptocorisa-acuta – Rice-bug – Katutubong-tipaklong2.jpg',
    'Leptocorisa-acuta – Rice-bug – Katutubong-tipaklong3.jpg',
    'Leptocorisa-acuta – Rice-bug – Katutubong-tipaklong4.jpg'
  ],
  'Rice Gall': [
    'Orseolia-oryzae – Rice-gall-midge – Uok-ng-palay.jpg',
    'Orseolia-oryzae – Rice-gall-midge – Uok-ng-palay1.jpg',
    'Orseolia-oryzae – Rice-gall-midge – Uok-ng-palay2.jpg'
  ],
  'Rice Leaf Folder': [
    'Cnaphalocrocis-medinalis – Rice-leaffolder – Tagapag-balot-ng-dahon-ng-palay.jpg',
    'Cnaphalocrocis-medinalis – Rice-leaffolder – Tagapag-balot-ng-dahon-ng-palay1.jpg',
    'Cnaphalocrocis-medinalis – Rice-leaffolder – Tagapag-balot-ng-dahon-ng-palay2.jpg'
  ],
  'Rice Water Weevil': [
    'Lissorhoptrus-oryzophilus – Rice-water-weevil – Bukbok-ng-tubig-ng-palay.jpg',
    'Lissorhoptrus-oryzophilus – Rice-water-weevil – Bukbok-ng-tubig-ng-palay1.jpg',
    'Lissorhoptrus-oryzophilus – Rice-water-weevil – Bukbok-ng-tubig-ng-palay2.jpg'
  ],
  'Rice Weevil': [
    'Sitophilus-oryzae – Rice-weevil – Bukbok-ng-palay.jpg',
    'Sitophilus-oryzae – Rice-weevil – Bukbok-ng-palay1.jpg',
    'Sitophilus-oryzae – Rice-weevil – Bukbok-ng-palay2.jpg'
  ],
  'SilverLeaf WhiteFly': [
    'Bemisia-tabaci – Silverleaf-whitefly – Puting-dapulak.jpg',
    'Bemisia-tabaci – Silverleaf-whitefly – Puting-dapulak1.jpg',
    'Bemisia-tabaci – Silverleaf-whitefly – Puting-dapulak2.jpg'
  ],
  'Stripe Rice Stem Borer': [
    'Chilo-supressalis – Striped-stem-borer – Uod-ng-uhay-ng-palay.jpg',
    'Chilo-supressalis – Striped-stem-borer – Uod-ng-uhay-ng-palay1.jpg',
    'Chilo-supressalis – Striped-stem-borer – Uod-ng-uhay-ng-palay2.jpg'
  ],
  'Tea Mosquito Bug': [
    'Helopeltis-theivora – Tea-mosquito-bug – Munting-surot-ng-tsaa.jpg',
    'Helopeltis-theivora – Tea-mosquito-bug – Munting-surot-ng-tsaa1.jpg',
    'Helopeltis-theivora – Tea-mosquito-bug – Munting-surot-ng-tsaa2.jpg'
  ],
  'Termite': [
    'Coptotermes-gestroi – Termite – Anay.jpg',
    'Coptotermes-gestroi – Termite – Anay1.jpg',
    'Coptotermes-gestroi – Termite – Anay2.jpg'
  ],
  'Tomato Fruit Borer': [
    'Helicoverpa-armigera – Tomato-fruit-borer – Uod-ng-bunga-ng-kamatis.jpg',
    'Helicoverpa-armigera – Tomato-fruit-borer – Uod-ng-bunga-ng-kamatis1.jpg',
    'Helicoverpa-armigera – Tomato-fruit-borer – Uod-ng-bunga-ng-kamatis2.jpg'
  ],
  'Yellow Stem Borer': [
    'Scirpophaga-incertulas – Yellow-stem-borer – Uod-ng-ugat-ng-palay.jpg',
    'Scirpophaga-incertulas – Yellow-stem-borer – Uod-ng-ugat-ng-palay1.jpg',
    'Scirpophaga-incertulas – Yellow-stem-borer – Uod-ng-ugat-ng-palay2.jpg'
  ]
};

// Function to get all images for a pest from the public folder
export function getPestImages(folderName: string): string[] {
  const images = pestImages[folderName];
  if (!images || images.length === 0) {
    return [];
  }
  return images.map(img => `/mga pesti sa pinas/${encodeURIComponent(folderName)}/${encodeURIComponent(img)}`);
}

// Function to get the first image for a pest from the public folder (for backward compatibility)
export function getPestImage(folderName: string): string {
  const images = getPestImages(folderName);
  return images[0] || ''; // Return first image or empty string if no images
}

// Function to get all pest names
export function getAllPestNames(): string[] {
  return Object.keys(pestImages);
}

// Function to get the first available image for a pest (for backward compatibility)
export function getFirstPestImage(folderName: string): string | null {
  const image = getPestImage(folderName);
  return image || null;
}

export const completePestData: PestData[] = [
  {
    slug: 'american-cockroach',
    name: 'American Cockroach',
    description:
      'Large reddish-brown cockroach, about 1.5–2 inches long, with a yellowish figure-8 pattern on the pronotum, commonly found in warm, damp areas such as basements, kitchens, and sewers.',
    biology:
      'Nocturnal and omnivorous scavenger, capable of surviving up to a year, reproduces continuously with females laying multiple egg cases.',
    signs:
      'Presence of droppings, shed skins, egg cases, strong musty odor, and sightings during nighttime.',
    prevention:
      'Seal cracks and crevices, reduce moisture, keep food sealed, maintain cleanliness, and remove clutter.',
    treatment:
      'Use bait traps, insecticidal sprays, and professional pest control services for severe infestations.',
    diy:
      'Mix boric acid with sugar and sprinkle along baseboards and corners, or use diatomaceous earth to dehydrate and kill cockroaches.',
    image: getPestImage('American Cockroach'),
    images: getPestImages('American Cockroach'),
    folderName: 'American Cockroach',
  },
  {
    slug: 'german-cockroach',
    name: 'German Cockroach',
    description:
      'Small, light brown cockroach with two dark parallel stripes on the pronotum, measuring 0.5–0.6 inches; prefers kitchens and bathrooms.',
    biology:
      'Highly reproductive; females carry egg cases with up to 40 eggs each; thrive in warm, humid conditions.',
    signs: 'Fecal spots, egg cases, greasy smear marks, and unpleasant odor.',
    prevention:
      'Maintain proper sanitation, seal entry points, remove clutter, and keep food stored properly.',
    treatment: 'Gel baits, insect growth regulators, and insecticidal sprays are effective.',
    diy: 'Place cotton balls soaked in peppermint oil in infested areas or mix baking soda with sugar to poison them.',
    image: getPestImage('German Cockroach'),
    images: getPestImages('German Cockroach'),
    folderName: 'German Cockroach',
  },
  {
    slug: 'rice-bug',
    name: 'Rice Bug',
    description:
      'Small, dark-colored insect that attacks developing rice grains, piercing them and sucking sap, reducing yield and grain quality.',
    biology: 'Both nymphs and adults feed on grains; populations increase in dense rice fields.',
    signs: 'Empty or shriveled grains, discolored panicles, and reduced grain weight.',
    prevention: 'Field sanitation, crop rotation, timely harvesting, and removal of weeds.',
    treatment: 'Selective insecticide sprays and manual removal in small fields.',
    diy: 'Spray a solution of neem oil and water on rice plants to repel adults.',
    image: getPestImage('Rice Bug'),
    images: getPestImages('Rice Bug'),
    folderName: 'Rice Bug',
  },
  {
    slug: 'rice-gall',
    name: 'Rice Gall',
    description: 'Abnormal swollen growths on rice stems caused by gall-forming insects such as rice gall midge.',
    biology:
      'Larvae feed inside young stems, stunting growth and reducing panicle development; multiple generations per season.',
    signs: 'Swollen stems, stunted plants, and empty panicles.',
    prevention: 'Use resistant varieties, proper spacing, and avoid excessive nitrogen fertilization.',
    treatment: 'Early insecticide application targeting larvae.',
    diy: 'Flood fields to disrupt larval development and manually remove infested seedlings.',
    image: getPestImage('Rice Gall'),
    images: getPestImages('Rice Gall'),
    folderName: 'Rice Gall',
  },
  {
    slug: 'rice-leaf-folder',
    name: 'Rice Leaf Folder',
    description: 'Small moth whose larvae fold and feed inside rice leaves, reducing photosynthesis and weakening plants.',
    biology: 'Larvae roll leaves and feed internally; multiple generations per season.',
    signs: 'Folded leaves with yellowish patches, leaf drying, and visible larvae inside folded leaves.',
    prevention:
      'Remove crop residues, maintain water management, plant resistant varieties, and encourage natural predators.',
    treatment: 'Biological control with parasitoids, selective insecticides if infestation is severe.',
    diy: 'Spray a mixture of neem oil and water or garlic extract on leaves to deter larvae.',
    image: getPestImage('Rice Leaf Folder'),
    images: getPestImages('Rice Leaf Folder'),
    folderName: 'Rice Leaf Folder',
  },
  {
    slug: 'rice-water-weevil',
    name: 'Rice Water Weevil',
    description: 'Small, dark beetle; adults feed on leaves while larvae feed on rice roots, causing stunted growth.',
    biology:
      'Adults live above water, while larvae develop underwater feeding on roots; multiple generations in warm conditions.',
    signs: 'Reduced tillering, stunted plants, yellowing, and damaged roots.',
    prevention: 'Flooding practices, crop rotation, resistant varieties, and removing weeds from fields.',
    treatment: 'Insecticidal seed treatments, foliar sprays targeting adults.',
    diy: 'Apply neem cake around roots or maintain proper water levels to reduce larval survival.',
    image: getPestImage('Rice Water Weevil'),
    images: getPestImages('Rice Water Weevil'),
    folderName: 'Rice Water Weevil',
  },
  {
    slug: 'rice-weevil',
    name: 'Rice Weevil',
    description: 'Small beetle (2–3 mm) with elongated snout; attacks stored rice grains causing internal damage.',
    biology: 'Larvae develop inside grains; adults can live for months and reproduce rapidly in stored grains.',
    signs: 'Holes in grains, powdery frass in storage containers, and unpleasant odor.',
    prevention: 'Dry and store grains properly in airtight containers, inspect storage regularly.',
    treatment: 'Fumigation, diatomaceous earth, insecticide treatment of storage areas.',
    diy: 'Place bay leaves or dried chili in rice containers to repel weevils naturally.',
    image: getPestImage('Rice Weevil'),
    images: getPestImages('Rice Weevil'),
    folderName: 'Rice Weevil',
  },
  {
    slug: 'yellow-stem-borer',
    name: 'Yellow Stem Borer',
    description: 'Moth larvae that bore into rice stems, causing dead hearts and whitehead panicles.',
    biology: 'Larvae tunnel inside stems; multiple generations per season; adults are nocturnal.',
    signs: 'Dead hearts in young plants, whiteheads in mature panicles, stunted growth.',
    prevention: 'Field sanitation, proper planting time, resistant varieties, and removing infested plants.',
    treatment: 'Apply larvicidal insecticides, use light traps for adults.',
    diy: 'Collect and destroy infested stems manually; apply neem oil spray on young plants.',
    image: getPestImage('Yellow Stem Borer'),
    images: getPestImages('Yellow Stem Borer'),
    folderName: 'Yellow Stem Borer',
  },
  {
    slug: 'stripe-rice-stem-borer',
    name: 'Stripe Rice Stem Borer',
    description: 'Similar to yellow stem borer but with striped larvae; attacks rice stems, weakening plants.',
    biology: 'Larvae feed inside stems, multiple generations per year; adults are small nocturnal moths.',
    signs: 'Deadheart, whitehead, yellowing, and reduced yield.',
    prevention: 'Proper field sanitation, resistant varieties, and timely planting.',
    treatment: 'Use insecticides targeting larvae and pheromone traps for adults.',
    diy: 'Remove and burn affected stems; spray garlic or neem solution to repel moths.',
    image: getPestImage('Stripe Rice Stem Borer'),
    images: getPestImages('Stripe Rice Stem Borer'),
    folderName: 'Stripe Rice Stem Borer',
  },
  {
    slug: 'brown-leaf-hopper',
    name: 'Brown Leaf Hopper',
    description: 'Small wedge-shaped brown insect feeding on rice leaves and stems, vector of rice viruses.',
    biology: 'Sucks plant sap; populations increase in dense planting; vectors for grassy stunt and ragged stunt viruses.',
    signs: 'Yellowing, curling leaves, hopperburn, stunted growth.',
    prevention: 'Proper spacing, weed removal, avoid excessive nitrogen, and resistant varieties.',
    treatment: 'Insecticide sprays, introduce natural predators like spiders or ladybugs.',
    diy: 'Spray water mixed with neem oil or chili extract to repel hoppers.',
    image: getPestImage('Brown Leaf hopper'),
    images: getPestImages('Brown Leaf hopper'),
    folderName: 'Brown Leaf hopper',
  },
  {
    slug: 'brown-plant-hopper',
    name: 'Brown Plant Hopper',
    description: 'Small brown insect closely related to leaf hoppers; attacks rice stems and leaves.',
    biology: 'Sucks sap and vectors viruses; multiple generations per season; thrives in high humidity.',
    signs: 'Hopperburn, yellowing, stunted plants, reduced tillering.',
    prevention: 'Field sanitation, balanced fertilization, resistant varieties, and remove weeds.',
    treatment: 'Insecticides, encourage natural predators.',
    diy: 'Spray garlic extract or neem oil on infested areas to repel hoppers.',
    image: getPestImage('Brown Plant Hopper'),
    images: getPestImages('Brown Plant Hopper'),
    folderName: 'Brown Plant Hopper',
  },
  {
    slug: 'mango-leaf-hopper',
    name: 'Mango Leaf Hopper',
    description: 'Small green or yellow insects feeding on mango leaf sap, secreting honeydew that promotes sooty mold.',
    biology: 'Rapid reproduction; nymphs feed on young leaves and shoots; prefer warm climates.',
    signs: 'Curling and drying leaves, black sooty mold, reduced flowering.',
    prevention: 'Prune infested branches, avoid excessive nitrogen, maintain tree health.',
    treatment: 'Insecticidal sprays, neem oil, encourage predators like lacewings.',
    diy: 'Spray water mixed with soap or garlic extract to remove and repel hoppers.',
    image: getPestImage('Mango Leaf Hopper'),
    images: getPestImages('Mango Leaf Hopper'),
    folderName: 'Mango Leaf Hopper',
  },
  {
    slug: 'colorado-potato-beetle',
    name: 'Colorado Potato Beetle',
    description: 'Oval beetle with yellow-orange body and black stripes; feeds on potato leaves.',
    biology:
      'Larvae are reddish with black spots; multiple generations per season; adults feed on foliage and reproduce rapidly.',
    signs: 'Skeletonized leaves, visible larvae, reduced plant vigor.',
    prevention: 'Crop rotation, remove plant debris, use resistant varieties.',
    treatment: 'Handpicking, insecticidal sprays, biological control with predatory beetles.',
    diy: 'Spray a mixture of neem oil or garlic extract on leaves; handpick beetles and larvae.',
    image: getPestImage('Colorado Potato Beetle'),
    images: getPestImages('Colorado Potato Beetle'),
    folderName: 'Colorado Potato Beetle',
  },
  {
    slug: 'red-flour-beetle',
    name: 'Red Flour Beetle',
    description: 'Small reddish-brown beetle infesting stored grains and flour.',
    biology: 'Both larvae and adults feed on grains; can survive months without food; reproduce rapidly in stored grains.',
    signs: 'Contaminated flour, larvae and beetles in storage, off-odor.',
    prevention: 'Properly seal and store grains; keep storage areas dry.',
    treatment: 'Fumigation, cleaning, discard heavily infested products.',
    diy: 'Place bay leaves, dried chili, or cloves in containers to repel beetles.',
    image: getPestImage('Red Flour beetle'),
    images: getPestImages('Red Flour beetle'),
    folderName: 'Red Flour beetle',
  },
  {
    slug: 'armyworm',
    name: 'Armyworm',
    description: 'Caterpillar that attacks cereal crops, grass, and vegetables; green or brown with stripes.',
    biology: 'Larvae feed in groups, multiple generations per year, voracious leaf feeders.',
    signs: 'Defoliated crops, ragged leaves, reduced yield.',
    prevention: 'Early monitoring, field sanitation, crop rotation.',
    treatment: 'Biological control (parasitoids), insecticidal sprays if outbreak occurs.',
    diy: 'Spray neem oil solution or handpick caterpillars at night.',
    image: getPestImage('ArmyWorm'),
    images: getPestImages('ArmyWorm'),
    folderName: 'ArmyWorm',
  },
  {
    slug: 'corn-root-worm',
    name: 'Corn Root Worm',
    description: 'Small beetle; larvae feed on corn roots causing lodging and reduced nutrient uptake.',
    biology: 'Adults feed on leaves and pollen; larvae damage roots; multiple generations per year.',
    signs: 'Stunted plants, lodged stalks, reduced yield.',
    prevention: 'Crop rotation, resistant varieties, soil management.',
    treatment: 'Soil-applied insecticides, foliar sprays for adults.',
    diy: 'Plant trap crops like beans around corn or apply neem-based soil treatment.',
    image: getPestImage('Corn Root Worm'),
    images: getPestImages('Corn Root Worm'),
    folderName: 'Corn Root Worm',
  },
  {
    slug: 'diamondback-moth',
    name: 'Diamondback Moth',
    description: 'Small grayish moth whose larvae feed on cabbage and cruciferous crops.',
    biology: 'Larvae feed on leaf surfaces, reproduce rapidly; multiple generations per season.',
    signs: 'Holes in leaves, leaf skeletonization, visible larvae on undersides.',
    prevention: 'Remove crop residues, intercropping, use nets.',
    treatment: 'Biological control (Bacillus thuringiensis), insecticidal sprays.',
    diy: 'Spray garlic extract or neem oil on leaves to repel larvae.',
    image: getPestImage('Diamond Back Moth'),
    images: getPestImages('Diamond Back Moth'),
    folderName: 'Diamond Back Moth',
  },
  {
    slug: 'tomato-fruit-borer',
    name: 'Tomato Fruit Borer',
    description: 'Moth larvae bore into tomato fruits causing direct internal damage.',
    biology: 'Larvae develop inside fruits; multiple generations per season.',
    signs: 'Rotten fruits, boreholes, frass inside fruit.',
    prevention: 'Remove infested fruits, crop rotation, cover fruit with paper or nets.',
    treatment: 'Insecticidal sprays, pheromone traps, biological control.',
    diy: 'Use neem oil spray and handpick infested fruits early.',
    image: getPestImage('Tomato Fruit Borer'),
    images: getPestImages('Tomato Fruit Borer'),
    folderName: 'Tomato Fruit Borer',
  },
  {
    slug: 'carpenter-ant',
    name: 'Carpenter Ant',
    description: 'Large black or red ants that hollow wood for nesting.',
    biology:
      'Feed on sweets and proteins; colony can contain thousands of ants; create structural damage over time.',
    signs: 'Sawdust-like frass, hollow wood, visible trails.',
    prevention: 'Remove rotting wood, seal cracks, maintain wooden structures.',
    treatment: 'Baits, insecticidal dusts, professional pest control.',
    diy: 'Sprinkle borax mixed with sugar along trails; vinegar spray can repel ants.',
    image: getPestImage('Carpenter Ant'),
    images: getPestImages('Carpenter Ant'),
    folderName: 'Carpenter Ant',
  },
  {
    slug: 'fire-ant',
    name: 'Fire Ant',
    description: 'Small reddish-brown ants with painful sting; build large outdoor mounds.',
    biology: 'Aggressive omnivorous colony; queen lays eggs; workers defend mound.',
    signs: 'Visible mounds, painful stings, allergic reactions in humans.',
    prevention: 'Avoid moving soil, maintain lawns, remove food sources.',
    treatment: 'Fire ant baits, mound treatments with insecticide.',
    diy: 'Pour boiling water over mounds or sprinkle diatomaceous earth to kill ants.',
    image: getPestImage('Fire-Ant'),
    images: getPestImages('Fire-Ant'),
    folderName: 'Fire-Ant',
  },
  {
    slug: 'house-fly',
    name: 'House Fly',
    description: 'Common fly, gray with four dark stripes on thorax; breeds in decaying matter.',
    biology: 'Life cycle 7–10 days; vectors for pathogens causing food contamination.',
    signs: 'Flies buzzing indoors, fecal spots, contaminated food.',
    prevention: 'Proper sanitation, cover food, remove trash, use window screens.',
    treatment: 'Fly traps, insecticides.',
    diy: 'Homemade trap using sugar water or apple cider vinegar in a jar.',
    image: getPestImage('House Fly'),
    images: getPestImages('House Fly'),
    folderName: 'House Fly',
  },
  {
    slug: 'silverleaf-whitefly',
    name: 'Silverleaf Whitefly',
    description: 'Tiny white flying insect; feeds on plant sap of vegetables and ornamentals.',
    biology: 'Multiple generations per year; secretes honeydew promoting sooty mold.',
    signs: 'Yellowing leaves, stunted growth, black sooty mold.',
    prevention: 'Reflective mulches, avoid dense planting, encourage natural predators.',
    treatment: 'Insecticidal soaps, neem oil, biological control.',
    diy: 'Spray water mixed with dish soap or garlic extract on leaves.',
    image: getPestImage('SilverLeaf WhiteFly'),
    images: getPestImages('SilverLeaf WhiteFly'),
    folderName: 'SilverLeaf WhiteFly',
  },
  {
    slug: 'bed-bug',
    name: 'Bed Bug',
    description: 'Small reddish-brown, flattened insect feeding on human blood at night.',
    biology: 'Hide in cracks, reproduce rapidly; lifespan up to a year.',
    signs: 'Bite marks, blood spots on sheets, fecal spots, musty odor.',
    prevention: 'Inspect luggage and furniture, reduce clutter, encase mattresses.',
    treatment: 'Heat treatment, insecticidal sprays, professional pest control.',
    diy: 'Vacuum mattresses, apply diatomaceous earth around bed frames.',
    image: getPestImage('Bed Bug'),
    images: getPestImages('Bed Bug'),
    folderName: 'Bed Bug',
  },
  {
    slug: 'tea-mosquito-bug',
    name: 'Tea Mosquito Bug',
    description: 'Small brown bug feeding on tea shoots and buds, causing black spots and malformed leaves.',
    biology: 'Rapid population growth in warm seasons; multiple generations per year.',
    signs: 'Black spots, curling and drying of leaves, reduced yield.',
    prevention: 'Prune infested shoots, maintain field sanitation, avoid excess nitrogen.',
    treatment: 'Insecticidal sprays, neem oil, encourage natural predators.',
    diy: 'Spray water mixed with garlic or chili extract to repel bugs.',
    image: getPestImage('Tea Mosquito Bug'),
    images: getPestImages('Tea Mosquito Bug'),
    folderName: 'Tea Mosquito Bug',
  },
  {
    slug: 'apple-snail',
    name: 'Apple Snail',
    description: 'Large freshwater snail with spiral shell; feeds on aquatic plants and rice seedlings.',
    biology: 'Lays bright pink eggs above water; larvae and adults feed voraciously on crops.',
    signs: 'Damaged seedlings, snail shells, missing young plants.',
    prevention: 'Water management, remove egg clusters, maintain drainage.',
    treatment: 'Handpicking, molluscicides, traps.',
    diy: 'Sprinkle salt around seedlings or crush egg clusters manually.',
    image: getPestImage('Apple Snail'),
    images: getPestImages('Apple Snail'),
    folderName: 'Apple Snail',
  },
  {
    slug: 'garden-snail',
    name: 'Garden Snail',
    description: 'Terrestrial snail with coiled shell; nocturnal feeder on vegetables and plants.',
    biology: 'Lays eggs in soil; prefers moist conditions; feeds at night.',
    signs: 'Irregular leaf holes, slime trails, damaged seedlings.',
    prevention: 'Remove debris, low moisture, physical barriers.',
    treatment: 'Handpicking, molluscicides, traps.',
    diy: 'Use crushed eggshells or coffee grounds around plants as barrier.',
    image: getPestImage('Garden-snail'),
    images: getPestImages('Garden-snail'),
    folderName: 'Garden-snail',
  },
  {
    slug: 'aphid',
    name: 'Aphid',
    description: 'Small soft-bodied insects, green, yellow, or black; feed on plant sap.',
    biology: 'Reproduce rapidly; excrete honeydew attracting sooty mold; vectors for plant viruses.',
    signs: 'Curling, yellowing leaves, honeydew, sooty mold.',
    prevention: 'Encourage predators (ladybugs, lacewings), remove infested shoots.',
    treatment: 'Insecticidal soaps, neem oil, systemic insecticides.',
    diy: 'Spray a mixture of water and dish soap or garlic solution on infested plants.',
    image: getPestImage('Aphid'),
    images: getPestImages('Aphid'),
    folderName: 'Aphid',
  },
  {
    slug: 'coconut-rhinoceros-beetle',
    name: 'Coconut Rhinoceros Beetle',
    description: 'Large beetle with horn on male; damages coconut and oil palms.',
    biology: 'Adults bore into palm crowns; larvae develop in decomposing organic matter; multiple generations per year.',
    signs: 'Holes in crowns, broken fronds, reduced nut production.',
    prevention: 'Remove breeding sites, maintain clean plantations.',
    treatment: 'Traps, biological control with entomopathogenic fungi, insecticides.',
    diy: 'Place traps with fermented coconut water or fruit to attract and remove adults.',
    image: getPestImage('Coconut Rhinoceros'),
    images: getPestImages('Coconut Rhinoceros'),
    folderName: 'Coconut Rhinoceros',
  },
  {
    slug: 'mosquito',
    name: 'Mosquito',
    description: 'Small flying insect; female feeds on blood; vector for dengue, malaria, and other diseases.',
    biology: 'Lay eggs in stagnant water; complete life cycle in 1–2 weeks; multiple generations per year.',
    signs: 'Bites, presence of larvae in water, nuisance outdoors.',
    prevention: 'Remove standing water, use screens and nets, wear protective clothing.',
    treatment: 'Larvicides, adult insecticides, mosquito repellents.',
    diy: 'Use a mixture of citronella oil or vinegar in water as a mosquito repellent.',
    image: getPestImage('Mosquito'),
    images: getPestImages('Mosquito'),
    folderName: 'Mosquito',
  },
  {
    slug: 'termite',
    name: 'Termite',
    description: 'Small pale insects that feed on wood and cellulose; colonies contain workers, soldiers, and a queen.',
    biology: 'Cause structural damage over time; thrive in moist wood; reproduce continuously.',
    signs: 'Mud tubes, hollow wood, discarded wings, damaged structures.',
    prevention: 'Remove wood-soil contact, treat wooden structures, reduce moisture.',
    treatment: 'Termiticide application, baits, professional pest control.',
    diy: 'Apply borax solution to wooden structures; keep wood dry and ventilated.',
    image: getPestImage('Termite'),
    images: getPestImages('Termite'),
    folderName: 'Termite',
  },
];
