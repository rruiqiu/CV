const projectlisting = [
  {
    id: 1,
    img: 'https://bing.biturl.top/?resolution=1920&format=image&index=0&mkt=en-CA',
    name: 'Personal Website',
    year: 2024,
    description:
      'Designed and built this beautiful online personal portfolio from scratch using Next.js and TypeScript, utilize server rendering technique to improve client response time and set up github actions to auto deploy through Vercel.',
    stack: ['Next.js', 'TypeScript', 'Vercel'],
    github: 'https://github.com/rruiqiu/CV-frontend',
    demo: 'https://www.richardqiu.me/',
  },
  {
    id: 2,
    img: '/images/tofsensor.png',
    name: 'Spatial Mapping Device',
    year: 2022,
    description:
      'Designed and Built an embedded spatial measurement system using a time-of-flight sensor to acquire in-formation about the area surrounded clients. Using Python NumPy and Open3D to map spatial information into 3D. UART and I2C protocol for Hardware and Software communication.',
    stack: ['Embedded C', 'Python', 'MCU', 'I2C/UART'],
    github: 'https://github.com/rruiqiu/SPATIAL-MAPPING-USING-TIME-OF-FLIGHT',
    // demo: "https://ruiqiu.netlify.app/",
  },
  {
    id: 3,
    img: '/images/plant.png',
    name: 'McMaster Recycling Plant Sorting System',
    year: 2022,
    description:
      'In a small group of three, designed and developed an efficient Python program for the McMaster Recycling Plant Sorting System, by using the IR(infrared) techniques, significantly increased the sorting accuracy from 50% to 93%',
    stack: ['Python', 'Pandas'],
    github: 'https://github.com/rruiqiu/Recycling-Plant-Sorting-System',
  },
  {
    id: 4,
    img: '/images/NNS.png',
    name: 'NNS(Newcomer Navigating System) - deltahack9',
    year: 2023,
    description:
      'As a team of international students, we realized the challenges that incoming international students face when coming to Canada. From securing housing to opening a credit card, these essential tasks can be overwhelming. Our solution is to create a centralized platform that consolidates the most important resources and information',
    stack: ['React', 'GoogleMapApi'],
    github: 'https://github.com/rruiqiu/delatahack9',
    demo: 'https://devpost.com/software/nns-newcomer-navigating-system',
  },
  {
    id: 5,
    img: '/images/AEV.png',
    name: 'MAC AEV(Autonomous Electric Vehicle)',
    year: 2023,
    description:
      'Developed and integrated software and hardware modules for the McMaster AEV, which is built on a small-scale(1/10th) RC vehicle platform. Utilized Jeston Nano and ROS as the running environment for the AEV programs. Programmed the Electronic Speed Controller using the VESC tool. Utilized the SLAM to simultaneously construct a map of the unknown environment and localized itself in the map to perform autonmous driving',
    stack: ['C/C++', 'Python', 'VESC'],
    github: 'https://github.com/rruiqiu/MAC_AEV',
    demo: 'https://ruiqiu.netlify.app/AEVdemo',
  },
  {
    id: 6,
    img: '/images/ekanban.jpg',
    name: 'Warehouse Ordering System - Veoneer',
    year: 2023,
    description:
      'Developed an advanced warehouse reels ordering system with features for real-time order display, comprehensive history tracking, and dynamic data fetching and syncing. This system reduced cycle time by 70%, streamlining order processing and significantly improving operational efficiency.',
    stack: ['Next.js', 'TypeScript', 'Flask', 'FastAPI'],
    // github: 'https://github.com/rruiqiu/MAC_AEV',
    // demo: 'https://ruiqiu.netlify.app/AEVdemo',
  },
  {
    id: 7,
    img: '/images/image.jpg',
    name: 'Smart Receiving Device - Veoneer',
    year: 2023,
    description:
      'Developed the SRD (Smart Receiving Device) in the warehouse using C#, integrating the Keyence SR-5000X camera and additional sensor devices to enable up to 8 bar-code reads per scan, resulting in a 50% increase in production efficiency and improved materials traceability',
    stack: ['C#', 'Python'],
    // github: 'https://github.com/rruiqiu/MAC_AEV',
    // demo: 'https://ruiqiu.netlify.app/AEVdemo',
  },
]
export default projectlisting
