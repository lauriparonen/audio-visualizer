A collection of 3D audio visualizers, made with react-three & GLSL.

Asks the user to input an audio file, and loads the selected visualizer. 
The figure is animated by the audio's frequency data, fed into its shader code as a three.js data texture uniform.

## Visualizers:
# Particle sphere
- sphere with particles as mesh material
- changes the color and size of the particles based on the frequency data to form a spiral pattern
- orbit controls on; camera position alterable via mouse -> user can go inside the sphere as well

# Particle cloud
- a cube of randomly distributed particles
- particles change position and color based on the frequency data
- orbit controls on but limited so the camera stays within the cube

# Basic 2D frequency visualizer
- always visible underneath the audio controls
- displays the FFT of the audio with bars

More to be implemented 

Problems:
- Three.WebGL renderer loses context after changing the visualizer from the dropdown menu
- Need to reconfigure audio context logic; occasional gain feedback loops happen

Future feature ideas:
- Currently only accepts audio file input, plan is to include support for SoundCloud songs via their api
- Using Dat GUI for customizing the visualizers

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
