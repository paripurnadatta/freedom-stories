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
