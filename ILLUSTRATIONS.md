# Illustrations

Painted illustrations lead the home page and each story. Until a painting exists, the site shows a real archive photograph in its place, so nothing ever looks empty.

## The house style

Paste this at the end of every prompt, so all the paintings look like they belong to the same book:

```
Painterly storybook illustration for a children's history book about India's freedom struggle. Rich, warm gouache and oil-paint texture with visible brushwork, cinematic lighting, warm saffron and amber light against deep indigo shadows, touches of leaf green. Historically accurate 1900s–1940s Indian clothing, architecture and objects. Faces calm and dignified. No text, no letters, no captions, no logos, no watermark, no borders. No gore, no blood, no weapons pointed at anyone. Do not include the Indian national flag or the Ashoka Chakra.
```

Leave out the last sentence only for a scene where people historically carried a flag, and even then keep the flag small and part of the scene, never a decoration.

## Sizes

| Where it goes | Shape | Generate at | Keep in the middle |
|---|---|---|---|
| Home page hero | very wide (21:9) | 2560 × 1100 | the right two-thirds; the left third sits behind the headline |
| Flagship story | wide (16:7.5) | 2400 × 1125 | the centre; cards crop it to 4:3 |
| Short story | extra wide (16:6) | 2400 × 900 | the centre; cards crop it to 4:3 |

Any format is fine (PNG, JPG, WebP). Send it over, and it gets resized, converted and added with its credit line.

## Prompts

### Home page hero
```
A wide panoramic scene at golden hour in 1920s–1930s India: a long, peaceful procession of ordinary people (farmers in turbans, women in saris, students, an old man with a walking stick, children) walking together along a dusty road toward a distant city skyline with domes and old towers. Some carry handwritten placards with no readable words. Dust glowing in the evening light, birds overhead, a banyan tree on the right. The left third of the image is soft open sky and road with little detail, for text to sit on. Ultra-wide composition, 21:9.
```

### Flagship story: "The bomb that was meant to miss"
```
Inside a grand round colonial assembly hall in Delhi, 8 April 1929. High in the visitors' gallery, two young Indian men stand calmly at the railing: one about 21, slim face, thin moustache, wearing a brown felt hat and a plain shirt; beside him a young man in a white kurta. Below them, a cloud of white smoke rises over empty wooden benches, and hundreds of small paper leaflets drift down through shafts of light from tall windows. British officials in suits are turning away in surprise. The two young men are not running. Dramatic light, sense of a frozen moment. Wide composition, 16:9, main figures slightly right of centre.
```

### Short story: "The disguise on the train"
```
A crowded railway platform in Lahore at dawn, December 1928. A steam train breathes white clouds. Walking calmly toward a carriage is a young man about 21 with short hair and no beard, in a smart Western suit and a felt hat, like a rich gentleman. Beside him walks a young Indian woman in a sari holding a small child in her arms, and behind them a young man dressed as a servant carries suitcases. British-era policemen in khaki uniforms and turbans stand along the platform, scanning faces, not noticing them. Warm lamplight, cool morning blue, quiet tension. Extra-wide composition, 16:6, the family in the centre.
```

## Adding a painting to a story

Once the image is in `public/illustrations/`, add this to the story's facts block:

```yaml
illustration:
  src: "/illustrations/the-disguise-on-the-train.webp"
  alt: "A young man in a hat walks along a Lahore railway platform with a woman, a child and a servant, past watching policemen."
  caption: "An artist's impression of the escape from Lahore, December 1928."
  credit: "Illustration made for The Struggle for Freedom"
```

Captions for paintings always say "An artist's impression", so readers can tell a painting from a historical photograph.

### Flagship story: "The last day in Lahore jail"
```
Evening, 23 March 1931, inside a colonial-era Indian prison yard in Lahore. Three young Indian men in plain white kurta-pyjamas walk side by side with their arms linked, the one in the middle slim with a thin moustache and short hair. They are calm, almost smiling, heads held high. Behind barred cell windows along the yard, other prisoners press their faces to the bars. Warm lantern light against a deep indigo dusk sky, long shadows on the ground. No gallows, no ropes, no guards' weapons in view. Wide composition, 16:9.
```

### "The wedding he ran away from"
```
A quiet early morning in a 1920s Punjabi family home in Lahore. A sixteen-year-old boy in a white kurta and a small turban places a folded handwritten letter on a wooden table beside a brass lamp, glancing back toward a doorway. A small cloth bundle is slung over his shoulder. Through the open door, soft dawn light and a lane leading away. Tender, bittersweet mood. Extra-wide composition, 16:6.
```

### "The man called Balwant"
```
A busy 1925 Delhi newspaper office: wooden desks, stacks of paper, a hand-operated printing press in the background, ink-stained workers. In the centre, a quiet young man of about seventeen with a small turban writes with a dip pen, while an older editor reads over a proof sheet beside him, unaware of who he really is. Lamplight and dust in the air. Extra-wide composition, 16:6.
```

### "Sixty thousand rupees for one young man"
```
A 1927 Lahore courtroom in the British colonial style: high ceilings, slow ceiling fans, a British judge at a raised wooden bench. A nineteen-year-old Indian man with long hair tied in a knot and a short beard stands calm and upright at the dock. In the foreground, a clerk's hand slides an official paper across a desk beside a stack of ledgers. Serious, quiet mood. Extra-wide composition, 16:6.
```

### "The wrong man on 17 December"
```
A winter afternoon in Lahore, December 1928, outside a red-brick British colonial police office with arched verandas. Across the street, a young Indian man in a shawl, half hidden behind a tree, raises his hand as a signal toward the gate, where a young British officer is stepping out to a waiting motorcycle. The scene is frozen just before anything happens, full of tension. No weapons visible, no violence shown. Long winter shadows, cold light. Extra-wide composition, 16:6.
```

### "The hat in the photograph"
```
Inside a small 1929 photography studio near Kashmiri Gate, Delhi: a painted backdrop, a wooden box camera on a tripod with a black cloth, a photographer bent behind it. A young man of 21 with a thin moustache sits very straight on a stool, wearing a felt hat tipped slightly, looking into the lens. Beside the camera, a second young man in a white shirt and no hat waits his turn. A hat stand with spare hats in the corner. Warm window light, sepia-tinged mood. Extra-wide composition, 16:6.
```

### "More than a hundred days without food"
```
A bare 1929 prison cell in Punjab. A thin young Indian man sits upright on a narrow cot, a blanket around his shoulders, calmly reading a book. On the floor beside him sits an untouched metal plate of food. A shaft of light falls through a high barred window. Quiet determination, not suffering. Extra-wide composition, 16:6.
```

### "404 pages for Bhagat Singh"
```
Close view of a young prisoner's hands writing carefully in a worn hardbound notebook by the light of an oil lamp, in a 1930 jail cell. A small stack of borrowed books beside him: some in English, one with Urdu script on the spine (no readable words). Ink pot, dip pen, the stone wall softly lit. Intimate, thoughtful mood. Extra-wide composition, 16:6.
```

### "Why I am an atheist"
```
Two prisoners talk in a 1930 Lahore jail courtyard at dusk. An older Sikh man with a long white beard and a dark turban gestures earnestly, holding a small prayer book. Facing him, a young man in a white kurta with short hair and a thin moustache listens respectfully, a notebook under his arm. Mutual respect between them, no anger. Warm last light over the jail walls. Extra-wide composition, 16:6.
```

### "The letter to his father"
```
A middle-aged Sikh man in a white turban and kurta, with a greying beard, stands in a doorway of a 1930 Punjab home reading a handwritten letter, his face full of grief and pride at once. Behind him, a quiet courtyard with a charpai and a neem tree. Soft afternoon light. Deeply emotional but restrained. Extra-wide composition, 16:6.
```

### "Shoot us, don't hang us"
```
Inside a 1931 Lahore jail cell at night, three young Indian men sit close together around a single oil lamp. The one in the middle writes on a sheet of paper while the other two read over his shoulders, serious and determined. Bars and stone walls in deep indigo shadow, warm lamplight on their faces. No weapons. Extra-wide composition, 16:6.
```

### "The planted guns and the bottle of earth"
```
A storybook scene in two halves, softly blended. Left: a three-year-old Punjabi boy in 1910 kneels in a green field in Banga, pressing small sticks into the soil, while his father in a white turban and a friend look on, amused. Right: an eleven-year-old boy in 1919 holds a small glass bottle of earth, with his sister placing marigold flowers beside it. Dreamlike, memory-like haze between the two scenes. Extra-wide composition, 16:6.
```

### "The village India swapped for twelve"
```
Dawn over the wide Sutlej river in Punjab, flat green fields, a long iron bridge in the distance. On the near bank, a simple memorial with three bronze-coloured statues of young men with raised arms stands on a stone platform, garlanded with marigolds. A few villagers walk toward it carrying flowers. Peaceful, golden morning mist. Extra-wide composition, 16:6.
```

### "The square in Lahore"
```
A busy modern-day road crossing in Lahore at golden hour: rickshaws, motorbikes, buses, old trees, a mix of old and new buildings. On the corner, a man in a dark suit holding a folder of papers looks up at a blank street-name signboard on a pole. Ordinary city life all around him. Warm evening light, gentle and hopeful. Extra-wide composition, 16:6.
```
