interface ProjectListing {
  id: number
  img: string
  name: string
  year: number
  description: string
  stack: string[]
  github?: string // Optional property
  demo?: string // Optional property
}

const projectlisting: ProjectListing[] = [
  // {
  //   id: 1,
  //   img: '/images/comingsoon.jpg',
  //   name: 'Autonomous Driving Bike - Capstone',
  //   year: 2025,
  //   description:
  //     'From hardware to software, building an interesting autonmous driving bike project aim to resolve the last-mile problem. (Looking for Mobile side collaboration and commercialization opportunities.)',
  //   stack: ['Raspi', 'Linux', 'MQTT', 'AWS EC2', 'Redis'],
  //   // github: 'https://github.com/rruiqiu/SPATIAL-MAPPING-USING-TIME-OF-FLIGHT',
  //   // demo: "https://ruiqiu.netlify.app/",
  // },
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
