const projectlisting = [
  {
    id: 1,
    img: '/images/xv6.png',
    name: 'XV6 OS',
    year: 2024,
    description:
      "Based on MIT's 6.S081 Operating Systems course, implement several features in the xv6 OS. System calls were utilized to create user-mode utilities like sleep, primes, find, and xargs. Kernel modifications added syscall debugging features, including page table printing, backtrace, and lazy allocation. Additionally, Copy-On-Write (COW) was implemented in fork() to improve performance and memory efficiency in high-read scenarios by reducing memory duplication",
    stack: ['C', 'Unix'],
    github: 'https://github.com/rruiqiu/CV-frontend',
    demo: 'https://rruiqiu.github.io/Blog/OS/OSlab/',
  },
  {
    id: 2,
    img: '/images/comingsoon.jpg',
    name: 'Autonomous Driving Bike - Capstone',
    year: 2024,
    description:
      'A really interesting autonmous driving bike project aim to resolve the last-mile problem',
    stack: ['Raspi', 'Linux', 'I2C/UART', 'AWS EC2'],
    // github: 'https://github.com/rruiqiu/SPATIAL-MAPPING-USING-TIME-OF-FLIGHT',
    // demo: "https://ruiqiu.netlify.app/",
  },
  // {
  //   id: 3,
  //   img: '/images/HPC.png',
  //   name: 'High Peformance Computing Labs',
  //   year: 2024,
  //   description:
  //     'A new HPC course offered at Mac that contain several interesting labs include performance optimization and profiling on key neural network operation like GEMM, GEMV, SPMM, SPMV in supercomputer(SciNet). Some code optimization techniques were used are vectorization through Intel intrinsics, loop unrolling, parallel programming with OpenMP, and GPU programming with OpenCL and CUDA. Also use GoogleTest to write unit tests.',
  //   stack: ['C++', 'Linux', 'GoogeTest', 'OpenMP', 'CUDA'],
  //   // github: 'https://github.com/rruiqiu/SPATIAL-MAPPING-USING-TIME-OF-FLIGHT',
  //   // demo: "https://ruiqiu.netlify.app/",
  // },
]
export default projectlisting
