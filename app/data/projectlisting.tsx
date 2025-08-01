const projectlisting = [
  {
    id: 1,
    img: '/images/auto_bike.mp4',
    name: 'Autonomous Driving Bike - ECE Capstone Winner',
    year: 2025,
    description:
      'Built an autonomous self-driving bike from scratch to address the last-mile bike sharing problem. Developed a Next.js web app with Google Maps integration and a FastAPI backend hosted on AWS EC2, using MQTT for bi-directional communication between a Raspberry Pi and the server, and PID-based steering motor control on an ESP32. Hardware integration included motor driver PWM control, GPS data acquisition, Bluetooth-based manual override, and circuit design. Awarded 3rd Place in the McMaster ECE Capstone Competition.',
    stack: ['Full-Stack', 'Linux', 'MQTT', 'AWS EC2', 'Raspberry Pi'],
    github: 'https://github.com/Auto-Bike',
    demo: 'https://www.macvideo.ca/media/t/1_e66vxp7g',
  },
  {
    id: 2,
    img: 'https://bing.biturl.top/?resolution=1920&format=image&index=0&mkt=en-CA',
    name: 'Personal Website',
    year: 2024,
    description:
      'Designed and developed this beautiful personal portfolio from scratch using Next.js and TypeScript. Optimized performance with server-side rendering for faster client response times and automated deployments via GitHub Actions and Vercel.',
    stack: ['Next.js', 'TypeScript', 'Vercel'],
    github: 'https://github.com/rruiqiu/CV',
    demo: 'https://www.richardqiu.me/',
  },
  {
    id: 3,
    img: '/images/ekanban.jpg',
    name: 'Warehouse Ordering System - Veoneer',
    year: 2024,
    description:
      'Designed and developed an advanced warehouse materials ordering system with real-time order display, detailed history tracking, and dynamic data synchronization. Optimized order processing, reducing cycle time by 70% and significantly enhancing operational efficiency.',
    stack: ['Next.js', 'TypeScript', 'Flask', 'FastAPI'],
  },
  {
    id: 4,
    img: '/images/SRD.jpg',
    name: 'Smart Receiving Device - Veoneer',
    year: 2024,
    description:
      'Developed a Smart Receiving Device for warehouse automation using C#, integrating the Keyence SR-5000X camera and multiple sensors to capture up to 8 barcodes per scan. Enhanced materials traceability and boosted production efficiency by 50%.',
    stack: ['C#', '.Net Windows Forms', 'Python'],
  },
  {
    id: 5,
    img: '/images/HPC.png',
    name: 'High Peformance Computing',
    year: 2024,
    description:
      'Optimized, profiled, and tested key machine learning operations (GEMM, GEMV, SPMM, SPMV) on the SciNet supercomputer using C++. Achieved a 5000x speedup by implementing cache-efficient algorithms and leveraging vectorization (AVX), CPU parallelism (OpenMP), and GPU parallelism (CUDA).',
    stack: ['C++', 'Linux', 'GoogeTest', 'OpenMP', 'CUDA'],
    github: 'https://github.com/rruiqiu/HPC',
  },
  {
    id: 6,
    img: '/images/lunar_lander.mp4',
    name: 'Lunar Lander Agent Landing',
    year: 2024,
    description:
      'Developed a Lunar Lander agent using Deep Q-Networks (DQN) and Reinforcement Learning, achieving an average score of 265. Trained the agent in the OpenAI Gym environment with PyTorch for neural network implementation.',
    stack: ['Pytorch', 'DQN/RL', 'OpenAI Gym', 'Neural Network'],
    github: 'https://github.com/rruiqiu/Machine-Learning',
  },
  {
    id: 7,
    img: '/images/4dm4.jpg',
    name: 'Out-of-Order Execution Pipeline',
    year: 2024,
    description:
      'Developed an out-of-order CPU execution model with Reorder Buffer (ROB) and Load-Store Queue (LSQ) to optimize instruction processing. Designed instruction fetching, allocation, and commit mechanisms for parallelism. Improved performance with load forwarding to reduce memory latency. Analyzed IPC, ROB, and LSQ size to identify execution bottlenecks.',
    stack: ['C++', 'Octopus(Cache Simulator)'],
  },
  {
    id: 8,
    img: '/images/xv6.png',
    name: 'XV6 OS',
    year: 2024,
    description:
      'Enhanced the xv6 operating system by implementing custom system calls and kernel-level features as part of MIT’s 6.S081 Operating Systems course. Developed user-space utilities (sleep, primes, find, xargs) and introduced debugging tools such as page table printing, backtracing, and lazy memory allocation.',
    stack: ['C', 'Unix'],
  },
  {
    id: 9,
    img: '/images/AEV.png',
    name: 'MAC AEV(Autonomous Electric Vehicle)',
    year: 2023,
    description:
      'Developed and integrated software and hardware modules for the McMaster AEV, a 1/10th-scale RC vehicle platform. Utilized Jetson Nano and ROS for the AEV’s operating environment, programmed the Electronic Speed Controller with the VESC tool, and implemented SLAM for simultaneous mapping and self-localization to enable autonomous driving.',
    stack: ['C/C++', 'Python', 'VESC'],
    github: 'https://github.com/rruiqiu/MAC_AEV',
    demo: '/images/MacAEV.mov',
  },
  {
    id: 10,
    img: '/images/NNS.png',
    name: 'NNS(Newcomer Navigating System) - deltahack9',
    year: 2023,
    description:
      'As a team of international students, we recognized the challenges newcomers face in Canada, from securing housing to opening a credit card. To address this, we developed a centralized platform that consolidates essential resources and information, simplifying the transition for incoming international students.',
    stack: ['React', 'GoogleMapApi'],
    github: 'https://github.com/rruiqiu/delatahack9',
    demo: 'https://devpost.com/software/nns-newcomer-navigating-system',
  },
  {
    id: 11,
    img: '/images/tofsensor.png',
    name: 'Spatial Mapping Device',
    year: 2022,
    description:
      'Designed and built an embedded spatial measurement system using a ToF (Time-of-Flight) sensor to capture surrounding area data. Utilized Python NumPy and Open3D for 3D spatial mapping. Utilized UART and I2C for efficient software-hardware communication.',
    stack: ['Embedded C', 'Python', 'MCU', 'I2C/UART'],
    github: 'https://github.com/rruiqiu/SPATIAL-MAPPING-USING-TIME-OF-FLIGHT',
  },
  {
    id: 12,
    img: '/images/plant.png',
    name: 'McMaster Recycling Plant Sorting System',
    year: 2022,
    description:
      'Collaborated in a team of three to design and develop an efficient Python program for the McMaster Recycling Plant Sorting System. Leveraged infrared (IR) technology to enhance sorting accuracy, improving it from 50% to 93%.',
    stack: ['Python', 'Pandas'],
    github: 'https://github.com/rruiqiu/Recycling-Plant-Sorting-System',
  },
]
export default projectlisting

// const projectlisting = [
//   {
//     id: 1,
//     img: 'https://bing.biturl.top/?resolution=1920&format=image&index=0&mkt=en-CA',
//     name: 'Personal Website',
//     year: 2024,
//     description:
//       'Designed and developed this beautiful personal portfolio from scratch using Next.js and TypeScript. Optimized performance with server-side rendering for faster client response times and automated deployments via GitHub Actions and Vercel.',
//     stack: ['Next.js', 'TypeScript', 'Vercel'],
//     github: 'https://github.com/rruiqiu/CV',
//     demo: 'https://www.richardqiu.me/',
//   },
//   {
//     id: 2,
//     img: '/images/tofsensor.png',
//     name: 'Spatial Mapping Device',
//     year: 2022,
//     description:
//       'Designed and built an embedded spatial measurement system using a ToF (Time-of-Flight) sensor to capture surrounding area data. Utilized Python NumPy and Open3D for 3D spatial mapping. Utilized UART and I2C for efficient software-hardware communication.',
//     stack: ['Embedded C', 'Python', 'MCU', 'I2C/UART'],
//     github: 'https://github.com/rruiqiu/SPATIAL-MAPPING-USING-TIME-OF-FLIGHT',
//     // demo: "https://ruiqiu.netlify.app/",
//   },
//   {
//     id: 3,
//     img: '/images/plant.png',
//     name: 'McMaster Recycling Plant Sorting System',
//     year: 2022,
//     description:
//       'Collaborated in a team of three to design and develop an efficient Python program for the McMaster Recycling Plant Sorting System. Leveraged infrared (IR) technology to enhance sorting accuracy, improving it from 50% to 93%.',
//     stack: ['Python', 'Pandas'],
//     github: 'https://github.com/rruiqiu/Recycling-Plant-Sorting-System',
//   },
//   {
//     id: 4,
//     img: '/images/NNS.png',
//     name: 'NNS(Newcomer Navigating System) - deltahack9',
//     year: 2023,
//     description:
//       'As a team of international students, we recognized the challenges newcomers face in Canada, from securing housing to opening a credit card. To address this, we developed a centralized platform that consolidates essential resources and information, simplifying the transition for incoming international students.',
//     stack: ['React', 'GoogleMapApi'],
//     github: 'https://github.com/rruiqiu/delatahack9',
//     demo: 'https://devpost.com/software/nns-newcomer-navigating-system',
//   },
//   {
//     id: 5,
//     img: '/images/AEV.png',
//     name: 'MAC AEV(Autonomous Electric Vehicle)',
//     year: 2023,
//     description:
//       'Developed and integrated software and hardware modules for the McMaster AEV, a 1/10th-scale RC vehicle platform. Utilized Jetson Nano and ROS for the AEV’s operating environment, programmed the Electronic Speed Controller with the VESC tool, and implemented SLAM for simultaneous mapping and self-localization to enable autonomous driving.',
//     stack: ['C/C++', 'Python', 'VESC'],
//     github: 'https://github.com/rruiqiu/MAC_AEV',
//     demo: '/images/MacAEV.mov',
//   },
//   {
//     id: 6,
//     img: '/images/ekanban.jpg',
//     name: 'Warehouse Ordering System - Veoneer',
//     year: 2024,
//     description:
//       'Designed and developed an advanced warehouse materials ordering system with real-time order display, detailed history tracking, and dynamic data synchronization. Optimized order processing, reducing cycle time by 70% and significantly enhancing operational efficiency.',
//     stack: ['Next.js', 'TypeScript', 'Flask', 'FastAPI'],
//     // github: 'https://github.com/rruiqiu/MAC_AEV',
//     // demo: 'https://ruiqiu.netlify.app/AEVdemo',
//   },
//   {
//     id: 7,
//     img: '/images/SRD.jpg',
//     name: 'Smart Receiving Device - Veoneer',
//     year: 2024,
//     description:
//       'Developed a Smart Receiving Device for warehouse automation using C#, integrating the Keyence SR-5000X camera and multiple sensors to capture up to 8 barcodes per scan. Enhanced materials traceability and boosted production efficiency by 50%.',
//     stack: ['C#', '.Net Windows Forms', 'Python'],
//     // github: 'https://github.com/rruiqiu/MAC_AEV',
//     // demo: 'https://ruiqiu.netlify.app/AEVdemo',
//   },
//   {
//     id: 8,
//     img: '/images/HPC.png',
//     name: 'High Peformance Computing',
//     year: 2024,
//     description:
//       'Optimized, profiled, and tested key machine learning operations (GEMM, GEMV, SPMM, SPMV) on the SciNet supercomputer using C++. Achieved a 5000x speedup by implementing cache-efficient algorithms and leveraging vectorization (AVX), CPU parallelism (OpenMP), and GPU parallelism (CUDA).',
//     stack: ['C++', 'Linux', 'GoogeTest', 'OpenMP', 'CUDA'],
//     github: 'https://github.com/rruiqiu/HPC',
//     // demo: 'https://ruiqiu.netlify.app/AEVdemo',
//   },
//   {
//     id: 9,
//     img: '/images/lunar_lander.mp4',
//     name: 'Lunar Lander Agent Landing',
//     year: 2024,
//     description:
//       'Developed a Lunar Lander agent using Deep Q-Networks (DQN) and Reinforcement Learning, achieving an average score of 265. Trained the agent in the OpenAI Gym environment with PyTorch for neural network implementation.',
//     stack: ['Pytorch', 'DQN/RL', 'OpenAI Gym', 'Neural Network'],
//     github: 'https://github.com/rruiqiu/Machine-Learning',
//     // demo: 'https://ruiqiu.netlify.app/AEVdemo',
//   },
//   {
//     id: 10,
//     img: '/images/4dm4.jpg',
//     name: 'Out-of-Order Execution Pipeline',
//     year: 2024,
//     description:
//       'Developed an out-of-order CPU execution model with Reorder Buffer (ROB) and Load-Store Queue (LSQ) to optimize instruction processing. Designed instruction fetching, allocation, and commit mechanisms for parallelism. Improved performance with load forwarding to reduce memory latency. Analyzed IPC, ROB, and LSQ size to identify execution bottlenecks.',
//     stack: ['C++', 'Octopus(Cache Simulator)'],
//     // github:
//     //   'https://github.com/rruiqiu/Machine-Learning/blob/main/lab5/DQN_code/Agent.py',
//     // demo: 'https://ruiqiu.netlify.app/AEVdemo',
//   },
//   {
//     id: 11,
//     img: '/images/xv6.png',
//     name: 'XV6 OS',
//     year: 2024,
//     description:
//       'Enhanced the xv6 operating system by implementing custom system calls and kernel-level features as part of MIT’s 6.S081 Operating Systems course. Developed user-space utilities (sleep, primes, find, xargs) and introduced debugging tools such as page table printing, backtracing, and lazy memory allocation.',
//     stack: ['C', 'Unix'],
//     // github: 'https://github.com/rruiqiu/xv6-riscv',
//     // demo: 'https://rruiqiu.github.io/Blog/OS/OSlab/',
//   },
//   {
//     id: 12,
//     img: '/images/auto_bike.mp4',
//     name: 'Autonomous Driving Bike - ECE Capstone Winner',
//     year: 2025,
//     description:
//       'Built an autonomous self-driving bike from scratch to address the last-mile bike sharing problem. Developed a Next.js web app with Google Maps integration and a FastAPI backend hosted on AWS EC2, using MQTT for bi-directional communication between a Raspberry Pi and the server, and PID-based steering motor control on an ESP32. Hardware integration included motor driver PWM control, GPS data acquisition, Bluetooth-based manual override, and circuit design. Awarded 3rd Place in the McMaster ECE Capstone Competition.',
//     stack: ['Full-Stack', 'Linux', 'MQTT', 'AWS EC2', 'Raspberry Pi'],
//     github: 'https://github.com/Auto-Bike',
//     demo: 'https://www.macvideo.ca/media/t/1_e66vxp7g',
//   },
// ]
// export default projectlisting
